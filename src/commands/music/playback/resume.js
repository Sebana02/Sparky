const { useQueue, usePlayer } = require('discord-player');
const { reply } = require('@utils/interaction-utils');
const { noQueue, resume } = require('@utils/embed/music-presets');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('music.resume.description'),
};

/**
 * Command for resuming the queue
 */
module.exports = {
  name: 'resume',
  description: literals.description,
  voiceChannel: true,

  run: async (client, inter) => {
    //Get the queue and the player
    const queue = useQueue(inter.guildId);
    const player = usePlayer(inter.guildId);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, {
        embeds: [noQueue(client)],
        ephemeral: true,
        deleteTime: 2,
      });

    //Resume the queue
    player.setPaused(false);

    //Send the resume embed
    await reply(inter, { embeds: [resume(queue.currentTrack)] });
  },
};
