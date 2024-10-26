import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { config as loadEnvironmentVariables } from "dotenv";
import logger from "./logger";
import loader from "./loader";

/**
 * Main function to run the bot
 */
async function run(): Promise<void> {
  loadEnvironmentVariables(); // Load environment variables
  const client = createClient(); // Create a new Discord client

  createPlayer(client); // Create player
  loadResources(client); // Load commands, languages, and events
  await login(client); // Logs the bot into Discord
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
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.Reaction,
      Partials.User,
      Partials.GuildMember,
    ],
  });
}

/**
 * Create and set up a new player for music
 * @param client The Discord client
 */
function createPlayer(client: Client): void {
  const player = new Player(client); // Player setup
  player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor"); // Load default extractors, except YouTube
  player.extractors.register(YoutubeiExtractor, {}); // Load YouTube support
}

/**
 * Load the logger, commands, languages, and events
 * @param client The Discord client
 */
function loadResources(client: Client): void {
  globalThis.logger = logger; // Load logger
  loader(client); // Load commands, languages, and events
}

/**
 * Logs the bot into Discord
 * @param client The Discord client
 */
async function login(client: Client): Promise<void> {
  // // Check if the token is set
  // if (!process.env.TOKEN || process.env.TOKEN.trim() === "") {
  //   logger.error("TOKEN environment variable not found");
  //   process.exit(1);
  // }
  // // Log the bot into Discord
  // await client.login(process.env.TOKEN).catch((error: any) => {
  //   logger.error(`Error during login: ${error.message}`);
  // });
}

// Start the bot
run();
