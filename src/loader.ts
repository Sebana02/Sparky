import { Client } from "discord.js";
import { resolve } from "path";
import loadLanguages from "./loaders/languages-loader.js";
import loadEvents from "./loaders/events-loader.js";
import loadCommands from "./loaders/commands-loader.js";

/**
 * Loads languages, events and commands
 * @param client The discord client
 */
export default async function loader(client: Client) {
  // Log start time
  logger.info("----Starting bot----");

  // Load languages
  await loadLanguages(resolve(import.meta.dirname, "../locales"));

  // Load events
  await loadEvents(resolve(import.meta.dirname, "../events"), client);

  // Load commands
  await loadCommands(resolve(import.meta.dirname, "../commands"));
}
