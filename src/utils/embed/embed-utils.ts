import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js';
import * as presets from '@utils/embed/embed-presets.js';

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
  music = 0x9cb3c9,
  default = 0x424549,
}
/**
 * Create a new Discord embed using the provided embedContent
 * @param embedContent - The content for the embed.
 * @returns The created Discord embed.
 * @throws An error if the created embed is empty.
 */
export function createEmbed(embedContent: EmbedData | APIEmbed): EmbedBuilder {
  try {
    // Set the default color if not provided
    embedContent.color = embedContent.color || ColorScheme.default;

    // Create a new Discord embed
    const embed = new EmbedBuilder(embedContent);

    // Check if the embed is empty
    checkEmbed(embed);

    // Return the created embed
    return embed;
  } catch (error: any) {
    error.message = `creating embed: ${error.message}`;
    throw error;
  }
}

/**
 * Modify an existing Discord embed using the provided embedContent
 * @param embed - The existing Discord embed to be modified.
 * @param embedContent - The content for the embed.
 * @returns The modified Discord embed.
 * @throws An error if the modified embed is empty.
 */
export function modifyEmbed(embed: EmbedBuilder, embedContent: EmbedData | APIEmbed): EmbedBuilder {
  try {
    // Set the properties of the embed
    Object.assign(embed.data, embedContent);

    // Check if the embed is empty
    checkEmbed(embed);

    // Return the modified embed
    return embed;
  } catch (error: any) {
    error.message = `modifying embed: ${error.message}`;
    throw error;
  }
}

/**
 * Clone an existing Discord embed
 * @param embed - The existing Discord embed to be cloned.
 * @returns The cloned Discord embed.
 * @throws An error if the cloned embed is empty.
 */
export function cloneEmbed(embed: EmbedBuilder): EmbedBuilder {
  try {
    // Check if the given embed is valid
    checkEmbed(embed);
    // Return the cloned embed
    return new EmbedBuilder(embed.toJSON());
  } catch (error: any) {
    error.message = `cloning embed: ${error.message}`;
    throw error;
  }
}

/**
 * Check if the given embed is valid
 * @param embed - The Discord embed to be checked.
 * @throws An error if the embed is not valid.
 */
function checkEmbed(embed: EmbedBuilder): void {
  // Destructure the embed data
  const { title, description, fields, image, thumbnail, author, footer } = embed.data;

  // Check if the embed is valid
  if (!(title || description || (fields && fields.length > 0) || image || thumbnail || author || footer))
    throw new Error('given embed is not valid');
}

/**
 * Create a new Discord embed using one of the provided templates
 * @param templateName - The name of the template to use.
 * @param args - The arguments for the template.
 * @returns The created Discord embed.
 */
export function embedFromTemplate<T extends keyof typeof presets>(
  templateName: T,
  ...args: Parameters<(typeof presets)[T]>
): EmbedBuilder {
  // Get the method for the template and create the embed
  const method = presets[templateName] as (this: any, ...args: Parameters<(typeof presets)[T]>) => APIEmbed;
  const embed = createEmbed(method.apply(null, args)); // For some reason, TS doesn't like the spread operator here

  // Check if the embed is empty
  checkEmbed(embed);

  // Return the created embed
  return embed;
}
