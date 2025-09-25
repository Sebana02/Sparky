import {
  Client,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageComponentInteraction,
  EmbedField,
  SlashCommandBuilder,
  MessageFlags,
} from 'discord.js';
import { ICommand } from '@interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { reply, deferReply, fetchReply, deleteReply, update } from '@utils/interaction-utils.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('help.description'),
  response: fetchFunction('help.response'),
};

export const command: ICommand = {
  data: new SlashCommandBuilder().setName('help').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Defer the reply to indicate processing
    await deferReply(inter, { flags: MessageFlags.Ephemeral });

    // Generate command fields
    const fields = Array.from(globalThis.commands.values()).map((command: ICommand) => ({
      name: `> **${command.data.name}**`,
      value: `\`${command.data.description}\``,
      inline: true,
    }));

    // Maximum allowed fields per embed
    const maxFields = 25;
    const chunkedFields = chunkFields(fields, maxFields);
    const totalPages = chunkedFields.length;

    // Initial page set to 0 (first page)
    let currentPage = 0;

    // Send the first embed with navigation buttons
    await reply(inter, {
      embeds: [generateEmbed(chunkedFields, currentPage, totalPages)],
      components: [createActionRow(currentPage, totalPages)],
      flags: MessageFlags.Ephemeral,
    });

    // Create the collector for handling button interactions
    await handleInteraction(inter, currentPage, chunkedFields, totalPages);
  },
};

/**
 * Generates an embed with the command fields.
 * @param fields - Array of command fields.
 * @param currentPage - The current page number.
 * @param totalPages - The total number of pages.
 * @returns Embed with the command fields.
 */
function generateEmbed(fields: EmbedField[][], currentPage: number, totalPages: number): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.information,
    fields: fields[currentPage],
    footer: {
      text: commandLit.response(currentPage + 1, totalPages),
    },
  });
}

/**
 * Creates an action row with navigation buttons.
 * @param currentPage - The current page number.
 * @param totalPages - The total number of pages.
 * @returns Action row with navigation buttons.
 */
function createActionRow(currentPage: number, totalPages: number): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('prev')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === 0), // Disable if on the first page
    new ButtonBuilder()
      .setCustomId('next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage === totalPages - 1) // Disable if on the last page
  );
}

/**
 * Chunks the fields array into smaller arrays.
 * @param fields - Array of command fields.
 * @param chunkSize - The size of each chunk.
 * @returns Array of chunked fields.
 */
function chunkFields(fields: EmbedField[], chunkSize: number): EmbedField[][] {
  const chunks = [];
  for (let i = 0; i < fields.length; i += chunkSize) chunks.push(fields.slice(i, i + chunkSize));

  return chunks;
}

/**
 * Updates the reply with a new embed and action row.
 * @param inter - Interaction object from the command.
 * @param fields - Array of command fields in chunks.
 * @param currentPage - The current page number.
 * @param totalPages - The total number of pages.
 */
async function updatePage(
  inter: MessageComponentInteraction,
  fields: EmbedField[][],
  currentPage: number,
  totalPages: number
): Promise<void> {
  await update(inter, {
    embeds: [generateEmbed(fields, currentPage, totalPages)],
    components: [createActionRow(currentPage, totalPages)],
  });
}

/**
 * Handles button interactions for navigation.
 * @param inter - Interaction object from the command.
 * @param currentPage - The current page number.
 * @param chunkedFields - Array of command fields in chunks.
 * @param totalPages - The total number of pages.
 */
async function handleInteraction(
  inter: ChatInputCommandInteraction,
  currentPage: number,
  chunkedFields: EmbedField[][],
  totalPages: number
): Promise<void> {
  const replyMessage = await fetchReply(inter);
  const collector = replyMessage.createMessageComponentCollector({
    filter: (interaction: MessageComponentInteraction) =>
      interaction.isButton() &&
      ['prev', 'next'].includes(interaction.customId) &&
      interaction.user.id === inter.user.id,
    time: 60000,
  });

  // Handle button interactions
  collector.on('collect', async (interaction: MessageComponentInteraction) => {
    if (interaction.customId === 'prev') currentPage--;
    if (interaction.customId === 'next') currentPage++;

    // Update the embed with the new page and reset the collector timer
    await updatePage(interaction, chunkedFields, currentPage, totalPages);
    collector.resetTimer();
  });

  // Delete the reply when the collector ends
  collector.on('end', () => {
    deleteReply(inter);
  });
}
