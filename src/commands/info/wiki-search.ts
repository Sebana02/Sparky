import { embedFromTemplate } from '@/utils/embed-utils.js';
import { reply, deferReply } from '@utils/interaction-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('wiki_search.description'),
  termName: fetchString('wiki_search.option.name'),
  termDescription: fetchString('wiki_search.option.description'),
  noResults: fetchFunction('wiki_search.no_results'),
};

/**
 *  Max number of results to get
 */
const limit = 10;

/**
 * Language code for the Wikipedia API
 */
const lang = config.app.locale.split('_')[0];

/**
 * Command for searching Wikipedia
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('wikisearch')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.termName).setDescription(commandLit.termDescription).setRequired(true)
    ),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get search term
    const searchTerm = inter.options.getString(commandLit.termName, true);

    //Defer reply
    await deferReply(inter, {});

    //Search Wikipedia and check if the request was successful
    const response = await fetch(search(searchTerm));
    if (!response.ok) throw new Error('Invalid HTTP request, code: ' + response.status);

    //Parse the JSON response
    const { query: { search: results } = {} } = await response.json();

    // Check for results
    if (!results?.length) return await reply(inter, { content: commandLit.noResults(searchTerm) }, 3);

    // Extract first result
    const [{ pageid, title, snippet }] = results;
    const cleanSnippet = snippet.replace(/<\/?[^>]+(>|$)/g, '');
    const pageUrl = `https://${lang}.wikipedia.org/?curid=${pageid}`;

    //Reply with the search result
    await reply(inter, {
      embeds: [embedFromTemplate('wikiSearch', inter, searchTerm, { title, snippet: cleanSnippet, pageUrl })],
    });
  },
};

/**
 * Function to search Wikipedia
 * @param keywords - The search keywords
 * @returns - The URL to search Wikipedia
 */
function search(keywords: string): string {
  return [
    `https://${lang}.wikipedia.org/w/api.php?action=query`,
    `&list=search`,
    `&prop=info`,
    `&inprop=url`,
    `&utf8=`,
    `&format=json`,
    `&origin=*`,
    `&srlimit=${limit}`,
    `&srsearch=${encodeURIComponent(keywords)}`,
  ].join('');
}
