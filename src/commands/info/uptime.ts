import { Client, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ICommand } from '@interfaces/command.interface.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { reply } from '@utils/interaction-utils.js';
import { fetchString } from '@utils/language-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('uptime.description'),
};

/**
 * Command that shows the bot's uptime
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('uptime').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get the uptime in seconds
    const uptime = process.uptime();

    //Calculate the days, hours, minutes and seconds
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    //Reply with the uptime
    await reply(inter, { embeds: [embedFromTemplate('uptime', inter, days, hours, minutes, seconds)] });
  },
};
