const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const interactionReply = require('@utils/interactionReply.js')
const createEmbed = require('@utils/createEmbed.js')

//Command that asks a question to the magic 8ball
module.exports = {
    name: '8ball',
    description: 'Haz una pregunta a la bola mágica',
    options: [
        {
            name: 'pregunta',
            description: 'Tu pregunta para la bola mágica',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        const embed = createEmbed({
            description: `🎱${responses[Math.floor(Math.random() * responses.length)]}`,
            color: 0x2c2d30
        })

        await interactionReply(inter, { embeds: [embed] })
    }
}

const responses = [
    'Sí',
    'No',
    'Tal vez',
    'Es probable',
    'No lo sé',
    'Por supuesto',
    'Definitivamente no',
    'Sin duda alguna',
    'Es poco probable',
    'Pregunta de nuevo más tarde',
    'No puedo responder a eso',
    '¡Claro que sí!',
    'No cuentes con ello',
    'Es probablemente la mejor opción',
    'Depende de las circunstancias'
]