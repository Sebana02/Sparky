import { ILogger } from './interfaces/logger.interface.js';
import { ILanguageObject } from './interfaces/language.interface.js';
import { Collection } from 'discord.js';

declare global {
  var logger: ILogger; // Declare logger as global variable
  var commands: Collection; // Declare commands as global variable
  var literals: ILanguageObject; // Declare literals as global variable
}

export {};
