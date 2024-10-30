import { ILanguageObject } from '../interfaces/language.interface.js';

/**
 * Fetch a string literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or 'not_found' if not found.
 */
export function fetchString(pathToLiteral: string, sourceObj: ILanguageObject = globalThis.literals): string {
  const literal = literals[pathToLiteral];

  return literal != null && typeof literal === 'string' ? literal : 'not_found';
}

/**
 * Fetch a number literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or -1 if not found.
 */
export function fetchNumber(pathToLiteral: string, sourceObj: ILanguageObject = globalThis.literals): number {
  const literal = literals[pathToLiteral];

  return literal != null && typeof literal === 'number' ? literal : -1;
}

/**
 * Fetch an array literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or an empty array if not found.
 */
export function fetchArray(pathToLiteral: string, sourceObj: ILanguageObject = globalThis.literals): any[] {
  const literal = literals[pathToLiteral];

  return literal != null && isArray(literal) ? literal : ['not_found'];
}

export function fetchObject(
  pathToLiteral: string,
  sourceObj: ILanguageObject = globalThis.literals
): ILanguageObject {
  throw new Error('Not implemented');
}
/**
 * Fetch a function literal from the given path in sourceObj.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @param sourceObj - The object to fetch the literal from. Defaults to the literals object.
 * @returns The value of the literal, or a dummy function if not found.
 */
export function fetchFunction(
  pathToLiteral: string,
  sourceObj: ILanguageObject = globalThis.literals
): (...args: any[]) => string {
  const literal = fetch(pathToLiteral, sourceObj);

  return literal != null && typeof literal === 'function'
    ? (literal as (...args: any[]) => string)
    : (...args: any[]) => 'not_found';
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
