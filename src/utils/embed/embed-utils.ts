import { EmbedBuilder } from 'discord.js';
import { IEmbed } from '../../interfaces/embed.interface.js';

/**
 * Color scheme for Discord embeds
 */
export enum ColorScheme {
  error = 0x9b2222,
  utility = 0x062239,
  moderation = 0x123552,
  information = 0x2a4f6e,
  game = 0x496c89,
  fun = 0x718da5,
  default = 0x424549,
}

/**
 * Create a new Discord embed using the provided embedContent
 * @param {IEmbed} embedContent - The content for the embed.
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the creation of the embed.
 * @returns {EmbedBuilder} - The created Discord embed.
 * @throws {Error} - If the created embed is empty.
 * @note Make sure to provide at least one of the following properties: title, description, fields, image, thumbnail, author, or footer, otherwise an error will be thrown.
 */
export function createEmbed(embedContent: IEmbed, propagate: boolean = true): EmbedBuilder {
  // Create a new Discord embed
  const embed = new EmbedBuilder();

  try {
    // Set the properties of the embed
    setEmbedProperties(embed, embedContent);

    // Check if the embed is empty
    if (!isValidEmbed(embed)) throw new Error('embed is not valid');
  } catch (error: any) {
    error.message = `creating embed: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }

  // Return the created embed
  return embed;
}

/**
 * Modify an existing Discord embed using the provided embedContent
 * @param {EmbedBuilder} embed - The existing Discord embed to be modified.
 * @param {IEmbed} embedContent - The content for the embed.
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the modification of the embed.
 * @returns {EmbedBuilder} - The modified Discord embed.
 * @throws {Error} - If the modified embed is empty.
 */
export function modifyEmbed(
  embed: EmbedBuilder,
  embedContent: IEmbed,
  propagate: boolean = true
): EmbedBuilder {
  try {
    // Check if the given embed is valid
    if (!isValidEmbed(embed)) throw new Error('given embed is not valid');

    // Set the properties of the embed
    setEmbedProperties(embed, embedContent);

    // Check if the embed is empty
    if (!isValidEmbed(embed)) throw new Error('embed is not valid');
  } catch (error: any) {
    error.message = `modifying embed: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }

  // Return the modified embed
  return embed;
}

/**
 * Clone an existing Discord embed
 * @param {EmbedBuilder} embed - The existing Discord embed to be cloned.
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the cloning of the embed.
 * @returns {EmbedBuilder} - The cloned Discord embed.
 * @throws {Error} - If the cloned embed is empty.
 */
export function cloneEmbed(embed: EmbedBuilder, propagate: boolean = true): EmbedBuilder {
  // Create a new Discord embed
  let clonedEmbed = new EmbedBuilder();

  try {
    // Check if the given embed is valid
    if (!isValidEmbed(embed)) throw new Error('given embed is not valid');

    // Clone the embed
    clonedEmbed = new EmbedBuilder(embed.data);
  } catch (error: any) {
    error.message = `cloning embed: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }

  // Return the cloned embed
  return clonedEmbed;
}

/**
 * Check if a Discord embed is valid
 * @param {EmbedBuilder} embed - The Discord embed to check.
 * @returns {boolean} - Whether the embed is valid.
 */
function isValidEmbed(embed: EmbedBuilder): boolean {
  // Destructure the embed data
  const { title, description, fields, image, thumbnail, author, footer } = embed.data;

  // Check if the embed is valid
  return !!(
    title ||
    description ||
    (fields && fields.length > 0) ||
    image ||
    thumbnail ||
    author?.name ||
    footer?.text
  );
}

/**
 * Add properties to an existing Discord embed
 * @param embed - The existing Discord embed to add properties to
 * @param properties - The properties to add to the embed
 */
function setEmbedProperties(embed: EmbedBuilder, properties: IEmbed): void {
  // Destructure the properties
  const { title, description, color, thumbnail, image, url, footer, author, setTimestamp, fields } =
    properties;

  // Set the properties of the embed
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  embed.setColor(color || ColorScheme.default);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (image) embed.setImage(image);
  if (url) embed.setURL(url);
  if (footer?.text) embed.setFooter(footer);
  if (author?.name) embed.setAuthor(author);
  if (setTimestamp) embed.setTimestamp();
  if (fields) fields.forEach((field) => field.name && field.value && embed.addFields(field));
}
