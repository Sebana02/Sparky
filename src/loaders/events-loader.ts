import { Client } from 'discord.js';
import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { useMainPlayer } from 'discord-player';
import { IEvent } from '../interfaces/event.interface.js';
import { pathToFileURL } from 'url';
import { eventErrorHandler } from '../utils/error-handler.js';

/**
 * Loads events from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {Client} client - The Discord client.
 */
export default async function loadEvents(folderPath: string, client: Client): Promise<void> {
  // Log the loading of events
  logger.info('Loading events...');

  // Events folders
  const eventsFolders = [
    { folder: 'process', emitter: process },
    { folder: 'client', emitter: client },
    { folder: 'music', emitter: useMainPlayer().events },
  ];

  // Array of promises to load events
  let eventPromises: Promise<void>[] = [];

  // Push promises to load events from each folder
  eventsFolders.forEach(({ folder, emitter }) => {
    // Resolve event folder path
    const eventFolderPath = resolve(folderPath, `./${folder}`);

    // If the folder path does not exist, log an error and return
    if (!existsSync(eventFolderPath)) return logger.error(`Could not load events: ${eventFolderPath} does not exist`);

    // Load events recursively from the folder path
    eventPromises.push(...retrieveEventPromises(eventFolderPath, emitter, client));
  });

  // Wait for all event promises to resolve
  await Promise.allSettled(eventPromises)
    .then((results) => {
      const loadedEvents = results.filter((result) => result.status === 'fulfilled').length;
      logger.info(`Loaded ${loadedEvents} events`);
    })
    .catch((error) => logger.error(`Could not load events: ${error.stack}`));
}

/**
 * Retrieves an array of promises to load events from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {any} emitter - The event emitter.
 * @param {Client} client - The Discord client.
 * @returns {Promise<void>[]} - An array of promises to load the events.
 */
function retrieveEventPromises(folderPath: string, emitter: any, client: Client): Promise<void>[] {
  // Initialize an array of promises, one for each file
  let eventPromises: Promise<void>[] = [];

  //Iterate over the files in the folder
  for (const file of readdirSync(folderPath)) {
    // Resolve the file path
    const filePath = resolve(folderPath, file);

    // If the file is a directory, load commands recursively, otherwise load the command
    statSync(filePath).isDirectory()
      ? eventPromises.push(...retrieveEventPromises(filePath, emitter, client))
      : eventPromises.push(createEventPromise(filePath, emitter, client));
  }

  // Return the array of promises
  return eventPromises;
}

/**
 * Creates a promise to load an event from the specified file path.
 * @param {string} filePath - The path of the file containing the event.
 * @param {any} emitter - The event emitter.
 * @param {Client} client - The Discord client.
 */
async function createEventPromise(filePath: string, emitter: any, client: Client): Promise<void> {
  try {
    // Resolve the command file URL
    const eventFileURL = pathToFileURL(filePath);

    // Load the command module
    const eventModule = await import(eventFileURL.href);

    // Get the values of the required module
    const moduleValues = Object.values(eventModule);

    // Try to parse the command module as an IEvent.
    const event: IEvent | undefined = moduleValues.find(isEvent);

    // If the event is not valid, throw an error
    if (!event) throw new Error(`Invalid event: ${JSON.stringify(event)}`);

    // Execute any functions in the module that do not require arguments
    // This is useful for executing initialization code in the command module
    moduleValues.forEach(async (value) => {
      if (typeof value === 'function' && value.length === 0) await value();
    });

    // Register the event to the emitter
    emitter.on(event.event, (...args: any[]) => eventErrorHandler(event.event, event.callback, client, ...args));
  } catch (error: any) {
    logger.error(`Could not load event ${filePath}: ${error.stack}`);
    throw error;
  }
}

/**
 * Checks if an object is a valid event.
 * @param {any} event - The object to check.
 * @returns {boolean} - Whether the object is a valid command.
 */
function isEvent(event: any): event is IEvent {
  return (
    event.event !== undefined &&
    typeof event.event === 'string' &&
    event.callback !== undefined &&
    typeof event.callback === 'function'
  );
}
