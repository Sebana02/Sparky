import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { ICommand } from '../interfaces/command.interface.js';
import { Collection } from 'discord.js';
import { pathToFileURL } from 'url';

/**
 * Loads commands from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 */
export default async function loadCommands(folderPath: string): Promise<void> {
  // Log the loading of commands
  logger.info('Loading commands...');

  // Initialize the collection of commands
  globalThis.commands = new Collection();

  // If the folder path does not exist, log an error and return
  if (!existsSync(folderPath)) return logger.error(`Could not load commands: ${folderPath} does not exist`);

  // Load commands recursively from the folder path
  const commandPromises = retrieveCommandPromises(folderPath);

  // Wait for all command promises to resolve
  await Promise.allSettled(commandPromises)
    .then((results) => {
      // Log the number of loaded commands
      const loadedCommands = results.filter((result) => result.status === 'fulfilled').length;
      logger.info(`Loaded ${loadedCommands} commands`);
    })
    .catch((error) => logger.error(`Could not load commands: ${error.stack}`));
}

/**
 * Retrieves an array of promises to load commands from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 * @returns {Promise<void>[]} - An array of promises to load the commands.
 */
function retrieveCommandPromises(folderPath: string): Promise<void>[] {
  // Initialize an array of promises, one for each file
  let commandPromises: Promise<void>[] = [];

  //Iterate over the files in the folder
  for (const file of readdirSync(folderPath)) {
    // Resolve the file path
    const filePath = resolve(folderPath, file);

    // If the file is a directory, load commands recursively, otherwise load the command
    statSync(filePath).isDirectory()
      ? commandPromises.push(...retrieveCommandPromises(filePath))
      : commandPromises.push(createCommandPromise(filePath));
  }

  // Return the array of promises
  return commandPromises;
}

/**
 * Creates a promise to load a command from the specified file path.
 * @param {string} filePath - The path of the file containing the command.
 */
async function createCommandPromise(filePath: string): Promise<void> {
  try {
    // Resolve the command file URL
    const commandFileURL = pathToFileURL(filePath);

    // Load the command module
    const commandModule = await import(commandFileURL.href);

    // Parse the command module as an ICommand.
    // If the module exports a default value, use it; otherwise, use the first value in the module.
    const command: ICommand = commandModule.default || Object.values(commandModule)[0];

    // If the command is not valid, throw an error
    if (!isValidCommand(command)) throw new Error(`Invalid command: ${JSON.stringify(command)}`);

    // Add the command to the collection
    globalThis.commands.set(command.name, command);
  } catch (error: any) {
    logger.error(`Could not load command ${filePath}: ${error.stack}`);
    throw error;
  }
}

/**
 * Checks if an object is a valid command.
 * @param {ICommand} command - The object to check.
 * @returns {boolean} - Whether the object is a valid command.
 */
function isValidCommand(command: ICommand): command is ICommand {
  return (
    command.name !== undefined &&
    typeof command.name === 'string' &&
    command.description !== undefined &&
    typeof command.description === 'string' &&
    command.run !== undefined &&
    typeof command.run === 'function'
  );
}
