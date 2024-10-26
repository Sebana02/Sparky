import { Client } from "discord.js";
import { IEvent } from "../../interfaces/event.interface";

/**
 * Event when user presses CTRL+C (SIGINT)
 * Disconnects the bot and exits the process
 */
const event: IEvent = {
  event: "SIGINT",
  /**
   * Callback function for the SIGINT event
   * @param {Client} client - The Discord client object
   * @returns {Promise<void>}
   * */
  callback: async (client: Client): Promise<void> => {
    logger.info("Bot received SIGINT signal, disconnecting...");

    //Disconnect the bot and exit the process
    await client.destroy();
    process.exit(0);
  },
};

export default event;
