import { ICommand } from '../../interfaces/command.interface.js';
import { fetchArray, fetchFunction, fetchString } from '../../utils/language-utils.js';
import { createEmbed, ColorScheme } from '../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';
import { reply } from '../../utils/interaction-utils.js';

/**
 * Command that asks a question to the magic 8ball and gets a random response
 */
export const command: ICommand = {
  name: '8ball',
  description: fetchString('8ball.description'),
  options: [
    {
      name: fetchString('8ball.option.name'),
      description: fetchString('8ball.option.description'),
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   * Run the command
   * @param client The client instance
   * @param inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the question
    const question = inter.options.getString(fetchString('8ball.option.name'));
    if (!question) throw new Error(`Option "${fetchString('8ball.option.name')}" was not found`);

    // Get possible answers
    const answers = fetchArray('8ball.response.answers');

    // Create embed with random response
    const embed = createEmbed({
      title: `🎱 ${answers[Math.floor(Math.random() * answers.length)]}`,
      color: ColorScheme.fun,
      footer: {
        text: fetchFunction('8ball.response.footer')(inter.user.username, question),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    // Reply to the interaction
    await reply(inter, { embeds: [embed] });
  },
};
