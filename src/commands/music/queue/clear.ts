import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { useQueue, GuildQueue } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, clear } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('clear.description'),
};

/**
 * Command for clearing the queue
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('clear').setDescription(commandLit.description),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Clear the queue
    queue.clear();

    //Send the cleared queue embed
    await reply(inter, { embeds: [clear(client)] });
  },
};
