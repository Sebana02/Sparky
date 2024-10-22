const { modifyEmbed, createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { reply, deferReply } = require('@utils/interaction-utils.js')
const { ChatInputCommandInteraction } = require('discord.js')
const { fetchObject } = require('@utils/language-utils')

// Preload literals
const literals = fetchObject('utils.gif_utils')

/**
 * Utils for interacting with GIFs
 */
module.exports = {
    sendRandomGif,
    getRandomGif
}

/**
 *  Max number of gifs to get
 */
const limit = 50

/**
 * Replaces spaces in a string with plus (+) signs
 * @param {string} str - The input string
 * @returns {string} - The modified string with spaces replaced by plus signs
 */
function replaceSpaceWithPlus(str) {
    return str.split(' ').join('+')
}

/**
 *  Constructs the URL for searching GIFs based on provided keywords
 * @param {string} keywords - The keywords to search for
 * @returns {string} - The URL for the GIF search
 */
function search(keywords) {
    return [
        'https://tenor.googleapis.com/v2/search?',
        `q=${replaceSpaceWithPlus(keywords)}`,
        `&key=${process.env.TENOR_API_KEY}`,
        `&limit=${limit}`
    ].join('')
}

/**
 * Retrieves a random GIF based on the specified category
 * @param {string} category - The category of the GIF
 * @param {Object} [options={}] - The options for the function
 * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the fetching of the GIF
 * @returns {Promise<string|null>} - A Promise that resolves to the URL of the random GIF, or null if no GIF is found
 * @throws {string} - Throws an error if the TENOR_API_KEY environment variable is not set or if there is an invalid HTTP request
 */
async function getRandomGif(category, options = { propagate: true }) {

    try {
        // Check if the api key is set
        if (!process.env.TENOR_API_KEY || process.env.TENOR_API_KEY.trim() === '') {
            throw new Error('TENOR_API_KEY environment variable not set')
        }

        // Fetch the GIFs
        const response = await fetch(search(category))

        // Check if the request was successful
        if (!response.ok)
            throw new Error("invalid HTTP request, code: " + response.status)


        // Parse the response
        // Get a random gif from the results if there are any and return its url
        // e.o.c. return null
        const data = await response.json()
        return (data.results && data.results.length > 0)
            ? data.results[Math.floor(Math.random() * data.results.length)].media_formats.tinygif.url
            : null


    } catch (error) {
        error.message = `fetching gifs failed: ${error.message}`
        if (options.propagate) throw error
        else logger.error(error.stack)
    }
}

/**
 * Sends a random GIF based on the specified category and title
 * @param {ChatInputCommandInteraction} inter - The interaction object
 * @param {string} category - The category of the GIF
 * @param {EmbedBuilder} embed - The title of the GIF
 * @param {Object} [options={}] - The options for the function
 * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the sending of the GIF
 * @returns {Promise<void>}
 * @throws {Error} - If the GIF is not found or if there is an error in sending the GIF
 */
async function sendRandomGif(inter, category, embed, options = { propagate: true }) {

    try {

        //Defer reply
        await deferReply(inter)

        //Search gifs
        const gifURL = await getRandomGif(category)

        //If no gif is found, send error message to user
        if (!gifURL) {
            const noGifEmbed = createEmbed({
                color: ColorScheme.error,
                author: { name: literals.no_results(category) },
            })

            return await reply(inter, { embeds: [noGifEmbed], ephemeral: true, deleteTime: 2 })
        }

        //Create embed with gif and send it
        if (embed)
            modifyEmbed(embed, { image: gifURL })
        else
            embed = createEmbed({ image: gifURL })

        await reply(inter, { embeds: [embed] })
    }
    catch (error) {
        error.message = `sending gif failed: ${error.message}`
        if (options.propagate) throw error
        else logger.error(error.stack)
    }
}
