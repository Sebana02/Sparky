import { ILogger } from './interfaces/logger.interface.js';
import { ILanguageObject } from './interfaces/language.interface.js';
import { ICommand } from './interfaces/command.interface.js';

declare global {
  var logger: ILogger; // Declare logger as global variable
  var commands: Map<string, ICommand>; // Declare commands as global variable
  var literals: ILanguageObject; // Declare literals as global variable
}

export {};
