const { QueryType, useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { reply, deferReply } = require('@utils/interaction-utils');
const { noResults, addToQueue, addToQueueMany } = require('@utils/embed/music-presets');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('music.play.description'),
  optionName: fetchCommandLit('music.play.option.name'),
  optionDescription: fetchCommandLit('music.play.option.description'),
};

/**
 * Command for playing a song
 */
module.exports = {
  name: 'play',
  description: literals.description,
  voiceChannel: true,
  options: [
    {
      name: literals.optionName,
      description: literals.optionDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, inter) => {
    //Get the player and the song
    const player = useMainPlayer();
    const song = inter.options.getString(literals.optionName);

    //Defer the reply
    await deferReply(inter);

    //Search for the song
    const results = await player.search(song, {
      requestedBy: inter.member,
      searchEngine: QueryType.AUTO,
    });

    //If there are no results
    if (!results.hasTracks())
      return await reply(inter, {
        embeds: [noResults(client)],
        ephemeral: true,
        deleteTime: 2,
      });

    //Play the song
    await player.play(inter.member.voice.channel, results, {
      nodeOptions: {
        metadata: {
          voiceChannel: inter.member.voice.channel,
          channel: inter.channel,
        },
        leaveOnEmptyCooldown: 0,
        leaveOnEmpty: true,
        leaveOnEndCooldown: 0,
        leaveOnEnd: true,
        bufferingTimeout: 0,
        selfDeaf: true,
      },
    });

    //Send the added to queue embed
    await reply(inter, {
      embeds: [results.playlist ? addToQueueMany(results) : addToQueue(results.tracks[0])],
    });
  },
};
