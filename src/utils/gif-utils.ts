import { modifyEmbed, createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { reply, deferReply } from '@utils/interaction-utils.js';
import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { fetchFunction } from '@utils/language-utils.js';

/**
 * Literal object for utility functions
 */
const utilLit = {
  noResults: fetchFunction('gif_utils.no_results'),
};

/**
 * Constructs a search URL for the Tenor API based on the specified keywords
 * @param keywords - The keywords to search for
 * @returns The search URL
 */
function search(keywords: string): string {
  return [
    `https://tenor.googleapis.com/v2/search?`,
    `q=${encodeURIComponent(keywords)}`,
    `&key=${config.secret.tenorAPIKey}`,
    `&limit=${50}`,
  ].join('');
}

/**
 * Fetches a random GIF based on the specified category
 * @param category - The category of the GIF
 * @returns A Promise that resolves to the URL of the random GIF, or null if no GIF is found
 */
export async function getRandomGif(category: string): Promise<string | null> {
  try {
    // Check if the api key is set
    if (!config.secret.tenorAPIKey) throw new Error('TENOR_API_KEY environment variable not set');

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
    throw error;
  }

  return null;
}

/**
 * Sends a random GIF based on the specified category
 * @param inter - The interaction
 * @param category - The category of the GIF
 * @param embed - The embed to send
 */
export async function sendRandomGif(
  inter: ChatInputCommandInteraction,
  category: string,
  embed: EmbedBuilder | null
): Promise<void> {
  try {
    //Defer reply
    await deferReply(inter, { flags: MessageFlags.Ephemeral });

    //Search gifs
    const gifURL = await getRandomGif(category);

    //If no gif found, send message and return
    if (!gifURL) {
      const errorEmbed = createEmbed({
        color: ColorScheme.error,
        title: utilLit.noResults(category),
      });
      return await reply(inter, { embeds: [errorEmbed] }, 3);
    }

    //Create embed with gif and send it
    if (embed) modifyEmbed(embed, { image: { url: gifURL } });
    else embed = createEmbed({ image: { url: gifURL } });

    await reply(inter, { embeds: [embed] });
  } catch (error: any) {
    error.message = `sending gif failed: ${error.message}`;
    throw error;
  }
}
