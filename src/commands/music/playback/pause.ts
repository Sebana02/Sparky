import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { useQueue, usePlayer, Track } from 'discord-player';
import { reply } from '@utils/interaction-utils.js';
import { noQueue, pause } from '@utils/embed/embed-presets.js';
import { fetchString } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '@interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('pause.description'),
};

/**
 * Command for pausing the queue
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('pause').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and player
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);
    const player = usePlayer<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Pause the player
    player?.setPaused(true);

    //Send the pause embed
    await reply(inter, { embeds: [pause(queue.currentTrack as Track<ITrackMetadata>)] });
  },
};
