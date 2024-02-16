const { createEmbed } = require('@utils/embedUtils/embedUtils.js')
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
 * Searches for GIFs based on the provided keywords
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
 * @returns {Promise<string|null>} - A Promise that resolves to the URL of the random GIF, or null if no GIF is found
 * @throws {string} - Throws an error if the TENOR_API_KEY environment variable is not set or if there is an invalid HTTP request
 */
async function getRandomGif(category) {

    try {
        // Check if the api key is set
        if (!process.env.TENOR_API_KEY || process.env.TENOR_API_KEY.trim() === '') {
            throw new Error('TENOR_API_KEY environment variable not set')
        }

        // Fetch the GIFs
        const res = await fetch(search(category))

        if (res.ok) {
            const data = await res.json()

            return (data.results && data.results.length > 0)
                ? data.results[Math.floor(Math.random() * data.results.length)].media_formats.gif.url
                : null

        }

        throw new Error("Invalid HTTP request, code: " + res.status)
    } catch (error) {
        throw new Error('fetching gifs failed: ' + error.message)
    }
}

/**
 * Sends a random GIF based on the specified category and title
 * @param {ChatInputCommandInteraction} inter - The interaction object
 * @param {string} category - The category of the GIF
 * @param {string} title - The title of the GIF
 * @returns {Promise<void>}
 */
async function sendRandomGif(inter, category, title) {

    await deferReply(inter)

    //Search gifs
    const gif = await getRandomGif(category)

    if (!gif) {
        const noGifEmbed = createEmbed({
            color: 0xff2222,
            author: { name: `No hay resultados para '${category}'` },
        })

        return await reply(inter, { embeds: [noGifEmbed], ephemeral: true, deleteTime: 2 })
    }

    //Send gif
    const embed = createEmbed({
        color: 0x2c2d30,
        image: gif,
        title: title,
        footer: { text: inter.user.username, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
        setTimestamp: true
    })

    await reply(inter, { embeds: [embed] })
}

/**
 * Utils for interacting with GIFs
 */
module.exports = {
    sendRandomGif,
    getRandomGif
}
