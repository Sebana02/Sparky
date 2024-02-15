const { createEmbed } = require('@utils/embedUtils.js')
const { reply } = require('@utils/interactionUtils.js')

//Max number of gifs to get
const limit = 50

//Replace spaces with plus
function replaceSpaceWithPlus(str) {
    return str.split(' ').join('+')
}

//Return the url of the gif
function search(keywords) {
    return [
        'https://tenor.googleapis.com/v2/search?',
        `q=${replaceSpaceWithPlus(keywords)}`,
        `&key=${process.env.TENOR_API_KEY}`,
        `&limit=${limit}`
    ].join('')
}


//Return a random gif from the category
async function getRandomGif(category) {
    // Check if the api key is set
    if (!process.env.TENOR_API_KEY || process.env.TENOR_API_KEY.trim() === '') {
        throw 'TENOR_API_KEY environment variable not set'
    }

    const res = await fetch(search(category))

    if (res.ok) {
        const data = await res.json()

        return (data.results && data.results.length > 0)
            ? data.results[Math.floor(Math.random() * data.results.length)].media_formats.gif.url
            : null

    }

    throw "Invalid HTTP request, code: " + res.status
}

//Send a random gif from the category, with a title
async function sendRandomGif(inter, category, title) {

    await inter.deferReply()

    //Search gifs
    const gif = await getRandomGif(category)

    if (!gif)
        return await reply(inter, { content: `No hay resultados para '${category}'`, ephemeral: false, deleteTime: 2 })


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

//Api to get a random gif
module.exports = {
    sendRandomGif,
    getRandomGif
}
