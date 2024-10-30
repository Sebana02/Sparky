import { modifyEmbed, createEmbed, ColorScheme } from './embed/embed-utils.js';
import { reply, deferReply } from './interaction-utils.js';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { fetchFunction } from './language-utils.js';

/**
 * Constructs a search URL for the Tenor API based on the specified keywords
 * @param keywords - The keywords to search for
 * @returns The search URL
 */
function search(keywords: string): string {
  return `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(keywords)}&key=${process.env.TENOR_API_KEY}&limit=${50}`;
}

/**
 * Fetches a random GIF based on the specified category
 * @param category - The category of the GIF
 * @param propagate - Whether to propagate any errors that occur during the fetching of the GIF
 * @returns A Promise that resolves to the URL of the random GIF, or null if no GIF is found
 */
export async function getRandomGif(category: string, propagate: boolean = true): Promise<string | null> {
  try {
    // Check if the api key is set
    if (!process.env.TENOR_API_KEY || process.env.TENOR_API_KEY.trim() === '')
      throw new Error('TENOR_API_KEY environment variable not set');

    // Fetch the GIFs
    const response = await fetch(search(category));

    // Check if the request was successful
    if (!response.ok) throw new Error('invalid HTTP request, code: ' + response.status);

    // Parse the response
    // Get a random gif from the results if there are any and return its url
    // e.o.c. return null
    const data = await response.json();
    if (data.results && data.results.length > 0)
      return data.results[Math.floor(Math.random() * data.results.length)].media_formats.tinygif.url;
  } catch (error: any) {
    error.message = `fetching gifs failed: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }

  return null;
}

/**
 * Sends a random GIF based on the specified category and title
 * @param {ChatInputCommandInteraction} inter - The interaction object
 * @param {string} category - The category of the GIF
 * @param {EmbedBuilder} embed - The title of the GIF
 * @param {Object} [options={}] - The options for the function
 * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the sending of the GIF
 * @returns {Promise<void>}
 * @throws {Error} - If the GIF is not found or if there is an error in sending the GIF
 */
export async function sendRandomGif(
  inter: ChatInputCommandInteraction,
  category: string,
  embed: EmbedBuilder | null,
  propagate: boolean = true
): Promise<void> {
  try {
    //Defer reply
    await deferReply(inter);

    //Search gifs
    const gifURL = await getRandomGif(category);

    //If no gif found, send message and return
    if (!gifURL) {
      const errorEmbed = createEmbed({
        color: ColorScheme.error,
        title: fetchFunction('gif_utils.no_results')(category),
      });
      return await reply(inter, { embeds: [errorEmbed] }, { deleteTime: 3 });
    }

    //Create embed with gif and send it
    if (embed) modifyEmbed(embed, { image: gifURL });
    else embed = createEmbed({ image: gifURL });

    await reply(inter, { embeds: [embed] });
  } catch (error: any) {
    error.message = `sending gif failed: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}
