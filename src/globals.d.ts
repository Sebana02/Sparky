import { ILogger } from "./interfaces/logger.interface";
import { ICommand } from "./interfaces/commands.interface";
import { ILanguageObject } from "./interfaces/language.interface";

declare global {
  var logger: ILogger; // Declare logger as global variable
  var commands: Map<string, ICommand>; // Declare commands as global variable
  var literals: ILanguageObject; // Declare literals as global variable
}

export {};
