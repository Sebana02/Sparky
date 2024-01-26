const { ApplicationCommandOptionType } = require('discord.js')

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

    getRandomGifs: (category, num) => {
        return fetch(api.search(category))
            .then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    if (data.results)
                        return Array.from({ length: num }, () => data.results[Math.floor(Math.random() * data.results.length)].media_formats.gif.url)
                }

                return null
            })
            .catch(error => {
                console.error("Error: getting gifs " + error.message)
                return null
            })
    }

}

//Command that sends random gif(s) from the category
module.exports = {
    name: 'gif',
    description: 'Muestra un gif aleatorio de la categoria indicada',
    options: [
        {
            name: 'cantidad',
            description: 'Cantidad de gifs que quieras enviar',
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: api.limit
        },
        {
            name: 'categoría',
            description: 'Categoría que quieras buscar',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Check if the api key is set
        if (!process.env.TENOR_API_KEY || process.env.TENOR_API_KEY.trim() === '') {
            console.error("Error: TENOR_API_KEY not set")
            return await inter.reply({ content: 'Ha ocurrido un error', ephemeral: true })
        }

        //Search gifs
        const category = inter.options.getString('categoría')
        const amount = inter.options.getNumber('cantidad')

        await inter.reply({ content: `Buscando gifs para ${category}...`, ephemeral: true })

        const gifs = await api.getRandomGifs(category, amount)

        //Check if there are gifs
        if (!gifs)
            return await inter.editReply({ content: `No hay resultados para ${category}`, ephemeral: true })

        //Send gifs
        gifs.forEach(async (gif) => await inter.channel.send(gif))
    },
    getRandomGifs: api.getRandomGifs
}