const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

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
];

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

        const embed = new EmbedBuilder()
            .setDescription(`🎱${responses[Math.floor(Math.random() * responses.length)]}`)
            .setColor(0x2c2d30)

        await inter.reply({ embeds: [embed], content: inter.options.getString('pregunta') })
    }
}