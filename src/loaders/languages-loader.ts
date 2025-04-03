import { existsSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { ILanguageObject } from '../interfaces/language.interface.js';
import { readFile } from 'fs/promises';

/**
 * Loads languages from the specified folder path and processes the literals.
 * @param folderPath - The path of the folder containing the languages.
 */
export default async function loadLanguages(folderPath: string): Promise<void> {
  // Log the loading of languages
  logger.info('Loading languages...');

  // Check if the folder exists
  if (!existsSync(folderPath)) return logger.error(`Could not load languages: ${folderPath} does not exist`);

  // Load the selected language
  const selectedLangObj = await loadLanguage(folderPath, config.app.locale);

  // If the selected language is different from the default language, load the default language and merge it
  if (config.app.locale !== config.app.defaultLocale) {
    const defaultLangObj = await loadLanguage(folderPath, config.app.defaultLocale);

    // Merge the selected language with the default language
    Object.entries(defaultLangObj).forEach(([key, value]) => {
      if (!(key in selectedLangObj)) selectedLangObj[key] = value;
    });
  }

  // Check if the merged language object is empty
  if (Object.entries(selectedLangObj).length === 0)
    return logger.error('No literals were loaded. Check the language files.');

  // Assign literals to the global literals object
  globalThis.literals = Object.freeze(selectedLangObj);

  // Log the completion of the processing
  logger.info('Loaded literals');
}

/**
 * Loads the specified language.
 * @param folderPath - The path of the folder containing the language files.
 * @param language - The language to load.
 * @returns The object containing the loaded language files.
 */
async function loadLanguage(folderPath: string, language: string): Promise<ILanguageObject> {
  // Resolve the full path of the language
  const langPath = resolve(folderPath, language);

  // If the language folder does not exist, log an error and return
  if (!existsSync(langPath)) {
    logger.error(`Language folder does not exist: ${langPath}`);
    return {};
  }

  // Retrieve an array of promises to load language files
  const languageFilesPromises = retreiveLanguageFilePromises(langPath);

  // Create an empty language object
  let langObj: ILanguageObject = {};

  // Promise to load the language files
  await Promise.allSettled(languageFilesPromises)
    .then((results) => {
      // Get fulfilled promises
      const loadedFiles = results.filter((result) => result.status === 'fulfilled');

      // Merge the language objects
      loadedFiles.forEach((result) => Object.assign(langObj, result.value));

      // Log the completion of the loading
      logger.info(`Loaded language: ${language}`);
    })
    .catch((error) => logger.error(`Could not load language: ${error.stack}`));

  // Return the language object
  return langObj;
}

/**
 * Retrieves an array of promises to load language files from the specified folder path.
 * @param folderPath - The path of the folder containing the language files.
 * @returns An array of promises to load the language files.
 */
function retreiveLanguageFilePromises(folderPath: string): Promise<ILanguageObject>[] {
  // Initialize an array of promises, one for each file
  let langPromises: Promise<ILanguageObject>[] = [];

  //Iterate over the files in the folder
  for (const file of readdirSync(folderPath)) {
    // Resolve the file path
    const filePath = resolve(folderPath, file);

    // If the file is a directory, load commands recursively, otherwise load the command
    statSync(filePath).isDirectory()
      ? langPromises.push(...retreiveLanguageFilePromises(filePath))
      : langPromises.push(createLanguageFilePromise(filePath));
  }

  // Return the array of promises
  return langPromises;
}

/**
 * Creates a promise to load a language file and process the literals.
 * @param filePath - The path of the language file.
 * @returns A promise to load the language file.
 */
async function createLanguageFilePromise(filePath: string): Promise<ILanguageObject> {
  try {
    // If the file is not a JSON file, return an empty object
    if (!filePath.endsWith('.json')) return {};

    // Read the file and parse the JSON data
    const file = await readFile(filePath, 'utf8');
    const fileData = JSON.parse(file);

    // Create an empty language object
    const langObj: ILanguageObject = {};

    // Process the literals in the file
    processLiterals(langObj, fileData, '');

    // Return the language object
    return langObj;
  } catch (error: any) {
    logger.error(`Failed to load JSON file: ${filePath}: ${error.stack}`);
    throw error;
  }
}
/**
 * Converts an object to a flat ILanguageObject with keys in the format `key1.key2.key3` and transforms strings with placeholders into functions.
 * @param targetObj - The target object to store the flattened structure.
 * @param ourceObj - The source object to flatten.
 * @param prefix - The prefix for each key.
 */
function processLiterals(targetObj: ILanguageObject, sourceObj: { [key: string]: any }, prefix: string): void {
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
 * @param value - The item to process.
 * @returns The processed item.
 */
function processItem(value: any): any {
  // If the value is a string and contains placeholders, convert it to a function
  if (typeof value === 'string' && /{\d+}/.test(value)) {
    return (...args: any[]) =>
      value.replace(/{(\d+)}/g, (_: any, number: number) =>
        args[number] !== undefined ? args[number] : `{${number}}`
      );
  }

  // Return the value as is
  return value;
}
