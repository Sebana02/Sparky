import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { config as loadEnvironmentVariables } from "dotenv";
import logger from "./src/logger.js";
import loader from "./src/loader.js";

/**
 * Run the bot
 */
async function run() {
  // Load environment variables
  loadEnvironmentVariables();

  // Create a new Discord client
  const client = createClient();

  // Create player
  createPlayer(client);

  // Load commands, languages, and events
  await load(client);

  // Logs the bot into Discord
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
 * Create and setup a new player for music
 * @param client The Discord client
 */
function createPlayer(client: Client) {
  const player = new Player(client); // player setup
  player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor"); // load default extractors, except youtube
  player.extractors.register(YoutubeiExtractor, {}); // load youtube support
}

/**
 * Loads the logger, commands, languages, and events
 * @param client The Discord client
 */
async function load(client: Client): Promise<void> {
  globalThis.logger = logger; // load logger

  await loader(client); // load commands, languages, and events
}

/**
 * Logs the bot into Discord
 * @param client The Discord client
 */
async function login(client: Client): Promise<void> {
  // // Check if TOKEN environment variable is set
  // if (!process.env.TOKEN || process.env.TOKEN.trim() === "") {
  //   logger.error("TOKEN environment variable not found");
  //   process.exit(1);
  // }
  // // Login to Discord
  // await client.login(process.env.TOKEN).catch((error: any) => {
  //   logger.error(`During login: ${error.message}`);
  // });
}

run();
