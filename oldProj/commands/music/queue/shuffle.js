const { useQueue } = require('discord-player');
const { noQueue, shuffle } = require('@utils/embed/music-presets');
const { reply } = require('@utils/interaction-utils');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('music.shuffle.description'),
};

/**
 * Command for shuffling the queue
 */
module.exports = {
  name: 'shuffle',
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

    //Shuffle the queue
    queue.tracks.shuffle();

    //Send the shuffle embed
    await reply(inter, { embeds: [shuffle(queue)] });
  },
};
