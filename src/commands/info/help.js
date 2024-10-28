const { reply, deferReply, fetchReply, deleteReply } = require('@utils/interaction-utils.js');
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js');
const { fetchCommandLit } = require('@utils/language-utils.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Preload literals
const literals = {
  description: fetchCommandLit('info.help.description'),
  response: (page, total) => fetchCommandLit('info.help.response', page, total),
};

module.exports = {
  name: 'help',
  description: literals.description,
  run: async (client, inter) => {
    // Defer the reply to indicate processing
    await deferReply(inter, { ephemeral: true });

    // Generate command fields
    const fields = client.commands.map((command) => ({
      name: `> **${command.name}**`,
      value: `\`${command.description}\``,
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
      ephemeral: true,
    });

    // Create the collector for handling button interactions
    await handleInteraction(inter, currentPage, chunkedFields, totalPages);
  },
};

/**
 * Generates an embed for the current page.
 * @param {Array} fields - Array of command fields.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @returns {Object} Embed object for the current page.
 */
function generateEmbed(fields, currentPage, totalPages) {
  return createEmbed({
    color: ColorScheme.information,
    fields: fields[currentPage],
    footer: {
      text: literals.response(currentPage + 1, totalPages),
    },
  });
}

/**
 * Creates the navigation buttons for pagination.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @returns {ActionRowBuilder} Action row with navigation buttons.
 */
function createActionRow(currentPage, totalPages) {
  return new ActionRowBuilder().addComponents(
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
 * Splits an array of fields into chunks of the specified size.
 * @param {Array} fields - Array of command fields.
 * @param {number} chunkSize - Maximum number of fields per chunk.
 * @returns {Array} Array of chunks, each containing up to `chunkSize` fields.
 */
function chunkFields(fields, chunkSize) {
  const chunks = [];
  for (let i = 0; i < fields.length; i += chunkSize) chunks.push(fields.slice(i, i + chunkSize));

  return chunks;
}

/**
 * Updates the embed with the new page and resets the collector timer.
 * @param {Object} inter - Interaction object from the collector.
 * @param {Array} fields - Array of command fields.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 */
async function updatePage(inter, fields, currentPage, totalPages) {
  await inter.update({
    embeds: [generateEmbed(fields, currentPage, totalPages)],
    components: [createActionRow(currentPage, totalPages)],
    ephemeral: true,
  });
}

/**
 * Handles the interaction for navigation buttons.
 * @param {Object} inter - Interaction object from the command.
 * @param {number} currentPage - The current page number.
 * @param {Array} chunkedFields - Array of command fields in chunks.
 * @param {number} totalPages - The total number of pages.
 */
async function handleInteraction(inter, currentPage, chunkedFields, totalPages) {
  const replyMessage = await fetchReply(inter);
  const collector = replyMessage.createMessageComponentCollector({
    filter: (i) => ['prev', 'next'].includes(i.customId) && i.user.id === inter.user.id,
    time: 60000,
  });

  // Handle button interactions
  collector.on('collect', async (interaction) => {
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
