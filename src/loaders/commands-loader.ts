import { existsSync, readdirSync, statSync } from "fs";
import { resolve } from "path";
import { ICommand } from "../interfaces/command.interface";
import { Collection } from "discord.js";

/**
 * Loads commands from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 */
export default function loadCommands(folderPath: string): void {
  // Log the loading of commands
  logger.info("Loading commands...");

  // Initialize the collection of commands
  globalThis.commands = new Collection();

  // If the folder exists, load commands
  if (existsSync(folderPath)) {
    loadCommandsRec(folderPath);
  } else {
    logger.error(`Could not load commands: ${folderPath} does not exist`);
  }

  // Log the number of loaded commands
  logger.info(`Loaded ${globalThis.commands.size} commands`);
}

/**
 * Loads commands recursively from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 */
function loadCommandsRec(folderPath: string): void {
  // Load commands recursively
  readdirSync(folderPath).forEach((file) => {
    try {
      // Resolve the file path
      const filePath = resolve(folderPath, file);

      // Check if the file is a directory, apply recursion
      if (statSync(filePath).isDirectory()) {
        loadCommandsRec(filePath);
      } else if (file.endsWith(".js")) {
        // Load the command
        const command: ICommand = require(filePath).default;

        // Set the command in the collection
        globalThis.commands.set(command.name, command);
      }
    } catch (error: any) {
      logger.error(`Could not load command ${file}: ${error.message}`);
    }
  });
}
