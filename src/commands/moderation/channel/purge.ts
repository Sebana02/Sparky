import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { reply } from '@utils/interaction-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('purge.description'),
  amountName: fetchString('purge.option.name'),
  amountDescription: fetchString('purge.option.description'),
  response: fetchFunction('purge.response'),
};

/**
 * Command that deletes the given number of messages
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addNumberOption((option) =>
      option
        .setName(commandLit.amountName)
        .setDescription(commandLit.amountDescription)
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the number of messages to delete
    const amount = inter.options.getNumber(commandLit.amountName, true);

    //Reply to the interaction
    await reply(inter, { content: commandLit.response(amount), ephemeral: true }, 2);

    //Delete the messages
    if (inter.inGuild()) await inter.channel?.bulkDelete(amount, true);
  },
};
