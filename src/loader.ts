import { Client } from 'discord.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import loadLanguages from './loaders/languages-loader.js';
import loadEvents from './loaders/events-loader.js';
import loadCommands from './loaders/commands-loader.js';

/**
 * Loads languages, events, and commands
 * @param client The Discord client
 */
export default async function loadResources(client: Client): Promise<void> {
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
