import { Client, Guild } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';

/**
 * Event handler for the ready event
 */
const event: IEvent = {
  event: 'ready',

  /**
   * Callback function for handling the ready event
   * @param {Client} client - The Discord client object
   * @returns {Promise<void>}
   */
  callback: async (client: Client): Promise<void> => {
    // Perform checks to ensure the client is logged in correctly, if not, exit the bot
    if (!client.user || !client.application || !client.guilds || !client.users) {
      logger.error('Client is not logged in correctly, bot will exit');
      process.exit(1);
    }

    //Set activity, if PLAYING_ACTIVITY environment variable is not set, set no activity
    client.user.setActivity(process.env.PLAYING_ACTIVITY || '');

    //Get guild ID from environment variable and get guild object
    const guildId: string | undefined = process.env.GUILD_ID?.trim();
    const guild: Guild | undefined = guildId ? client.guilds.cache.get(guildId) : undefined;

    //Register slash commands
    //If guild ID is not set, register globally
    //If guild ID is set and guild is found, register in that guild
    //If guild ID is set and guild is not found, log error and exit bot
    if (!guildId) {
      await client.application.commands.set(globalThis.commands);
      logger.info('Slash commands registered globally');
    } else if (guild) {
      await guild.commands.set(globalThis.commands);
      logger.info(`Slash commands registered in guild ${guild.name}`);
    } else {
      logger.error(`Guild with ID ${guildId} not found, slash commands not registered, bot will exit`);
      process.exit(1);
    }

    //Log ready
    logger.info(`Logged in as ${client.user.username}`);
    logger.info(
      `Ready in a total of ${client.guilds.cache.size} servers for ${client.users.cache.size} users`
    );
  },
};

export default event;
