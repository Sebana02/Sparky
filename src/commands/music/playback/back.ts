import { ChatInputCommandInteraction, Client, SlashCommandBuilder, MessageFlags } from 'discord.js';
import { useQueue, Track } from 'discord-player';
import { deferReply, reply } from '@utils/interaction-utils.js';
import { noQueue, noHistory, previousTrack } from '@utils/embed/embed-presets.js';
import { fetchString } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '@interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('back.description'),
};

/**
 * Command for playing the previous song
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('back').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], flags: MessageFlags.Ephemeral }, 2);

    //Get the history
    const history = queue.history;

    //Check if there is a history
    if (history.isEmpty()) return await reply(inter, { embeds: [noHistory(client)], flags: MessageFlags.Ephemeral }, 2);

    //Defer reply
    await deferReply(inter, {});

    //Play the previous track
    await history.previous(true);

    //Send the previous track embed
    await reply(inter, { embeds: [previousTrack(queue.currentTrack as Track<ITrackMetadata>)] });
  },
};
