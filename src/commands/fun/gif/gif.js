const { ApplicationCommandOptionType } = require('discord.js');
const { sendRandomGif } = require('@utils/gif-utils.js');
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js');
const { fetchLiteral } = require('@utils/language-utils');

// Preload literals
const literals = fetchLiteral('commands.fun.gif');

/**
 * Command that sends random gif(s) from the specified category
 */
module.exports = {
  name: 'gif',
  description: literals.description,
  options: [
    {
      name: literals.option.name,
      description: literals.option.description,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, inter) => {
    // Get the category
    const category = inter.options.getString(literals.option.name);

    // Create embed
    const embed = createEmbed({
      footer: {
        text: literals.response(inter.user.username, category),
        iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }),
      },
      color: ColorScheme.fun,
    });

    // Reply with a random gif from the specified category
    await sendRandomGif(inter, category, embed);
  },
};
