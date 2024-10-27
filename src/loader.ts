import { Client } from "discord.js";
import { resolve } from "path";
import loadLanguages from "./loaders/languages-loader";
import loadEvents from "./loaders/events-loader";
import loadCommands from "./loaders/commands-loader";

/**
 * Loads languages, events, and commands
 * @param client The Discord client
 */
export default function loader(client: Client): void {
  // Log start time
  logger.info("----Starting bot----");

  // Load languages
  loadLanguages(resolve(__dirname, "../locales"));

  // Load events
  loadEvents(resolve(__dirname, "events"), client);

  // Load commands
  loadCommands(resolve(__dirname, "commands"));
}
