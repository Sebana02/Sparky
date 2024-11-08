import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { useQueue, usePlayer, GuildQueue, GuildQueuePlayerNode } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, nowPlaying } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IQueuePlayerMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('now_playing.description'),
};

/**
 * Command for showing the current playing song
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('nowplaying').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and player
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);
    const player = usePlayer<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Send the now playing embed
    await reply(inter, { embeds: [nowPlaying(queue, player as GuildQueuePlayerNode<IQueuePlayerMetadata>)] });
  },
};
