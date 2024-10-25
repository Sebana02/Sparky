import { ILogger } from "./src/interfaces/logger.interface.js";
import { ICommand } from "./src/interfaces/commands.interface.js";
import { ILanguageObject } from "./src/interfaces/language.interface.js";

declare global {
  var logger: ILogger; // Declare logger as global variable
  var commands: Map<string, ICommand>; // Declare commands as global variable
  var literals: ILanguageObject; // Declare literals as global variable
}

export {};
