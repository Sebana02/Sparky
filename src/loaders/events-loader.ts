import { Client } from "discord.js";
import { existsSync, readdirSync, statSync } from "fs";
import { resolve } from "path";
import { useMainPlayer } from "discord-player";
import eventErrorHandler from "../../utils/error-handler/event-error-handler";
import { IEvent } from "../interfaces/event.interface";

/**
 * Loads events from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the events.
 */
export default function loadEvents(folderPath: string, client: Client): void {
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

  eventsFolders.forEach(({ folder, emitter }) => {
    // Resolve event folder path
    const eventFolderPath = resolve(folderPath, `./${folder}`);

    //If it exists, load events
    if (existsSync(eventFolderPath))
      loadedEvents += loadEventsRec(eventFolderPath, emitter, client);
    else
      logger.error(`Could not load events: ${eventFolderPath} does not exist`);
  });

  // Log the number of loaded events
  logger.info(`Loaded ${loadedEvents} events`);
}

/**
 * Loads events recursively from the specified folder path and binds them to the emitter.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {any} emitter - The event emitter.
 * @param {Client} client - The Discord client.
 * @returns {number} The number of loaded events.
 */
function loadEventsRec(
  folderPath: string,
  emitter: any,
  client: Client
): number {
  // Initialize the counter of loaded events
  let loadedEvents = 0;

  // Load events recursively
  readdirSync(folderPath).forEach((file) => {
    try {
      // Resolve the file path
      const filePath = resolve(folderPath, file);

      // Check if the file is a directory, apply recursion
      if (statSync(filePath).isDirectory()) {
        loadedEvents += loadEventsRec(filePath, emitter, client);
      } else {
        // Load the event if it's a JavaScript file
        if (file.endsWith(".js")) {
          // Load the event
          const event: IEvent = require(file).default;

          // Set the event in the collection
          emitter.on(event.event, (...args: [any, ...any[]]) =>
            eventErrorHandler(event.event, event.callback, client, ...args)
          );
        } else logger.warn(`Skipping non-JavaScript file: ${file}`);
      }
    } catch (error: any) {
      logger.error(`Could not load event ${file}:`, error.message);
    }
  });

  // Return the number of loaded events
  return loadedEvents;
}
