import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { basename, resolve } from 'path';
import { ILanguageObject } from '../interfaces/language.interface.js';

/**
 * Loads languages from the specified folder path and processes the literals.
 * @param {string} folderPath - The path of the folder containing the languages.
 */
export default function loadLanguages(folderPath: string): void {
  // Log the loading of languages
  logger.info('Loading languages...');

  // Check if the folder exists
  if (!existsSync(folderPath)) return logger.error(`Could not load languages: ${folderPath} does not exist`);

  // Default language, 'en', is used if the LANG environment variable is not set
  const defaultLanguage = 'en_US';
  const selectedLanguage = process.env.LANGUAGE || defaultLanguage;

  // Load the selected language and merge with the default language if necessary
  const selectedLangObj = loadLanguage(folderPath, selectedLanguage);
  const defaultLangObj = loadLanguage(folderPath, defaultLanguage);

  // Merge the selected language with the default language
  Object.entries(defaultLangObj).forEach(([key, value]) => {
    if (!(key in selectedLangObj)) selectedLangObj[key] = value;
  });

  // Check if the merged language object is empty
  if (Object.entries(selectedLangObj).length === 0)
    return logger.error('No literals were loaded. Check the language files.');

  // Assign literals to the global literals object
  globalThis.literals = selectedLangObj;

  console.log(globalThis.literals);

  // Log the completion of the processing
  logger.info('Loaded literals');
}

/**
 * Loads the specified language.
 * @param {string} folderPath - The path of the folder containing the language files.
 * @param {string} language - The language to load.
 * @returns {ILanguageObject} The object containing the loaded language files.
 */
function loadLanguage(folderPath: string, language: string): ILanguageObject {
  // Resolve the full path of the language
  const langPath = resolve(folderPath, language);

  // If the language folder does not exist, log an error and return
  if (!existsSync(langPath)) {
    logger.error(`Language folder does not exist: ${langPath}`);
    return {};
  }

  // Load language files and log the loaded language
  const langObj = loadLanguageFiles(langPath);
  logger.info(`Loaded language: ${language}`);

  // Return the language object
  return langObj;
}

/**
 * Loads language files (JSON) recursively from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the language files.
 * @returns {ILanguageObject} An object containing the loaded language files, following the folder structure.
 */
function loadLanguageFiles(folderPath: string): ILanguageObject {
  // Create an empty language object
  const langObj: ILanguageObject = {};

  // Iterate over each file in the folder
  for (const file of readdirSync(folderPath)) {
    try {
      // Resolve the full path of the file
      const fullPath = resolve(folderPath, file);

      // If the file is a directory, load the language files recursively, else process the JSON file as a new key
      if (statSync(fullPath).isDirectory()) {
        Object.assign(langObj, loadLanguageFiles(fullPath));
      } else if (file.endsWith('.json')) {
        const fileData = JSON.parse(readFileSync(fullPath, 'utf-8'));
        processLiterals(langObj, fileData, '');
      }
    } catch (error: any) {
      logger.warn(`Failed to load JSON file: ${file}: ${error.stack}`);
    }
  }

  // Return the language object
  return langObj;
}

/**
 * Converts an object to a flat ILanguageObject with keys in the format `key1.key2.key3` and transforms strings with placeholders into functions.
 * @param {ILanguageObject} targetObj - The target object to store the flattened structure.
 * @param {object} sourceObj - The source object to flatten.
 * @param {string} prefix - The prefix for each key.
 */
function processLiterals(
  targetObj: ILanguageObject,
  sourceObj: { [key: string]: any },
  prefix: string
): void {
  // Iterate over each key in the source object
  for (const key in sourceObj) {
    // Get the full key and value of the current key
    const fullKey = prefix.trim() !== '' ? `${prefix}.${key}` : key;
    const value = sourceObj[key];

    // Process the value based on its type
    if (Array.isArray(value)) {
      targetObj[fullKey] = value.map((item) =>
        typeof item === 'object' && item !== null ? processLiterals({}, item, fullKey) : processItem(item)
      );
    } else if (typeof value === 'object' && value !== null) {
      processLiterals(targetObj, value, fullKey);
    } else {
      targetObj[fullKey] = processItem(value);
    }
  }
}

/**
 * Processes an item, converting it to a function if it is a string and contains placeholders.
 * @param {any} value - The item to process.
 * @returns {any} The processed item.
 */
function processItem(value: any): any {
  // If the value is a string and contains placeholders, convert it to a function
  if (typeof value === 'string' && /{\d+}/.test(value)) {
    return (...args: any[]) =>
      value.replace(/{(\d+)}/g, (_: any, number: number) => args[number] || `{${number}}`);
  }

  // Return the value as is
  return value;
}
