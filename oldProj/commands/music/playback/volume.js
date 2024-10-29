const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue, usePlayer } = require('discord-player');
const { reply } = require('@utils/interaction-utils');
const { noQueue, volume } = require('@utils/embed/music-presets');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('music.volume.description'),
  optionName: fetchCommandLit('music.volume.option.name'),
  optionDescription: fetchCommandLit('music.volume.option.description'),
};

/**
 * Command for changing the volume of the music
 */
module.exports = {
  name: 'volume',
  description: literals.description,
  voiceChannel: true,
  options: [
    {
      name: literals.optionName,
      description: literals.optionDescription,
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 1,
      maxValue: 100,
    },
  ],

  run: async (client, inter) => {
    //Get the queue, the player and the volume
    const queue = useQueue(inter.guildId);
    const player = usePlayer(inter.guildId);
    const vol = inter.options.getNumber(literals.optionName);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, {
        embeds: [noQueue(client)],
        ephemeral: true,
        deleteTime: 2,
      });

    //Set the volume
    player.setVolume(vol);

    //Send the volume embed
    await reply(inter, { embeds: [volume(vol, queue.currentTrack)] });
  },
};
