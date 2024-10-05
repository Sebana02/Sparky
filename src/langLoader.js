const fs = require('fs')
const path = require('path')

/**
 * Loads the specified language file
 * @param {string} category - The category to load.
 * @param {string} language - The language to load.
 * @returns {object|null} The language file or null if the file does not exist.
 **/
function loadLanguageFile(category, language) {

    // Check if the category file exists in the specified language
    const langPath = path.resolve(__dirname, `../languages/${language}/${category}.json`)
    if (!fs.existsSync(langPath))
        return console.error(`-> Error: Language file required: ${langPath}`)

    // Load the language file
    return JSON.parse(fs.readFileSync(langPath))
}

/**
 * Loads the specified language file
 * @param {string} language - The language to load.
 * @returns {object} The language file.
 * @throws {Error} If the language file does not exist.
 **/
function loadLanguage(language) {

    // Check if the language folder exists
    const langPath = path.resolve(__dirname, `../languages/${language}`)
    if (!fs.existsSync(langPath))
        return console.error(`-> Error: Language folder does not exist: ${langPath}`)


    // Load language files
    const languageObject = {
        commands: loadLanguageFile('commands', language),
        events: loadLanguageFile('events', language),
        utils: loadLanguageFile('utils', language)
    }

    // Check if the language files were loaded
    if (!languageObject.commands || !languageObject.events || !languageObject.utils)
        return console.error(`-> Error: missing language files in ${language}`)

    // Log the loaded language and return the language object
    console.log(`-> Loaded language: ${language}`)
    return languageObject
}


/**
 * Module for loading language files
 */
module.exports = {
    /**
     * Loads language files
     */
    config: () => {
        //Load languages
        console.log('-> Loading languages...')

        // Default language, en, is used if the LANG environment variable is not set
        const defaultLanguage = 'en'
        const language = process.env.LANGUAGE || defaultLanguage

        // Load language files
        try {

            // Load default language 
            process.defaultLanguage = loadLanguage(defaultLanguage)
            process.language = process.defaultLanguage

            // Load language if it is not the default one
            // If it does not exist, the default language is used
            if (language !== defaultLanguage)
                process.language = loadLanguage(language) || process.defaultLanguage

        } catch (error) {
            console.error(`Error: loading languages: ${error}`)
        }

        // Check if language files were loaded, if not, throw an error
        if (!process.language)
            throw new Error(`No valid language found`)
    }
}