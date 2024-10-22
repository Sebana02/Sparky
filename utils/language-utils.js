/**
 * Utils for language
 */
module.exports = {
    /**
     * Get the value of a literal in the language file
     * and format it with arguments if provided
     * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
     * @param {string[]} args - Arguments to format the literal.
     * @returns {string|null} The value of the literal, or null if not found.
     **/
    fetchLiteral: (pathToLiteral, ...args) => {

        // Fetch the literal from the selected language or default language if not found
        let fetchedLiteral = fetch(pathToLiteral, process.language) ||
            fetch(pathToLiteral, process.defaultLanguage)

        // Return formatted string if arguments are provided
        return (args.length > 0) ? String.format(fetchedLiteral, ...args) : fetchedLiteral
    },

    /**
     * Get the value of a literal object in the language file, and process it,
     * turning dynamic literals into functions
     * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
     * @returns {object} The processed object with static and dynamic literals.
     */
    fetchObject: (pathToLiteral) => {

        // Fetch the literal
        let selectedLangObj = fetch(pathToLiteral, process.language)

        // Fetch the literal from the default language
        let defaultLangObj = fetch(pathToLiteral, process.defaultLanguage)

        // Merge selected language with default language, logging any missing keys
        let result = mergeLangObj(selectedLangObj, defaultLangObj)

        // Process the merged literal
        return processLiterals(result)
    }
}

/**
 * Format a string with arguments
 * @param {String} str - The string to format.
 * @param  {...any} args - The arguments to format the string with.
 * @returns {String} - The formatted string.
 */
String.format = function (str, ...args) {
    return str.replace(/{(\d+)}/g, (_, number) => args[number] || `{${number}}`)
}

/**
 * Fetch a literal from the language file stored in language object
 * @param {String} pathToLiteral - The path to the literal (e.g., 'commands.cat.description').
 * @param {object} langObj - The object from the selected language
 * @returns {String|null} - The value of the literal, or null if not found.
 */
function fetch(pathToLiteral, langObj) {

    // If the given langObj is null, return null
    if (!langObj) return null

    // Fetch the literal from the language object
    const fetchedLiteral = pathToLiteral.split('.').reduce((obj, key) => (obj ? obj[key] : null), langObj)

    if (!fetchedLiteral)
        logger.warn(`Literal not found: ${pathToLiteral}`)

    return fetchedLiteral
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
            processedLiterals[key] = (...args) => String.format(value, ...args)
        }
        // Otherwise, leave the static value unchanged
        else {
            processedLiterals[key] = value
        }
    }

    // Return the processed object
    return processedLiterals
}
