const { createEmbed } = require('@utils/embedUtils.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')
const { ChatInputCommandInteraction } = require('discord.js')

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
            throw new Error("Invalid HTTP request, code: " + response.status)


        // Parse the response
        // Get a random gif from the results if there are any and return its url
        // e.o.c. return null
        const data = await response.json()
        return (data.results && data.results.length > 0)
            ? data.results[Math.floor(Math.random() * data.results.length)].media_formats.gif.url
            : null


    } catch (error) {
        if (options.propagate) throw new Error(`fetching gifs failed: ${error.message}`)
        else console.error(`Error: fetching gifs failed: ${error.message}`)
    }
}

/**
 * Sends a random GIF based on the specified category and title
 * @param {ChatInputCommandInteraction} inter - The interaction object
 * @param {string} category - The category of the GIF
 * @param {string} title - The title of the GIF
 * @param {Object} [options={}] - The options for the function
 * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the sending of the GIF
 * @returns {Promise<void>}
 * @throws {Error} - If the GIF is not found or if there is an error in sending the GIF
 */
async function sendRandomGif(inter, category, title, options = { propagate: true }) {

    try {

        //Defer reply
        await deferReply(inter)

        //Search gifs
        const gifURL = await getRandomGif(category)

        //If no gif is found, send error message to user
        if (!gifURL) {
            const noGifEmbed = createEmbed({
                color: 0xff2222,
                author: { name: `No hay resultados para '${category}'` },
            })

            return await reply(inter, { embeds: [noGifEmbed], ephemeral: true, deleteTime: 2 })
        }

        //Create embed with gif and send it
        const embed = createEmbed({
            color: 0x2c2d30,
            image: gifURL,
            title: title,
            footer: { text: inter.user.username, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        await reply(inter, { embeds: [embed] })
    }
    catch (error) {
        if (options.propagate) throw new Error(`sending gif failed: ${error.message}`)
        else console.error(`Error: sending gif failed: ${error.message}`)
    }
}

/**
 * Utils for interacting with GIFs
 */
module.exports = {
    sendRandomGif,
    getRandomGif
}
