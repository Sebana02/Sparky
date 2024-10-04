const fs = require('fs')
const path = require('path')

/**
 * Loads the specified language file
 * @param {string} language - The language to load.
 * @returns {object} The language file.
 * @throws {Error} If the language file does not exist.
 **/
function loadLanguage(language) {

    console.log(`-> Loading language: ${language}`)
    const langPath = path.resolve(__dirname, `../languages/${language}.json`)

    if (!fs.existsSync(langPath)) {
        console.error(`-> Error: Language file does not exist: ${langPath}`)
        return null
    }

    return require(langPath)
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
        const language = process.env.LANGUAGE || 'en'

        // Load language files
        try {
            // Load language
            const lang = loadLanguage(language)
            process.language = lang

        } catch (error) {
            console.error(`Error: loading languages: ${error}`)
        }

        // Check if language files were loaded, if not, throw an error
        if (!process.language)
            throw new Error(`Error: no valid language files found`)
    }
}