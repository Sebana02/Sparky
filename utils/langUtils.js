const { path } = require("@ffmpeg-installer/ffmpeg")

/**
 * Get the value of a literal in the language file stored in process.language
 * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
 * @returns {string|null} The value of the literal, or null if not found.
 **/
function resolveLiteral(pathToLiteral) {
    // Split the path and get the value of the literal
    const result = pathToLiteral.split('.').reduce((obj, key) => (obj ? obj[key] : null), process.language)

    // Log an error if the literal is not found
    if (!result)
        console.error(`Error: literal not found: ${pathToLiteral}`)

    // Return the value of the literal
    return result
}

/**
 * Get the value of a literal in the language file stored in process.language.commands
 * @param {string} pathToLiteral - The literal path to get (e.g., 'commands.cat.description').
 * @returns {string|null} The value of the literal, or null if not found.
 */
function resolveCommandLiteral(pathToLiteral) {
    // Add 'commands.' to the path 
    pathToLiteral = `commands.${pathToLiteral}`

    // Get and return the value of the literal
    return resolveLiteral(pathToLiteral)
}

/**
 * Get the value of a literal in the language file stored in process.language.events
 * @param {string} pathToLiteral - The literal path to get (e.g., 'events.ready.description').
 * @returns {string|null} The value of the literal, or null if not found.
 */
function resolveEventLiteral(pathToLiteral) {
    // Add 'events.' to the path 
    pathToLiteral = `events.${pathToLiteral}`

    // Get and return the value of the literal
    return resolveLiteral(pathToLiteral)
}

/**
 * Get the value of a literal in the language file stored in process.language.utils
 * @param {string} pathToLiteral - The literal path to get (e.g., 'utils.embedUtils.description').
 * @returns {string|null} The value of the literal, or null if not found.
 */
function resolveUtilsLiteral(pathToLiteral) {
    // Add 'utils.' to the path 
    pathToLiteral = `utils.${pathToLiteral}`

    // Get and return the value of the literal
    return resolveLiteral(pathToLiteral)
}



/**
 * Utils for language
 */
module.exports = {
    resolveLiteral,
    resolveCommandLiteral
}
