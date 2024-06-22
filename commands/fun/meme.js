const { sendRandomGif } = require('@utils/gifUtils.js')

/**
 * Command that sends random gif(s) from the category meme
 */
module.exports = {
    name: 'meme',
    description: 'Manda un meme aleatorio',
    run: async (client, inter) => {
        //Reply with a random gif from the category meme
        await sendRandomGif(inter, 'meme')
    }
}