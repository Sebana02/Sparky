import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { reply } from '@utils/interaction-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('8ball.description'),
  questionName: fetchString('8ball.option.name'),
  questionDescription: fetchString('8ball.option.description'),
};

/**
 * Command that asks a question to the magic 8ball and gets a random response
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.questionName).setDescription(commandLit.questionDescription).setRequired(true)
    ),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the target user
    const question = inter.options.getString(commandLit.questionName, true);

    // Reply to the interaction
    await reply(inter, { embeds: [embedFromTemplate('eightBall', inter, question)] });
  },
};
