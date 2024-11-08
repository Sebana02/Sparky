import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, stop } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IQueuePlayerMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('stop.description'),
};

/**
 * Command for stopping the music
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('stop').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Stop the queue
    queue.delete();

    //Send the stop embed
    await reply(inter, { embeds: [stop(client)] });
  },
};
