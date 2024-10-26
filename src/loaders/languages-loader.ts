import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, resolve } from "path";
import { ILanguageObject } from "../interfaces/language.interface";

/**
 * Loads languages from the specified folder path and processes the literals.
 * @param {string} folderPath - The path of the folder containing the languages.
 */
export default function loadLanguages(folderPath: string): void {
  // Log the loading of languages
  logger.info("Loading languages...");

  // Check if the folder exists
  if (!existsSync(folderPath)) {
    return logger.error(
      `Could not load languages: ${folderPath} does not exist`
    );
  }

  // Default language, 'en', is used if the LANG environment variable is not set
  const defaultLanguage = "en";
  const selectedLanguage = process.env.LANGUAGE || defaultLanguage;

  // Object to store the merged literals
  let mergedLangObj: ILanguageObject;

  // Load the selected language and merge with the default language if necessary
  const selectedLangObj = loadLanguage(folderPath, selectedLanguage);
  const defaultLangObj = loadLanguage(folderPath, defaultLanguage);

  if (!selectedLangObj || Object.entries(selectedLangObj).length === 0) {
    logger.warn(
      `Selected language object is empty for language: ${selectedLanguage}. Falling back to default.`
    );
    mergedLangObj = defaultLangObj;
  } else {
    mergedLangObj = deepMerge(selectedLangObj, defaultLangObj);
  }

  // Check if the merged language object was loaded successfully
  if (!mergedLangObj || Object.entries(mergedLangObj).length === 0) {
    return logger.error(
      "Could not load any language; no literals will be available"
    );
  }

  // Log the processing of literals
  logger.info("Processing literals...");

  // Process the literals and assign them to the global literals object
  globalThis.literals = processLiterals(mergedLangObj);

  // Log the completion of the processing
  logger.info("Loaded literals");
}

/**
 * Loads the specified language.
 * @param {string} folderPath - The path of the folder containing the language files.
 * @param {string} language - The language to load.
 * @returns {ILanguageObject} The object containing the loaded language files.
 */
function loadLanguage(folderPath: string, language: string): ILanguageObject {
  const langPath = resolve(__dirname, folderPath, language);
  if (!existsSync(langPath)) {
    logger.error(`Language folder does not exist: ${langPath}`);
    return {};
  }

  // Load language files and log the loaded language
  const langObj = loadLanguageFilesRecursively(langPath);
  logger.info(`Loaded language: ${language}`);
  return langObj;
}

/**
 * Loads language files (JSON) recursively from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the language files.
 * @returns {ILanguageObject} An object containing the loaded language files, following the folder structure.
 */
function loadLanguageFilesRecursively(folderPath: string): ILanguageObject {
  const langObj: ILanguageObject = {};

  readdirSync(folderPath).forEach((file) => {
    try {
      const fullPath = resolve(folderPath, file);
      if (statSync(fullPath).isDirectory()) {
        langObj[file] = loadLanguageFilesRecursively(fullPath);
      } else if (file.endsWith(".json")) {
        const content = JSON.parse(readFileSync(fullPath, "utf-8"));
        langObj[basename(file, ".json")] = convertToLanguageObject(content);
      } else {
        logger.warn(`Skipping non-JSON file: ${file}`);
      }
    } catch (error: any) {
      logger.warn(`Failed to load JSON file: ${file}. Error: ${error.message}`);
    }
  });

  return langObj;
}

/**
 * Converts an object to an ILanguageObject by recursively processing its properties.
 * @param {object} obj - The object to convert.
 * @returns {ILanguageObject} - The converted object.
 */
function convertToLanguageObject(obj: { [key: string]: any }): ILanguageObject {
  const result: ILanguageObject = {};

  for (const key in obj) {
    const value = obj[key];

    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "object" && item !== null
          ? convertToLanguageObject(item)
          : item
      );
    } else if (typeof value === "object") {
      result[key] = convertToLanguageObject(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Deep merges two ILanguageObject instances.
 * @param {ILanguageObject} target - The target object to merge properties into.
 * @param {ILanguageObject} source - The source object from which properties are taken.
 * @returns {ILanguageObject} - The merged object.
 */
export function deepMerge(
  target: ILanguageObject,
  source: ILanguageObject
): ILanguageObject {
  const isObject = (item: any): boolean =>
    item && typeof item === "object" && !Array.isArray(item);

  for (const key in source) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isObject(sourceValue)) {
      target[key] = isObject(targetValue)
        ? deepMerge(
            targetValue as ILanguageObject,
            sourceValue as ILanguageObject
          )
        : sourceValue;
    } else if (Array.isArray(sourceValue)) {
      if (!(key in target)) {
        target[key] = sourceValue;
      }
    } else {
      if (!(key in target)) {
        target[key] = sourceValue;
      }
    }
  }

  return target;
}

/**
 * Recursively processes each literal in the object, turning dynamic literals into functions.
 * @param {ILanguageObject} langObj - The object containing literals.
 * @returns {ILanguageObject} The processed object with static and dynamic literals.
 */
function processLiterals(langObj: ILanguageObject): ILanguageObject {
  for (const key in langObj) {
    const value = langObj[key];

    if (typeof value === "string" && /{\d+}/.test(value)) {
      langObj[key] = (...args: any[]) =>
        value.replace(/{(\d+)}/g, (_, number) => args[number] || `{${number}}`);
    } else if (Array.isArray(value)) {
      langObj[key] = value.map((item) =>
        typeof item === "string" && /{\d+}/.test(item)
          ? (...args: any[]) =>
              item.replace(
                /{(\d+)}/g,
                (_, number) => args[number] || `{${number}}`
              )
          : typeof item === "object" && item !== null
          ? processLiterals(item as ILanguageObject)
          : item
      );
    } else if (typeof value === "object" && value !== null) {
      langObj[key] = processLiterals(value as ILanguageObject);
    }
  }

  return langObj;
}
