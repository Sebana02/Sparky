const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')
const { ApplicationCommandOptionType } = require('discord.js')

/**
 *  Max number of results to get
 */
const limit = 10

/**
 *  Constructs the URL for searching, based on provided keywords
 * @param {string} keywords - The keywords to search for
 * @returns {string} - The URL to fetch the search results
 */
function search(keywords) {
    return [
        `https://es.wikipedia.org/w/api.php?action=query`,
        `&list=search`,
        `&prop=info`,
        `&inprop=url`,
        `&utf8=`,
        `&format=json`,
        `&origin=*`,
        `&srlimit=${limit}`,
        `&srsearch=${keywords}`
    ].join('')
}

/**
 * Command for searching Wikipedia
 */
module.exports = {
    name: 'wikisearch',
    description: 'Busca en Wikipedia',
    options: [
        {
            name: 'termino',
            description: 'Término a buscar en Wikipedia',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        //Defer reply
        await deferReply(inter)

        //Get search term
        const searchTerm = inter.options.getString('termino')

        //Search Wikipedia
        const response = await fetch(search(searchTerm))

        //Check if the request was successful
        if (!response.ok)
            throw new Error("Invalid HTTP request, code: " + response.status)

        //Parse the JSON response
        const data = await response.json()

        //Check if there are any results
        if (data.query.search.length === 0)
            return await reply(inter, { content: `No se encontraron resultados para: ${searchTerm}`, deleteTime: 3 })


        // Extracting the first search result
        const result = data.query.search[0]
        const pageUrl = `https://es.wikipedia.org/?curid=${result.pageid}`


        // Create embed with search result
        const embed = createEmbed({
            color: ColorScheme.information,
            title: result.title,
            description: result.snippet.replace(/<\/?[^>]+(>|$)/g, ""), // Removing HTML tags from snippet
            url: pageUrl,
            footer: { text: `Resultado de Wikipedia para: ${searchTerm}`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with the search result  
        await reply(inter, { embeds: [embed] })
    }
}
