import { ICommand } from '@interfaces/command.interface.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('shut_up.description'),
  userName: fetchString('shut_up.option.name'),
  userDescription: fetchString('shut_up.option.description'),
  responseTitle: fetchFunction('shut_up.response.description'),
  responseDescription: fetchFunction('shut_up.response.footer'),
};

/**
 * Command that tells a user to shut up via gif
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('shutup')
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
      description: fetchFunction('shut_up.response.description')(targetUser),
      footer: {
        text: fetchFunction('shut_up.response.footer')(inter.user.username),
        icon_url: inter.user.displayAvatarURL(),
      },
    });

    // Reply with a random gif, telling the user to shut up
    await sendRandomGif(inter, 'shut_up', embed);
  },
};
