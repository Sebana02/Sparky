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
  const mergedLangObj = deepMerge(selectedLangObj, defaultLangObj);

  // Check if the merged language object is empty
  if (Object.entries(mergedLangObj).length === 0)
    return logger.error('No literals were loaded. Check the language files.');

  // Log the processing of literals
  logger.info('Processing literals...');

  // Process the literals and assign them to the global literals object
  globalThis.literals = processLiterals(mergedLangObj);

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
  //Object to store the language literals
  const langObj: ILanguageObject = {};

  // Iterate over the files in the folder
  for (const file of readdirSync(folderPath)) {
    try {
      // Resolve the full path of the file
      const fullPath = resolve(folderPath, file);

      // If the file is a directory, load language files recursively, otherwise load the language file
      statSync(fullPath).isDirectory()
        ? (langObj[file] = loadLanguageFiles(fullPath))
        : file.endsWith('.json')
          ? (langObj[basename(file, '.json')] = convertToLanguageObject(
              JSON.parse(readFileSync(fullPath, 'utf-8'))
            ))
          : null;
    } catch (error: any) {
      logger.warn(`Failed to load JSON file: ${file}: ${error.stack}`);
    }
  }

  // Return the language object
  return langObj;
}

/**
 * Converts an object to an ILanguageObject by recursively processing its properties.
 * @param {object} obj - The object to convert.
 * @returns {ILanguageObject} - The converted object.
 */
function convertToLanguageObject(obj: { [key: string]: any }): ILanguageObject {
  // Object to store the converted object
  const result: ILanguageObject = {};

  // Iterate over the object properties
  for (const key in obj) {
    // Get the value of the property
    const value = obj[key];

    // Process the value based on its type
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' && item !== null ? convertToLanguageObject(item) : item
      );
    } else if (typeof value === 'object') {
      result[key] = convertToLanguageObject(value);
    } else {
      result[key] = value;
    }
  }

  // Return the converted object
  return result;
}

/**
 * Deep merges two ILanguageObject instances.
 * @param {ILanguageObject} target - The target object to merge properties into.
 * @param {ILanguageObject} source - The source object from which properties are taken.
 * @returns {ILanguageObject} - The merged object.
 */
export function deepMerge(target: ILanguageObject, source: ILanguageObject): ILanguageObject {
  // Check if the source is an object, not an array
  const isObject = (item: any): boolean => item && typeof item === 'object' && !Array.isArray(item);

  // Iterate over the source properties
  for (const key in source) {
    // Get the target and source values
    const targetValue = target[key];
    const sourceValue = source[key];

    // Process the source value based on its type
    if (isObject(sourceValue)) {
      target[key] = isObject(targetValue)
        ? deepMerge(targetValue as ILanguageObject, sourceValue as ILanguageObject)
        : sourceValue;
    } else if (!(key in target)) {
      target[key] = sourceValue;
    }
  }

  // Return the merged object
  return target;
}

/**
 * Recursively processes each literal in the object, turning dynamic literals into functions.
 * @param {ILanguageObject} langObj - The object containing literals.
 * @returns {ILanguageObject} The processed object with static and dynamic literals.
 */
function processLiterals(langObj: ILanguageObject): ILanguageObject {
  // Function to process dynamic literals
  const dynamicLitFunc = (value: string, ...args: any[]) =>
    value.replace(/{(\d+)}/g, (_, number) => args[number] || `{${number}}`);

  // Iterate over the object properties
  for (const key in langObj) {
    // Get the value of the property
    const value = langObj[key];

    // Process the value based on its type
    if (typeof value === 'string' && /{\d+}/.test(value)) {
      langObj[key] = dynamicLitFunc.bind(null, value);
    } else if (Array.isArray(value)) {
      langObj[key] = value.map((item) =>
        typeof item === 'string' && /{\d+}/.test(item)
          ? dynamicLitFunc.bind(null, item)
          : typeof item === 'object' && item !== null
            ? processLiterals(item as ILanguageObject)
            : item
      );
    } else if (typeof value === 'object' && value !== null) {
      langObj[key] = processLiterals(value as ILanguageObject);
    }
  }

  // Return the processed object
  return langObj;
}
