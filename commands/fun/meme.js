const { EmbedBuilder } = require('discord.js');
const { getRandomGifs } = require('./gif.js');

//Command that sends random gif(s) from the category meme
module.exports = {
    name: 'meme',
    description: 'Manda un meme aleatorio',
    run: async (client, inter) => {
        await inter.reply({ content: `Buscando meme...`, ephemeral: true })

        //Search gifs
        const gifs = await getRandomGifs("meme", 1)

        //Check if there are gifs
        if (!gifs)
            return await inter.editReply({ content: `Ha ocurrido un error`, ephemeral: true })

        //Send gif
        gifs.forEach(async (gif) => await inter.editReply({ content: '', embeds: [createEmbed(inter, gif)] }))
    }
};

//Create embed with the gif
function createEmbed(inter, selectedGif) {

    return embed = new EmbedBuilder()
        .setColor(0x2c2d30)
        .setImage(selectedGif)
        .setTimestamp()
        .setFooter({
            text: inter.user.username, iconURL: inter.user.displayAvatarURL({
                size: 1024,
                dynamic: true
            })
        })
}