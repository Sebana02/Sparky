const { reply } = require('@utils/interaction-utils.js');
const permissions = require('@utils/permissions.js');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('utility.disconnect.description'),
  response: (user) => fetchCommandLit('utility.disconnect.response', user),
};

/**
 * Command that disconnects the bot
 */
module.exports = {
  name: 'disconnect',
  description: literals.description,
  permissions: permissions.Administrator,
  run: async (client, inter) => {
    //Reply to the interaction
    await reply(inter, {
      content: literals.response(inter.user.username),
      ephemeral: true,
      deleteTime: 2,
    });

    //Disconnect bot
    await client.destroy();
    process.exit(0);
  },
};
