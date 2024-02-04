const { sendRandomGif } = require('@commands/fun/gif.js');

//Command that sends random gif(s) from the category meme
module.exports = {
    name: 'meme',
    description: 'Manda un meme aleatorio',
    run: async (client, inter) => {
        await sendRandomGif(inter, 'meme', 'Meme aleatorio')
    }
};