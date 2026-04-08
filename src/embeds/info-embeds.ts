import { ChatInputCommandInteraction, EmbedData, EmbedField } from 'discord.js';
import { ColorScheme } from '@utils/embed-utils.js';
import { fetchFunction } from '@utils/language-utils.js';

/**
 * Literal object for info embeds
 */
const infoLit = {
  uptimeMessage: fetchFunction('uptime.response'),
  wikiSearchMessage: fetchFunction('wiki_search.results'),
  helpMessage: fetchFunction('help.response'),
};

/**
 * Information embed preset for uptime command
 * @param inter The interaction object
 * @param days The number of days
 * @param hours The number of hours
 * @param minutes The number of minutes
 * @param seconds The number of seconds
 * @returns The uptime embed
 */
export function uptime(
  inter: ChatInputCommandInteraction,
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): EmbedData {
  return {
    color: ColorScheme.information,
    footer: {
      text: infoLit.uptimeMessage(days, hours, minutes, seconds),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Information embed preset for wiki search command
 * @param inter The interaction object
 * @param searchTerm The search term
 * @param result The wiki search result
 * @returns The wiki search embed
 */
export function wikiSearch(
  inter: ChatInputCommandInteraction,
  searchTerm: string,
  result: { title: string; snippet: string; pageUrl: string }
): EmbedData {
  return {
    color: ColorScheme.information,
    title: result.title,
    description: result.snippet,
    url: result.pageUrl,
    footer: {
      text: infoLit.wikiSearchMessage(searchTerm, result.pageUrl),
      iconURL: inter.user.displayAvatarURL(),
    },
    timestamp: Date.now(),
  };
}

/**
 * Info embed preset for help command
 * @param fields The embed fields
 * @param currentPage The current page number
 * @param totalPages The total number of pages
 * @returns The help embed
 */
export function help(fields: EmbedField[], currentPage: number, totalPages: number): EmbedData {
  return {
    color: ColorScheme.information,
    fields: fields,
    footer: {
      text: infoLit.helpMessage(currentPage + 1, totalPages),
    },
    timestamp: Date.now(),
  };
}
