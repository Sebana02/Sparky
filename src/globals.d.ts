import { ILogger } from '@interfaces/logger.interface.js';
import { ILanguageObject } from '@interfaces/language.interface.js';
import { ICommand } from '@interfaces/command.interface.js';
import { IConfig } from '@interfaces/config.interface.js';

declare global {
  var logger: Readonly<ILogger>; // Declare logger as global variable
  var commands: Map<string, ICommand>; // Declare commands as global variable
  var literals: Readonly<ILanguageObject>; // Declare literals as global variable
  var config: Readonly<IConfig>; // Declare config as global variable
}

export {};
