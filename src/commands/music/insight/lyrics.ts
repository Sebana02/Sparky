import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { Track, useMainPlayer, useQueue } from 'discord-player';
import { reply, deferReply } from '@utils/interaction-utils.js';
import { fetchString } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '@interfaces/metadata.interface.js';
import { embedFromTemplate } from '@utils/embed/embed-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('lyrics.description'),
};

/**
 * Command for showing the lyrics of the current song
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('lyrics').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [embedFromTemplate('noQueue', client)], ephemeral: true }, 2);

    //Defer the reply
    await deferReply(inter, { ephemeral: false });

    //Search for the lyrics
    const lyrics = await useMainPlayer().lyrics.search({
      q: `${(queue.currentTrack as Track<ITrackMetadata>).author} ${(queue.currentTrack as Track<ITrackMetadata>).title}`,
    });

    //If there are no lyrics
    if (!lyrics.length)
      return await reply(
        inter,
        { embeds: [embedFromTemplate('noLyrics', queue.currentTrack as Track<ITrackMetadata>)], ephemeral: true },
        2
      );

    //Send the lyrics embed
    await reply(inter, { embeds: [embedFromTemplate('lyrics', lyrics)] });
  },
};
