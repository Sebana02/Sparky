import { readdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { ICommand } from "../interfaces/command.interface.js";

/**
 * Loads commands from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 */
export default async function loadCommands(folderPath: string) {
  // Log the loading of commands
  logger.info("Loading commands...");

  // Initialize the collection of commands
  globalThis.commands = new Map<string, ICommand>();

  //Check if the folder exists
  if (!existsSync(folderPath))
    return logger.error(
      `Could not load commands: ${folderPath} does not exist`
    );

  // Load commands
  await loadCommandsRec(folderPath).catch((error: any) =>
    logger.error("Could not load commands:", error.message)
  );

  // Log the number of loaded commands
  logger.info(`Loaded ${commands.size} commands`);
}

/**
 * Loads commands recursively from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 */
async function loadCommandsRec(folderPath: string): Promise<void> {
  // Read the directory
  const dirents = await readdir(folderPath, { withFileTypes: true });

  // For each file or directory in the folder
  for (const dirent of dirents) {
    // Get the absolute path of the file or directory
    const res = resolve(folderPath, dirent.name);

    try {
      // If the file is a directory, load commands recursively
      if (dirent.isDirectory()) {
        await loadCommandsRec(res);
      }
      // If the file is a JavaScript file, import the command
      else if (dirent.isFile() && res.endsWith(".js")) {
        // Create a new URL object from the file path
        const commandURL = pathToFileURL(res);

        // Import the command
        const command: ICommand = (await import(commandURL.href)).default;

        // Add the command to the collection
        commands.set(command.name, command);
      }
    } catch (error: any) {
      logger.error(`Could not load command ${res}:`, error.message);
    }
  }
}
