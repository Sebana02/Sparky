import { Client } from 'discord.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/**
 * Loads languages, events, and commands
 * @param client The Discord client
 * @note It is important that loadLanguages, loadEvents, and loadCommands are loaded in this order, thats why they are imported dinamically
 */
export default async function loadResources(client: Client): Promise<void> {
  // Log start time
  logger.info('----Starting bot----');

  // Get the current directory
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Load languages
  const loadLanguages = (await import('./loaders/languages-loader.js')).default;
  await loadLanguages(resolve(__dirname, '../locales'));

  // Load events
  const loadEvents = (await import('./loaders/events-loader.js')).default;
  await loadEvents(resolve(__dirname, './events'), client);

  // Load commands
  const loadCommands = (await import('./loaders/commands-loader.js')).default;
  await loadCommands(resolve(__dirname, './commands'));
}
