import { ILanguageObject } from "../interfaces/language.interface";

/**
 * Fetch a literal from the given path.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'commands.cat.description').
 * @param prefix - Optional prefix to prepend to the path (e.g., 'commands.', 'events.', 'utils.').
 * @returns The value of the literal, or null if not found.
 */
function fetch(pathToLiteral: string, prefix: string = ""): any {
  // Split the path by periods
  const path = pathToLiteral.split(".");

  // If a prefix is provided, add it to the beginning of the path
  if (prefix) path.unshift(prefix);

  // Create a reference to the literals object to work with
  let literalsObj: ILanguageObject = literals;

  // Iterate over the path
  for (let i: number = 0; i < path.length; i++) {
    // Get the current path
    const currentPath = path[i];

    // If the current path does not exist in the literals object, return null
    if (literalsObj[currentPath] === undefined) return null;

    // If the current path is not an object or an array, return null if it's the last path, or return the value if it's not
    if (
      typeof literalsObj[currentPath] !== "object" ||
      Array.isArray(literalsObj[currentPath])
    ) {
      if (i === path.length - 1) return literalsObj[currentPath];
      return null;
    }

    literalsObj = literalsObj[currentPath] as ILanguageObject;
  }
}

/**
 * Fetch a literal from the commands object.
 * @param pathToLiteral - The path to the literal (e.g., 'cat.description').
 * @returns The value of the literal, or null if not found.
 */
export function fetchCommandLiteral(pathToLiteral: string): any {
  return fetch(pathToLiteral, "commands.");
}

/**
 * Fetch a literal from the events object.
 * @param pathToLiteral - The path to the literal (e.g., 'cat.description').
 * @returns The value of the literal, or null if not found.
 */
export function fetchEventLiteral(pathToLiteral: string): any {
  return fetch(pathToLiteral, "events.");
}

/**
 * Fetch a literal from the utils object.
 * @param pathToLiteral - The path to the literal (e.g., 'cat.description').
 * @returns The value of the literal, or null if not found.
 */
export function fetchUtilLiteral(pathToLiteral: string): any {
  return fetch(pathToLiteral, "utils.");
}

/**
 * Fetch a literal.
 * @param pathToLiteral - The path to the literal (e.g., 'cat.description').
 * @returns The value of the literal, or null if not found.
 */
export function fetchLiteral(pathToLiteral: string): any {
  return fetch(pathToLiteral);
}
