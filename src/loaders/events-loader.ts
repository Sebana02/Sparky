import { Client } from 'discord.js';
import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { GuildQueueEvent, useMainPlayer } from 'discord-player';
import { IEvent, Emitter } from '../interfaces/event.interface.js';
import { pathToFileURL } from 'url';
import { eventErrorHandler } from '../utils/error-handler.js';

/**
 * Loads events from the specified folder path.
 * @param folderPath - The path of the folder containing the events.
 * @param client - The Discord client.
 */
export default async function loadEvents(folderPath: string, client: Client): Promise<void> {
  // Log the loading of events
  logger.info('Loading events...');

  // If the folder path does not exist, log an error and return
  if (!existsSync(folderPath)) return logger.error(`Could not load events: ${folderPath} does not exist`);

  // Array of promises to load events
  let eventPromises = retrieveEventPromises(folderPath, client);

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
 * @param folderPath - The path of the folder containing the events.
 * @param client - The Discord client.
 * @returns  An array of promises to load the events.
 */
function retrieveEventPromises(folderPath: string, client: Client): Promise<void>[] {
  // Initialize an array of promises, one for each file
  let eventPromises: Promise<void>[] = [];

  //Iterate over the files in the folder
  for (const file of readdirSync(folderPath)) {
    // Resolve the file path
    const filePath = resolve(folderPath, file);

    // If the file is a directory, load commands recursively, otherwise load the command
    statSync(filePath).isDirectory()
      ? eventPromises.push(...retrieveEventPromises(filePath, client))
      : eventPromises.push(createEventPromise(filePath, client));
  }

  // Return the array of promises
  return eventPromises;
}

/**
 * Creates a promise to load an event from the specified file path.
 * @param filePath - The path of the file containing the event.
 * @param client - The Discord client.
 */
async function createEventPromise(filePath: string, client: Client): Promise<void> {
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

    // Create an event callback that handles errors
    const eventCallback = (...args: any[]) => eventErrorHandler(event.event, event.callback, client, ...args);

    // Register the event to the emitter
    switch (event.emitter) {
      case Emitter.Client:
        client.on(event.event, eventCallback);
        break;
      case Emitter.Process:
        process.on(event.event, eventCallback);
        break;
      case Emitter.Player:
        useMainPlayer().events.on(event.event as GuildQueueEvent, eventCallback);
        break;
      default:
        throw new Error(`Invalid emitter: ${event.emitter}`);
    }
  } catch (error: any) {
    logger.error(`Could not load event ${filePath}: ${error.stack}`);
    throw error;
  }
}

/**
 * Checks if an object is a valid event.
 * @param event - The object to check.
 * @returns Whether the object is a valid command.
 */
function isEvent(event: any): event is IEvent {
  return (
    event.event !== undefined &&
    typeof event.event === 'string' &&
    event.emitter !== undefined &&
    Object.values(Emitter).includes(event.emitter) &&
    event.callback !== undefined &&
    typeof event.callback === 'function'
  );
}
