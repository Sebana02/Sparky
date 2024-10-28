const { sendRandomGif } = require('@utils/gif-utils.js');
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js');
const { fetchLiteral } = require('@utils/language-utils');

// Preload literals
const literals = fetchLiteral('commands.fun.cat');

/**
 * Command that sends random gif(s) from the category cat
 */
module.exports = {
  name: 'cat',
  description: literals.description,
  run: async (client, inter) => {
    //Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      footer: {
        text: literals.response(inter.user.username),
        iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }),
      },
    });

    //Reply with a random cat gif
    await sendRandomGif(inter, 'cat', embed);
  },
};
