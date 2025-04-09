import { createEmbed, ColorScheme } from '../../utils/embed/embed-utils.js';
import { reply, deferReply } from '../../utils/interaction-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from '../../interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('wiki_search.description'),
  termName: fetchString('wiki_search.option.name'),
  termDescription: fetchString('wiki_search.option.description'),
  noResults: fetchFunction('wiki_search.no_results'),
  response: fetchFunction('wiki_search.results'),
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
    await deferReply(inter, { ephemeral: false });

    //Search Wikipedia
    const response = await fetch(search(searchTerm));

    //Check if the request was successful
    if (!response.ok) throw new Error('Invalid HTTP request, code: ' + response.status);

    //Parse the JSON response
    const data = await response.json();

    //Check if there are any results
    if (data.query.search.length === 0) return await reply(inter, { content: commandLit.noResults(searchTerm) }, 3);

    // Extracting the first search result
    const result = data.query.search[0];
    const pageUrl = `https://${lang}.wikipedia.org/?curid=${result.pageid}`;

    // Create embed with search result
    const embed = createEmbed({
      color: ColorScheme.information,
      title: result.title,
      description: result.snippet.replace(/<\/?[^>]+(>|$)/g, ''), // Removing HTML tags from snippet
      url: pageUrl,
      footer: {
        text: commandLit.response(searchTerm),
        icon_url: inter.user.displayAvatarURL(),
      },
      timestamp: Date.now(),
    });

    //Reply with the search result
    await reply(inter, { embeds: [embed] });
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
