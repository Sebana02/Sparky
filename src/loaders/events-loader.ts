import { Client } from "discord.js";
import { existsSync, readdirSync, statSync } from "fs";
import { resolve } from "path";
import { useMainPlayer } from "discord-player";
import { readdir } from "fs/promises";
import { pathToFileURL } from "url";
import eventErrorHandler from "../../utils/error-handler/event-error-handler.js";
import { IEvent } from "../interfaces/event.interface.js";

/**
 * Loads events from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the events.
 */
export default async function loadEvents(folderPath: string, client: Client) {
  // Log the loading of events
  logger.info("Loading events...");

  // Events folders
  const eventsFolders = [
    { folder: "process", emitter: process },
    { folder: "client", emitter: client },
    { folder: "music", emitter: useMainPlayer().events },
  ];

  // Initialize the counter of loaded events
  let loadedEvents = 0;

  for (const { folder, emitter } of eventsFolders) {
    // Check if the folder exists
    const eventFolderPath = resolve(folderPath, `./${folder}`);

    if (!existsSync(eventFolderPath))
      logger.error(`Could not load events: ${eventFolderPath} does not exist`);
    else {
      // Load events
      await loadEventsRec(eventFolderPath, emitter, client)
        .then((loaded) => (loadedEvents += loaded))
        .catch((error: any) =>
          logger.error("Could not load events:", error.message)
        );
    }
  }

  // Log the number of loaded events
  logger.info(`Loaded ${loadedEvents} events`);
}

/**
 * Loads events recursively from the specified folder path and binds them to the emitter.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {any} emitter - The event emitter.
 * @param {Client} client - The Discord client.
 * @returns {Promise<number>} The number of loaded events.
 */
async function loadEventsRec(
  folderPath: string,
  emitter: any,
  client: Client
): Promise<number> {
  // Initialize the counter of loaded events
  let loadedEvents = 0;

  //Read the directory
  const dirents = await readdir(folderPath, { withFileTypes: true });

  // For each file or directory in the folder
  for (const dirent of dirents) {
    // Get the absolute path of the file or directory
    const res = resolve(folderPath, dirent.name);

    try {
      // If the file is a directory, load events recursively
      if (dirent.isDirectory()) {
        loadedEvents += await loadEventsRec(res, emitter, client);
      }
      // If the file is a JavaScript file, import the event
      else if (dirent.isFile() && res.endsWith(".js")) {
        // Create a new URL object from the file path
        const eventURL = pathToFileURL(res);

        // Import the event
        const event: IEvent = (await import(eventURL.href)).default;

        // Bind the event to the emitter, using the eventErrorHandler
        emitter.on(event.event, (...args: any[]) =>
          eventErrorHandler(event.event, event.callback, client, ...args)
        );

        // Increment the number of loaded events
        loadedEvents++;
      }
    } catch (error: any) {
      logger.error(`Could not load event ${dirent.name}:`, error.message);
    }
  }

  // Return the number of loaded events
  return loadedEvents;
}
