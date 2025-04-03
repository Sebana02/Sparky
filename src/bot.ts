import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { config as loadEnv } from 'dotenv';
import { IConfig, IUserConfig } from './interfaces/config.interface.js';
import loadLogger from './logger.js';
import loadResources from './loader.js';

/**
 * Main function to run the bot
 */
async function run(): Promise<void> {
  // Load configuration
  await loadConfig();

  // Load logger
  loadLogger();

  // Create a new Discord client
  const client: Client = createClient();

  // Create and set up a new player for music
  createPlayer(client);

  // Load commands, languages, and events
  await loadResources(client);

  // Log the bot into Discord
  await login(client);
}

/**
 * Load configuration from environment variables and config file
 */
async function loadConfig() {
  // Load environment variables
  loadEnv();

  // We store the config file path in a variable to avoid TypeScript trying to resolve it during compilation, just in case the file is missing or has an error
  const configPath = './config.js';

  // Load client config, it is loaded asynchronously just in case the config file is missing or has an error
  const appConfig = await import(configPath)
    .then((configFile) => {
      // Prioritize `default` export, fallback to first object found
      const configModule = configFile.default ?? Object.values(configFile).find((m) => typeof m === 'object');

      // Check if the config module is valid, if not, throw an error
      if (!configModule) throw new Error('Config file does not export a valid module');

      // If valid, return the config module
      return configModule as IUserConfig;
    })
    .catch((error) => {
      // Log the error and return an empty object
      console.error(`Could not load config file: ${error.message}`);
      return {} as IUserConfig;
    });

  // Load configuration into global variable
  const config: IConfig = {
    app: {
      defaultLocale: 'en_US',
      locale: appConfig.locale || 'en_US',
      logPath: appConfig.logPath || '.log',
      guildConfig: appConfig.guildConfig,
      clientConfig: appConfig.clientConfig,
    },
    secret: {
      token: process.env.TOKEN,
      tenorAPIKey: process.env.TENOR_API_KEY,
    },
  };

  globalThis.config = Object.freeze(config); // Store config in global variable
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
  if (!config.secret.token) {
    logger.error('TOKEN environment variable not found');
    process.exit(1);
  }

  // Log the bot into Discord
  await client.login(config.secret.token).catch((error: Error) => {
    logger.error(`Could not log in bot: ${error.message}`);
    process.exit(1);
  });
}

// Start the bot
run();
