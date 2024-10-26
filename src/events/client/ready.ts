import { Client } from "discord.js";
import { IEvent } from "../../interfaces/event.interface";

/**
 * Event handler for the ready event
 */
const event: IEvent = {
  event: "ready",

  /**
   * Callback function for handling the ready event
   * @param {Client} client - The Discord client object
   * @returns {Promise<void>}
   */
  callback: async (client: Client): Promise<void> => {
    //Set activity, if PLAYING_ACTIVITY environment variable is not set, set no activity
    client.user?.setActivity(process.env.PLAYING_ACTIVITY || "");

    //Register slash commands. if GUILD_ID environment variable is not set, register commands globally
    if (!process.env.GUILD_ID || process.env.GUILD_ID.trim() === "")
      await client.application?.commands.set(globalThis.commands);
    else {
      const guild = client.guilds?.cache.get(process.env.GUILD_ID);

      if (!guild)
        logger.error(
          "Guild with the specified GUILD_ID not found, slash commands will not be registered"
        );
      else await guild.commands.set(globalThis.commands);
    }

    //Log ready
    logger.info(`Logged in as ${client.user?.username}`);
    logger.info(
      `Ready in a total of ${client.guilds?.cache.size} servers for ${client.users?.cache.size} users`
    );
  },
};

export default event;
