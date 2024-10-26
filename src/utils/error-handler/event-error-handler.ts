import { Client } from "discord.js";

/**
 * Handles errors in event callbacks.
 * @param eventName - The name of the event.
 * @param eventCallback - The event callback function.
 * @param client - The Discord client.
 * @param args - Additional arguments for the event callback.
 */
export default async function eventErrorHandler(
  eventName: string,
  eventCallback: (client: Client, ...args: any[]) => Promise<void>,
  client: Client,
  ...args: any[]
): Promise<void> {
  try {
    await eventCallback(client, ...args);
  } catch (error: any) {
    logger.error(`An error occurred in event "${eventName}":\n`, error.stack);
  }
}
