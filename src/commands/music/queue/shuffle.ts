import { ChatInputCommandInteraction, Client, SlashCommandBuilder, MessageFlags } from 'discord.js';
import { useQueue } from 'discord-player';
import { reply } from '@utils/interaction-utils.js';
import { noQueue, shuffle } from '@utils/embed/embed-presets.js';
import { fetchString } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { IQueuePlayerMetadata } from '@interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('shuffle.description'),
};

/**
 * Command for shuffling the queue
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('shuffle').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], flags: MessageFlags.Ephemeral }, 2);

    //Shuffle the queue
    queue.tracks.shuffle();

    //Send the shuffle embed
    await reply(inter, { embeds: [shuffle(queue)] });
  },
};
