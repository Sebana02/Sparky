import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('slap.description'),
  userName: fetchString('slap.option.name'),
  userDescription: fetchString('slap.option.description'),
  responseTitle: fetchFunction('slap.response.description'),
  responseDescription: fetchFunction('slap.response.footer'),
};

/**
 * Command that sends a random gif from the category slap, slap the user
 */
export const command: ICommand = {
  name: 'slap',
  description: commandLit.description,
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

    // Reply with a random gif, slapping the user
    await sendRandomGif(inter, 'slap', embed);
  },
};
