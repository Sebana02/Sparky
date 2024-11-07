import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('poke.description'),
  userName: fetchString('poke.option.name'),
  userDescription: fetchString('poke.option.description'),
  responseTitle: fetchFunction('poke.response.description'),
  responseDescription: fetchFunction('poke.response.footer'),
};

/**
 * Command that sends a random gif from the category poke, poke the user
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('poke')
    .setDescription(commandLit.description)
    .addUserOption((option) =>
      option.setName(commandLit.userName).setDescription(commandLit.userDescription).setRequired(true)
    ) as SlashCommandBuilder,

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

    // Reply with a random gif, poking the user
    await sendRandomGif(inter, 'poke', embed);
  },
};
