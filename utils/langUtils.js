// Add a format method to the String object
String.format = function (str, ...args) {
    return str.replace(/{(\d+)}/g, (match, number) =>
        typeof args[number] !== 'undefined' ? args[number] : match
    )
}

/**
 * Get the value of a literal in the language file stored in process.language
 * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
 * @param {string[]} args - Arguments to format the literal.
 * @returns {string|null} The value of the literal, or null if not found.
 **/
function resolveLiteral(pathToLiteral, ...args) {
    // Split the path and get the value of the literal
    const result = pathToLiteral.split('.').reduce((obj, key) => (obj ? obj[key] : null), process.language)

    // Log an error if the literal is not found
    if (!result) {
        console.error(`Error: literal not found: ${pathToLiteral}`)
        return null
    }
    else if (args.length > 0)    // Return the value of the literal
        return String.format(result, ...args)
    else
        return result
}

/**
 * Get the value of a literal in the language file stored in process.language.commands
 * @param {string} pathToLiteral - The literal path to get (e.g., 'commands.cat.description').
 * @param {string[]} args - Arguments to format the literal.  
 * @returns {string|null} The value of the literal, or null if not found.
 */
function resolveCommandLiteral(pathToLiteral, ...args) {
    // Add 'commands.' to the path 
    pathToLiteral = `commands.${pathToLiteral}`

    // Get and return the value of the literal
    return resolveLiteral(pathToLiteral, ...args)
}

/**
 * Get the value of a literal in the language file stored in process.language.events
 * @param {string} pathToLiteral - The literal path to get (e.g., 'events.ready.description').
 * @param {string[]} args - Arguments to format the literal.
 * @returns {string|null} The value of the literal, or null if not found.
 */
function resolveEventLiteral(pathToLiteral, ...args) {
    // Add 'events.' to the path 
    pathToLiteral = `events.${pathToLiteral}`

    // Get and return the value of the literal
    return resolveLiteral(pathToLiteral, ...args)
}

/**
 * Get the value of a literal in the language file stored in process.language.utils
 * @param {string} pathToLiteral - The literal path to get (e.g., 'utils.embedUtils.description').
 * @param {string[]} args - Arguments to format the literal.
 * @returns {string|null} The value of the literal, or null if not found.
 */
function resolveUtilsLiteral(pathToLiteral, ...args) {
    // Add 'utils.' to the path 
    pathToLiteral = `utils.${pathToLiteral}`

    // Get and return the value of the literal
    return resolveLiteral(pathToLiteral, ...args)
}



/**
 * Utils for language
 */
module.exports = {
    resolveLiteral,
    resolveCommandLiteral,
    resolveEventLiteral,
    resolveUtilsLiteral
}
