import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { GuildQueue, Track, useQueue } from 'discord-player';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';
import { lyricsExtractor } from '@discord-player/extractor';
import { embedFromTemplate } from '../../../utils/embed/embed-utils.js';

const genius = lyricsExtractor();

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
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [embedFromTemplate('noQueue', client)], ephemeral: true }, 2);

    //Defer the reply
    await deferReply(inter, { ephemeral: false });

    //Search for the lyrics
    const lyricsData = await genius.search((queue.currentTrack as Track).title);

    //If there are no lyrics
    if (!lyricsData)
      return await reply(
        inter,
        { embeds: [embedFromTemplate('noLyrics', queue.currentTrack as Track)], ephemeral: true },
        2
      );

    //Send the lyrics embed
    await reply(inter, { embeds: [embedFromTemplate('lyrics', lyricsData)] });
  },
};
