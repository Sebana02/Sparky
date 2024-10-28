const { ApplicationCommandOptionType } = require('discord.js');
const { QueryType, useQueue, useMainPlayer } = require('discord-player');
const { reply, deferReply } = require('@utils/interaction-utils');
const { noResults, addToQueue, noQueue } = require('@utils/embed/music-presets');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Prelaod literals
const literals = {
  description: fetchCommandLit('music.play_next.description'),
  optionName: fetchCommandLit('music.play_next.option.name'),
  optionDescription: fetchCommandLit('music.play_next.option.description'),
};

/**
 * Command for playing a song next
 */
module.exports = {
  name: 'playnext',
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
    //Get the queue and the song
    const queue = useQueue(inter.guildId);
    const song = inter.options.getString(literals.optionName);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, {
        embeds: [noQueue(client)],
        ephemeral: true,
        deleteTime: 2,
      });

    //Defer the reply
    await deferReply(inter);

    //Search for the song
    const results = await useMainPlayer().search(song, {
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

    //Insert the track to the queue
    queue.insertTrack(results.tracks[0], 0);

    //Send the added to queue embed
    await reply(inter, { embeds: [addToQueue(results.tracks[0])] });
  },
};
