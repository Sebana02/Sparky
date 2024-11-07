import { ChatInputCommandInteraction, Client, GuildMember, SlashCommandBuilder } from 'discord.js';
import { useQueue, GuildQueue, Track } from 'discord-player';
import { deferReply, reply } from '../../../utils/interaction-utils.js';
import { noQueue, save, savePrivate } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('save.description'),
};

/**
 * Command for saving the current song in a private message
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('save').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Defer the reply
    await deferReply(inter, { ephemeral: true });

    //Send the save embed to the user
    await (inter.member as GuildMember).send({ embeds: [savePrivate(queue.currentTrack as Track)] });

    //Send the save embed to the user
    return await reply(inter, { embeds: [save(queue.currentTrack as Track)], ephemeral: true }, 2);
  },
};
