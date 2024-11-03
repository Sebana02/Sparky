import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  desciption: fetchString('hug.description'),
  userName: fetchString('hug.option.name'),
  userDescription: fetchString('hug.option.description'),
  responseTitle: fetchFunction('hug.response.description'),
  responseDescription: fetchFunction('hug.response.footer'),
};

/**
 * Command that sends a random gif from the category hug, hug the user
 */
export const command: ICommand = {
  name: 'hug',
  description: commandLit.desciption,
  options: [
    {
      name: commandLit.userName,
      description: commandLit.userDescription,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  /**
   * Run the command
   * @param client The client instance
   * @param inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the target user
    const targetUser = inter.options.getUser(commandLit.userName, true);

    // Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      description: commandLit.responseTitle(targetUser),
      footer: {
        text: commandLit.responseDescription(inter.user.username),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    // Reply with a random gif, hugging the user
    await sendRandomGif(inter, 'hug', embed);
  },
};
