import { ILogger } from "./interfaces/logger.interface";
import { ICommand } from "./interfaces/commands.interface";
import { ILanguageObject } from "./interfaces/language.interface";
import { Collection } from "discord.js";

declare global {
  var logger: ILogger; // Declare logger as global variable
  var commands: Collection; // Declare commands as global variable
  var literals: ILanguageObject; // Declare literals as global variable
}

export {};
