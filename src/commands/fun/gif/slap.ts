import { ICommand } from '@interfaces/command.interface.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

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
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription(commandLit.description)
    .addUserOption((option) =>
      option.setName(commandLit.userName).setDescription(commandLit.userDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the target user
    const targetUser = inter.options.getUser(commandLit.userName, true);

    // Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      description: commandLit.responseTitle(targetUser),
      footer: {
        text: commandLit.responseDescription(inter.user.username),
        icon_url: inter.user.displayAvatarURL(),
      },
    });

    // Reply with a random gif, slapping the user
    await sendRandomGif(inter, 'slap', embed);
  },
};
