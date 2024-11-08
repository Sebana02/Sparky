import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { ICommand } from '../interfaces/command.interface.js';
import { Collection, SlashCommandBuilder } from 'discord.js';
import { pathToFileURL } from 'url';

/**
 * Loads commands from the specified folder path.
 * @param folderPath - The path of the folder containing the commands.
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
 * @param  folderPath - The path of the folder containing the commands.
 * @returns  An array of promises to load the commands.
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
 * @param filePath - The path of the file containing the command.
 */
async function createCommandPromise(filePath: string): Promise<void> {
  try {
    // Resolve the command file URL
    const commandFileURL = pathToFileURL(filePath);

    // Load the command module
    const commandModule = await import(commandFileURL.href);

    // Get the values of the required module
    const moduleValues = Object.values(commandModule);

    // Try to parse the command module as an ICommand.
    const command: ICommand | undefined = moduleValues.find(isCommand);

    // If the command is not valid, throw an error
    if (!command) throw new Error(`Invalid command: ${JSON.stringify(commandModule)}`);

    // Execute any functions in the module that do not require arguments
    // This is useful for executing initialization code in the command module
    moduleValues.forEach(async (value) => {
      if (typeof value === 'function' && value.length === 0) await value();
    });

    // Add the command to the collection
    globalThis.commands.set(command.data.name, command);
  } catch (error: any) {
    logger.error(`Could not load command ${filePath}: ${error.stack}`);
    throw error;
  }
}

/**
 * Checks if an object is a valid command.
 * @param command - The object to check.
 * @returns Whether the object is a valid command.
 */
function isCommand(command: any): command is ICommand {
  return (
    command.data !== undefined &&
    command.data instanceof SlashCommandBuilder &&
    command.data.name !== undefined &&
    typeof command.data.name === 'string' &&
    command.data.description !== undefined &&
    typeof command.data.description === 'string' &&
    command.execute !== undefined &&
    typeof command.execute === 'function'
  );
}
