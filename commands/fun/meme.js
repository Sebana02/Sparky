const { EmbedBuilder } = require('discord.js');
const { sendRadomGif } = require('./gif.js');

//Command that sends random gif(s) from the category meme
module.exports = {
    name: 'meme',
    description: 'Manda un meme aleatorio',
    run: async (client, inter) => {
        await sendRadomGif(inter, 'meme')
    }
};