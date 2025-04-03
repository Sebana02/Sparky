import { Client } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';

/**
 * Event handler for the ready event
 */
export const event: IEvent = {
  event: 'ready',

  emitter: Emitter.Client,

  callback: async (client: Client): Promise<void> => {
    // Perform checks to ensure the client is logged in correctly, if not, exit the bot
    if (!client.user || !client.application || !client.guilds || !client.users) {
      logger.error('Client is not logged in correctly, bot will exit');
      process.exit(1);
    }

    //Set client configuration
    const clientConfig = config.app.clientConfig;
    if (clientConfig) {
      if (clientConfig.setAFK !== undefined) client.user.setAFK(clientConfig.setAFK);
      if (clientConfig.setActivity !== undefined) client.user.setActivity(clientConfig.setActivity);
      if (clientConfig.setAvatar !== undefined) client.user.setAvatar(clientConfig.setAvatar);
      if (clientConfig.setBanner !== undefined) client.user.setBanner(clientConfig.setBanner);
      if (clientConfig.setPresence !== undefined) client.user.setPresence(clientConfig.setPresence);
      if (clientConfig.setStatus !== undefined) client.user.setStatus(clientConfig.setStatus);
      if (clientConfig.setUsername !== undefined) client.user.setUsername(clientConfig.setUsername);
    }

    //Get guild ID from configuration
    const guildId = config.app.guildConfig?.guildId;
    const guild = guildId ? client.guilds.cache.get(guildId) : undefined;

    // Get all commands
    const commandsArray = Array.from(globalThis.commands.values()).map((command) => command.data.toJSON());

    // Register slash commands
    if (!guildId) {
      // Clear existing guild commands
      client.guilds.cache.forEach((guild) => guild.commands.set([]));

      // Register global commands
      await client.application.commands.set(commandsArray);
      logger.info('Slash commands registered globally');
    } else if (guild) {
      // Clear existing global commands
      await client.application.commands.set([]);

      // Register commands in the specified guild
      await guild.commands.set(commandsArray);
      logger.info(`Slash commands registered in guild ${guild.name}`);
    } else {
      logger.error(`Guild with ID ${guildId} not found, slash commands not registered, bot will exit`);
      process.exit(1);
    }

    //Log ready
    logger.info(`Logged in as ${client.user.username}`);
    logger.info(`Ready in a total of ${client.guilds.cache.size} servers for ${client.users.cache.size} users`);
  },
};
