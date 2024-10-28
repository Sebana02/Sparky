import { ILanguageObject } from '../interfaces/language.interface.js';

/**
 * Fetch a string literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or 'not_found' if not found.
 */
export function fetchString(pathToLiteral: string, sourceObj: ILanguageObject = literals): string {
  const literal = fetch(pathToLiteral, sourceObj);

  return literal != null && typeof literal === 'string' ? literal : 'not_found';
}

/**
 * Fetch an object literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or an empty object if not found.
 */
export function fetchObject(pathToLiteral: string, sourceObj: ILanguageObject = literals): ILanguageObject {
  const literal = fetch(pathToLiteral, sourceObj);

  return literal != null && isObject(literal) ? (literal as ILanguageObject) : { not_found: 'not_found' };
}

/**
 * Fetch a number literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or -1 if not found.
 */
export function fetchNumber(pathToLiteral: string, sourceObj: ILanguageObject = literals): number {
  const literal = fetch(pathToLiteral, sourceObj);

  return literal != null && typeof literal === 'number' ? literal : -1;
}

/**
 * Fetch an array literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or an empty array if not found.
 */
export function fetchArray(pathToLiteral: string, sourceObj: ILanguageObject = literals): any[] {
  const literal = fetch(pathToLiteral, sourceObj);

  return literal != null && isArray(literal) ? literal : ['not_found'];
}

/**
 * Fetch a function literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or a dummy function if not found.
 */
export function fetchFunction(pathToLiteral: string, sourceObj: ILanguageObject = literals): Function {
  const literal = fetch(pathToLiteral, sourceObj);

  return literal != null && typeof literal === 'function' ? literal : (...args: any[]) => 'not_found';
}

/**
 * Fetch a literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @returns The value of the literal, or null if not found.
 */
function fetch(
  pathToLiteral: string,
  sourceObj: ILanguageObject = literals
): ILanguageObject | string | number | any[] | Function | null {
  // Split the path by periods
  const path = pathToLiteral.split('.');

  // Create a reference to the literals object to work with
  let literalsObj: ILanguageObject = sourceObj;

  // Traverse the path
  let i = 0;
  while (i < path.length) {
    // If the element is undefined, not an object, or an array, break the loop
    if (literalsObj === undefined || !isObject(literalsObj)) break;

    // Else, move to the next element
    literalsObj = literalsObj[path[i]] as ILanguageObject;

    // Increment the counter
    i++;
  }

  // If the last element is reached, return the literals objec
  if (i === path.length) return literalsObj;

  // Log an error and return null if the literal is not found
  logger.warn(`Could not find literal at path "${pathToLiteral}"`);
  return null;
}

/**
 * Check if the given object is an object.
 * @param obj - The object to check.
 * @returns True if the object is an object, false otherwise.
 */
function isObject(obj: any): obj is object {
  return obj !== null && typeof obj === 'object' && !isArray(obj) && typeof obj !== 'function';
}

/**
 * Check if the given object is an array.
 * @param obj - The object to check.
 * @returns True if the object is an array, false otherwise.
 */
function isArray(obj: any): obj is any[] {
  return obj != null && Array.isArray(obj);
}
