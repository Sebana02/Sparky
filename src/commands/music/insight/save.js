const { useQueue } = require('discord-player');
const { reply, deferReply } = require('@utils/interaction-utils');
const { noQueue, savePrivate, save } = require('@utils/embed/music-presets');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('music.save.description'),
};

/**
 * Command for saving the current song in a private message
 */
module.exports = {
  name: 'save',
  description: literals.description,
  voiceChannel: true,

  run: async (client, inter) => {
    //Get the queue
    const queue = useQueue(inter.guildId);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, {
        embeds: [noQueue(client)],
        ephemeral: true,
        deleteTime: 2,
      });

    //Defer the reply
    await deferReply(inter, { ephemeral: true });

    //Send the save embed to the user
    await inter.member.send({ embeds: [savePrivate(queue.currentTrack)] });

    //Send the save embed to the user
    await reply(inter, {
      embeds: [save(queue.currentTrack)],
      ephemeral: true,
      deleteTime: 2,
    });
  },
};
