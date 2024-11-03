import { Client, ChatInputCommandInteraction } from 'discord.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '../../utils/embed/embed-utils.js';
import { reply } from '../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('uptime.description'),
  response: fetchFunction('uptime.response'),
};

/**
 * Command that shows the bot's uptime
 */
export const command: ICommand = {
  name: 'uptime',
  description: commandLit.description,

  /**
   * Run the command
   * @param {Client} client The client instance
   * @param {ChatInputCommandInteraction} inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get the uptime in seconds
    const uptime = process.uptime();

    //Calculate the days, hours, minutes and seconds
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    //Create the embed
    const embed = createEmbed({
      color: ColorScheme.information,
      footer: {
        text: commandLit.response(days, hours, minutes, seconds),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    //Reply with the uptime
    await reply(inter, { embeds: [embed] });
  },
};
