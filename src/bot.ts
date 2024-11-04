import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { config as loadEnv } from 'dotenv';

/**
 * Main function to run the bot
 */
async function run(): Promise<void> {
  // Load environment variables
  loadEnv();

  // Load logger
  const loadLogger = (await import('./logger.js')).default;
  loadLogger();

  // Create a new Discord client
  const client: Client = createClient();

  // Create and set up a new player for music
  createPlayer(client);

  // Load commands, languages, and events
  const loadResources = (await import('./loader.js')).default;
  await loadResources(client);

  // Log the bot into Discord
  await login(client);
}

/**
 * Create a new Discord client
 * @returns The created Discord client
 */
function createClient(): Client {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
  });
}

/**
 * Create and set up a new player for music
 * @param client The Discord client
 */
function createPlayer(client: Client): void {
  const player = new Player(client); // Player setup
  player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor'); // Load default extractors, except YouTube
  player.extractors.register(YoutubeiExtractor, {}); // Load YouTube support
}

/**
 * Logs the bot into Discord
 * @param client The Discord client
 */
async function login(client: Client): Promise<void> {
  // Check if the token is set
  if (!process.env.TOKEN || process.env.TOKEN.trim() === '') {
    logger.error('TOKEN environment variable not found');
    process.exit(1);
  }

  // Log the bot into Discord
  await client.login(process.env.TOKEN).catch((error: any) => {
    logger.error(`Could not log in bot: ${error.message}`);
    process.exit(1);
  });
}

// Start the bot
run();
