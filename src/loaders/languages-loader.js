const logger = require('@src/logger')
const fs = require('fs')
const path = require('path')

module.exports = {
    /**
     * Loads languages from the specified folder path and process the literals, assigning them to the process object.
     * @param {string} folderPath - The path of the folder containing the languages.
     */
    loadLanguages: (folderPath) => {

        // Log the loading of languages
        logger.info('Loading languages...')

        // Check if the folder exists
        if (!fs.existsSync(folderPath))
            return logger.error(`Could not load languages: ${folderPath} does not exist`)

        // Default language, en, is used if the LANG environment variable is not set
        const defaultLanguage = 'en'
        const language = process.env.LANGUAGE || defaultLanguage

        // Object to store the literals 
        let mergedLangObj = {}

        // If selected language is default, process it directly
        if (language === defaultLanguage) {
            mergedLangObj = loadLanguage(language)
        }
        else {
            // Load the selected language and merge it with the default language if needed
            const languageObj = loadLanguage(language)
            const defaultLangObj = loadLanguage(defaultLanguage)

            if (!languageObj)
                mergedLangObj = defaultLangObj
            else
                mergedLangObj = mergeLangObj(languageObj, defaultLangObj)
        }

        // Check if the language object was loaded
        if (!mergedLangObj)
            return logger.error(`Could not load any language, no literals will be available`)

        // Log the processing of literals
        logger.info(`Processing literals...`)

        // Process the literals and assign them to the process object
        process.literals = processLiterals(mergedLangObj)

        // Log the completion of the processing
        logger.info(`Loaded literals`)
    }
}

/**
 * Loads the specified language
 * @param {string} language - The language to load.
 * @returns {object|null} The language file or null if the language is not configured correctly.
 **/
function loadLanguage(language) {

    // Check if the language folder exists
    const langPath = path.resolve(__dirname, `../../languages/${language}`)
    if (!fs.existsSync(langPath))
        return logger.error(`Language folder does not exist: ${langPath}`)


    // Load language files
    const loadedFiles = loadLanguageFiles(langPath)

    // Check if the language files were loaded
    if (!loadedFiles || loadedFiles.length === 0)
        return logger.error(`Could not load language ${language}: missing language files`)

    // Log the loaded language 
    logger.info(`Loaded language: ${language}`)

    // Return the language object
    return loadedFiles
}

/**
 * Loads language files (json) recursively from the specified folder path.
 * @param {String} folderPath - The path of the folder containing the language files.
 * @returns {Object} - An object containing the loaded language files, following the folder structure.
 */
function loadLanguageFiles(folderPath) {

    const result = {}

    // Read the contents of the directory
    fs.readdirSync(folderPath).forEach((file) => {
        try {
            // Get the full path of the file
            const fullPath = path.join(folderPath, file)

            // If it's a directory, recursively load its files
            if (fs.statSync(fullPath).isDirectory()) {
                result[file] = loadLanguageFiles(fullPath)
            }
            else {
                if (!file.endsWith('.json'))
                    logger.warn(`Skipping non-JSON file: ${file}`)
                else {
                    // Read and parse the JSON file
                    const content = JSON.parse(fs.readFileSync(fullPath))

                    // Assign to the result object with the file name without extension
                    result[path.basename(file, '.json')] = content
                }
            }
        } catch (error) {
            logger.warn(`Failed to load JSON file: ${fullPath}`)
        }
    })

    return result
}

/**
 * Merge the fetched object from the selected language with the default language object recursively.
 * The default language values will be used if they don't exist in the selected language.
 * @param {object|null} selectedLangObj - The object from the selected language.
 * @param {object|null} defaultLangObj - The object from the default language.
 * @returns {object} - The merged object with fallbacks from the default language.
 */
function mergeLangObj(selectedLangObj, defaultLangObj) {
    if (!selectedLangObj) return defaultLangObj
    if (!defaultLangObj) return selectedLangObj

    // Create a new object to store the merged result
    const mergedObj = Array.isArray(selectedLangObj) ? [] : {}

    // Iterate over the keys in defaultLangObj to merge properties recursively
    for (const key in defaultLangObj) {
        if (defaultLangObj.hasOwnProperty(key)) {
            // If both selected and default are objects, merge recursively
            if (typeof selectedLangObj[key] === 'object' && typeof defaultLangObj[key] === 'object') {
                mergedObj[key] = mergeLangObj(selectedLangObj[key], defaultLangObj[key])
            } else {
                // Log a warning if the key only exists in the default language
                if (!selectedLangObj.hasOwnProperty(key)) {
                    logger.warn(`Literal '${key}' not found in selected language, using default language value`)
                }

                // Use selectedLangObj value if it exists, otherwise use defaultLangObj value
                mergedObj[key] = selectedLangObj.hasOwnProperty(key)
                    ? selectedLangObj[key]
                    : defaultLangObj[key]
            }
        }
    }

    // Add keys that only exist in selectedLangObj
    for (const key in selectedLangObj) {
        if (!mergedObj.hasOwnProperty(key)) {
            mergedObj[key] = selectedLangObj[key]
        }
    }

    return mergedObj
}

/**
 * Recursively process each literal in the object, turning dynamic literals into functions
 * @param {object} obj - The object containing literals.
 * @returns {object} The processed object with static and dynamic literals.
 */
function processLiterals(obj) {

    // Create an object to store the processed literals
    const processedLiterals = Array.isArray(obj) ? [] : {}

    // Iterate over each key-value pair in the object
    for (const [key, value] of Object.entries(obj)) {
        // If the value is an object, recurse into it to process nested literals
        if (typeof value === 'object' && value !== null) {
            processedLiterals[key] = processLiterals(value)
        }
        // If the value is a string and contains placeholders, turn it into a function
        else if (typeof value === 'string' && /{\d+}/.test(value)) {
            processedLiterals[key] = (...args) => value.replace(/{(\d+)}/g, (_, number) => args[number] || `{${number}}`)
        }
        // Otherwise, leave the static value unchanged
        else {
            processedLiterals[key] = value
        }
    }

    // Return the processed object
    return processedLiterals
}