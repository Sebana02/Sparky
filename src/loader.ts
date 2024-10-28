import { Client } from 'discord.js';
import { dirname, resolve } from 'path';
import loadLanguages from './loaders/languages-loader.js';
import loadEvents from './loaders/events-loader.js';
import loadCommands from './loaders/commands-loader.js';
import { fileURLToPath } from 'url';

/**
 * Loads languages, events, and commands
 * @param client The Discord client
 */
export default async function loader(client: Client): Promise<void> {
  // Log start time
  logger.info('----Starting bot----');

  // Get the current directory
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Load languages
  loadLanguages(resolve(__dirname, '../locales'));

  // Load events
  await loadEvents(resolve(__dirname, 'events'), client);

  // Load commands
  await loadCommands(resolve(__dirname, 'commands'));
}
