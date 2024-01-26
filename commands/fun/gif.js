const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

//Api for getting gifs
const api = {

    limit: 50,

    replaceSpaceWithPlus: (str) => {
        return str.split(' ').join('+')
    },
    //return the url of the gif
    search: (keywords) => {
        return [
            'https://tenor.googleapis.com/v2/search?',
            `q=${api.replaceSpaceWithPlus(keywords)}`,
            `&key=${process.env.TENOR_API_KEY}`,
            `&limit=${api.limit}`
        ].join('')
    },
    getRandomGif: (category) => {
        return fetch(api.search(category))
            .then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    if (data.results)
                        return data.results[Math.floor(Math.random() * data.results.length)].media_formats.gif.url
                }
                console.error("Error: getting gifs: HTTP code: " + res.status)
                return null
            })
            .catch(error => {
                console.error("Error: getting gifs: Invalid request: " + error.message)
                return null
            })
    },
    sendRadomGif: async (inter, category, description) => {

        //Check if the api key is set
        if (!process.env.TENOR_API_KEY || process.env.TENOR_API_KEY.trim() === '') {
            console.error("Error: TENOR_API_KEY not set")
            return await inter.reply({ content: 'Ha ocurrido un error', ephemeral: true })
                .then(reply => setTimeout(async () => await reply.delete(), 3000))
        }

        await inter.deferReply()

        //Search gifs
        const gif = await api.getRandomGif(category)

        if (!gif)
            return await inter.editReply({ content: `No hay resultados para '${category}'`, ephemeral: false })
                .then(reply => setTimeout(async () => await reply.delete(), 3000))

        //Send gif
        const embed = new EmbedBuilder()
            .setColor(0x2c2d30)
            .setImage(gif)
            .setTimestamp()
            .setFooter({
                text: inter.user.username, iconURL: inter.user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            })
            .setDescription(description)

        await inter.editReply({ content: '', embeds: [embed] })
    }

}

//Command that sends random gif(s) from the category
module.exports = {
    name: 'gif',
    description: 'Muestra un gif aleatorio de la categoria indicada',
    options: [
        {
            name: 'categoría',
            description: 'Categoría que quieras buscar',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        api.sendRadomGif(inter, inter.options.getString('categoría'), `Gif aleatorio de ${inter.options.getString('categoría')}`)
    },
    getRandomGif: api.getRandomGif,
    sendRadomGif: api.sendRadomGif
}