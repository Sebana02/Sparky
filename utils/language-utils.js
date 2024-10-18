// Add a format method to the String object
String.format = function (str, ...args) {
    return str.replace(/{(\d+)}/g, (match, number) =>
        typeof args[number] !== 'undefined' ? args[number] : match
    )
}

/**
 * Get the value of a literal in the language file stored in process.language or process.defaultLanguage
 * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
 * @param {string[]} args - Arguments to format the literal.
 * @returns {string|null} The value of the literal, or null if not found.
 **/
function fetchLiteral(pathToLiteral, ...args) {

    // Split the path and get the value of the literal
    let result = pathToLiteral.split('.').reduce((obj, key) => (obj ? obj[key] : null), process.language)

    // Log an error if the literal is not found, and search for it in the default language
    if (!result) {
        logger.error(`Literal not found in selected language: ${pathToLiteral}, using default language`)

        // Get the value of the literal in the default language
        result = pathToLiteral.split('.').reduce((obj, key) => (obj ? obj[key] : null), process.defaultLanguage)

        // Log an error if the literal is not found in the default language
        if (!result)
            return logger.error(`Literal not found in default language: ${pathToLiteral}`)
    }

    // Format the literal if arguments are provided
    if (args.length > 0)
        return String.format(result, ...args)

    //Return result literal
    return result

}

/**
 * Get the value of a literal in the language file stored in process.language.commands
 * @param {string} pathToLiteral - The literal path to get (e.g., 'commands.cat.description').
 * @param {string[]} args - Arguments to format the literal.  
 * @returns {string|null} The value of the literal, or null if not found.
 */
function fetchCommandLit(pathToLiteral, ...args) {
    // Add 'commands.' to the path 
    pathToLiteral = `commands.${pathToLiteral}`

    // Get and return the value of the literal
    return fetchLiteral(pathToLiteral, ...args)
}

/**
 * Get the value of a literal in the language file stored in process.language.events
 * @param {string} pathToLiteral - The literal path to get (e.g., 'events.ready.description').
 * @param {string[]} args - Arguments to format the literal.
 * @returns {string|null} The value of the literal, or null if not found.
 */
function fetchEventLit(pathToLiteral, ...args) {
    // Add 'events.' to the path 
    pathToLiteral = `events.${pathToLiteral}`

    // Get and return the value of the literal
    return fetchLiteral(pathToLiteral, ...args)
}

/**
 * Get the value of a literal in the language file stored in process.language.utils
 * @param {string} pathToLiteral - The literal path to get (e.g., 'utils.embedUtils.description').
 * @param {string[]} args - Arguments to format the literal.
 * @returns {string|null} The value of the literal, or null if not found.
 */
function fetchUtilLit(pathToLiteral, ...args) {
    // Add 'utils.' to the path 
    pathToLiteral = `utils.${pathToLiteral}`

    // Get and return the value of the literal
    return fetchLiteral(pathToLiteral, ...args)
}



/**
 * Utils for language
 */
module.exports = {
    fetchLiteral,
    fetchCommandLit,
    fetchEventLit,
    fetchUtilLit
}
