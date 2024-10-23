const literalsObj = process.literals

/**
 * Utils for language
 */
module.exports = {
    /**
     * Get the value of a literal in the literals object stored in literalsObj and format it with the given arguments.
     * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
     * @param {string[]} args - Arguments to format the literal.
     * @returns {string|null} The value of the literal, or null if not found.
     **/
    fetchFormattedLiteral: (pathToLiteral, ...args) => {
        return fetch(pathToLiteral)(...args)
    },

    /**
     * Get the value of a literal object in the literalsObj object
     * @param {string} pathToLiteral - The literal path to get (e.g., 'src.loader.js.hello').
     * @returns {object} The processed object with static and dynamic literals.
     */
    fetchLiteral: (pathToLiteral) => {
        return fetch(pathToLiteral)
    },

    fetchCommandLit: (pathToLiteral) => {
        return fetch(`commands.${pathToLiteral}`)
    },

    fetchEventLit: (pathToLiteral) => {
        return fetch(`commands.${pathToLiteral}`)
    },

    fetchUtilLit: (pathToLiteral) => {
        return fetch(`commands.${pathToLiteral}`)
    }
}


/**
 * Fetch a literal from the literals object stored in literalsObj
 * @param {String} pathToLiteral - The path to the literal (e.g., 'commands.cat.description').
 * @returns {String|null} - The value of the literal, or null if not found.
 */
function fetch(pathToLiteral) {

    // Return the value of the literal in the language object
    return pathToLiteral.split('.').reduce((obj, key) => (obj ? obj[key] : null), literalsObj)
}
