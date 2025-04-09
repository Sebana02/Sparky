import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { useQueue, usePlayer, Track } from 'discord-player';
import { reply } from '@utils/interaction-utils.js';
import { noQueue, resume } from '@utils/embed/embed-presets.js';
import { fetchString } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '@interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('resume.description'),
};

/**
 * Command for resuming the queue
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('resume').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and the player
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);
    const player = usePlayer<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Resume the queue
    player?.setPaused(false);

    //Send the resume embed
    await reply(inter, { embeds: [resume(queue.currentTrack as Track<ITrackMetadata>)] });
  },
};
