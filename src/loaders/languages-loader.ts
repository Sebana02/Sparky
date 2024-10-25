import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { basename, resolve } from "path";
import { ILanguageObject } from "../interfaces/language.interface";
/**
 * Loads language from the specified folder path and process the literals.
 * @param {string} folderPath - The path of the folder containing the languages.
 */
export default function loadLanguages(folderPath: string): void {
  // Log the loading of languages
  logger.info("Loading languages...");

  // Check if the folder exists
  if (!existsSync(folderPath))
    return logger.error(
      `Could not load languages: ${folderPath} does not exist`
    );

  // Default language, en, is used if the LANG environment variable is not set
  const defaultLanguage = "en";
  const language = process.env.LANGUAGE || defaultLanguage;

  // Object to store the literals
  let mergedLangObj: ILanguageObject;

  // If selected language is default, process it directly
  if (language === defaultLanguage) {
    mergedLangObj = loadLanguage(folderPath, language);
  } else {
    // Load the selected language and merge it with the default language if needed
    const languageObj: ILanguageObject = loadLanguage(folderPath, language);
    const defaultLangObj: ILanguageObject = loadLanguage(
      folderPath,
      defaultLanguage
    );

    if (!languageObj || Object.entries(language).length === 0)
      mergedLangObj = defaultLangObj;
    else mergedLangObj = mergeLangObj(languageObj, defaultLangObj);
  }

  //   // Check if the language object was loaded
  if (!mergedLangObj || Object.entries(mergedLangObj).length === 0)
    return logger.error(
      `Could not load any language, no literals will be available`
    );

  // Log the processing of literals
  logger.info(`Processing literals...`);

  // Process the literals and assign them to the process object
  globalThis.literals = processLiterals(mergedLangObj);

  // Log the completion of the processing
  logger.info(`Loaded literals`);
}

/**
 * Loads the specified language
 * @param {string} language - The language to load.
 * @returns {ILanguageObject} The object containing the loaded language files.
 **/
function loadLanguage(folderPath: string, language: string): ILanguageObject {
  let langObj: ILanguageObject = {};

  // Check if the language folder exists
  const langPath = resolve(__dirname, folderPath, language);
  if (!existsSync(langPath)) {
    logger.error(`Language folder does not exist: ${langPath}`);
  } else {
    // Load language files
    langObj = loadLanguageFiles(langPath);

    // Log the loaded language
    logger.info(`Loaded language: ${language}`);
  }

  // Return the language object
  return langObj;
}

/**
 * Loads language files (json) recursively from the specified folder path.
 * @param {String} folderPath - The path of the folder containing the language files.
 * @returns {Promise<ILanguageObject>}  An object containing the loaded language files, following the folder structure.
 */
function loadLanguageFiles(folderPath: string): ILanguageObject {
  // Initialize the result object
  const langObj: ILanguageObject = {};

  // Read the contents of the directory
  readdirSync(folderPath).forEach((file) => {
    try {
      // Get the full path of the file
      const fullPath = resolve(folderPath, file);

      // If it's a directory, recursively load its files
      if (statSync(fullPath).isDirectory()) {
        langObj[file] = loadLanguageFiles(fullPath);
      } else {
        // Load the JSON file
        if (file.endsWith(".json")) {
          // Read and parse the JSON file
          const content = JSON.parse(readFileSync(fullPath, "utf-8"));

          // Assign to the result object with the file name without extension
          langObj[basename(file, ".json")] = content;
        } else logger.warn(`Skipping non-JSON file: ${file}`);
      }
    } catch (error: any) {
      logger.warn(`Failed to load JSON file: ${file}`, error.message);
    }
  });

  return langObj;
}

/**
 * Merge the fetched object from the selected language with the default language object recursively.
 * The default language values will be used if they don't exist in the selected language.
 * @param {ILanguageObject} selectedLangObj - The object from the selected language.
 * @param {ILanguageObject} defaultLangObj - The object from the default language.
 * @returns {object} - The merged object with fallbacks from the default language.
 */
function mergeLangObj(
  selectedLangObj: ILanguageObject,
  defaultLangObj: ILanguageObject
): ILanguageObject {
  if (!selectedLangObj || Object.entries(selectedLangObj).length === 0)
    return defaultLangObj;
  if (!defaultLangObj || Object.entries(defaultLangObj).length === 0)
    return selectedLangObj;

  // Create a new object to store the merged result
  const mergedObj: ILanguageObject = {};

  // Iterate over the keys in defaultLangObj to merge properties recursively
  for (const key in defaultLangObj) {
    if (defaultLangObj.hasOwnProperty(key)) {
      // If both selected and default are objects, merge recursively
      if (
        typeof selectedLangObj[key] === "object" &&
        typeof defaultLangObj[key] === "object"
      ) {
        mergedObj[key] = mergeLangObj(
          selectedLangObj[key] as ILanguageObject,
          defaultLangObj[key] as ILanguageObject
        );
      } else {
        // Log a warning if the key only exists in the default language
        if (!selectedLangObj.hasOwnProperty(key)) {
          logger.warn(
            `Literal '${key}' not found in selected language, using default language value`
          );
        }

        // Use selectedLangObj value if it exists, otherwise use defaultLangObj value
        mergedObj[key] = selectedLangObj.hasOwnProperty(key)
          ? selectedLangObj[key]
          : defaultLangObj[key];
      }
    }
  }

  // Add keys that only exist in selectedLangObj
  for (const key in selectedLangObj) {
    if (!mergedObj.hasOwnProperty(key)) {
      mergedObj[key] = selectedLangObj[key];
    }
  }

  return mergedObj;
}

/**
 * Recursively processes each literal in the object, turning dynamic literals into functions.
 * @param {ILanguageObject} langObj - The object containing literals.
 * @returns {ILanguageObject} The processed object with static and dynamic literals.
 */
function processLiterals(langObj: ILanguageObject): ILanguageObject {
  // For every entry in language object
  for (const [key, value] of Object.entries(langObj)) {
    // If entry is another language object, apply recursion
    if (typeof value === "object" && value !== null) {
      langObj[key] = processLiterals(value as ILanguageObject);
    }
    // If it is a dynamically formatted string
    else if (typeof value === "string" && /{\d+}/.test(value)) {
      langObj[key] = (...args: any[]) =>
        value.replace(/{(\d+)}/g, (_, number) => args[number] || `{${number}}`);
    }
  }

  // Return language object
  return langObj;
}
