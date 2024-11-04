/**
 * Fetch a literal from the given path .
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @returns The value of the literal if found
 * @throws An error if the literal is not found or is not a string
 */
export function fetchString(pathToLiteral: string): string {
  //Get the literal from the literals object using the pathToLiteral as the key
  const literal = globalThis.literals[pathToLiteral];

  //If the literal is not found or is not a string, throw an error
  if (!literal || typeof literal !== 'string')
    throw new Error(`Literal not found or is not of type string: ${pathToLiteral}`);

  //Return the literal
  return literal;
}

/**
 * Fetch a literal from the given path.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @returns The value of the literal if found.
 * @throws An error if the literal is not found or is not a number
 */
export function fetchNumber(pathToLiteral: string): number {
  // Get the literal from the literals object using the pathToLiteral as the key
  const literal = globalThis.literals[pathToLiteral];

  // If the literal is not found or is not a number, throw an error
  if (!literal || typeof literal !== 'number')
    throw new Error(`Literal not found or is not of type number: ${pathToLiteral}`);

  // Return the literal
  return literal;
}

/**
 * Fetch a literal from the given path.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @returns The value of the literal if found.
 * @throws An error if the literal is not found or is not a boolean
 */
export function fetchArray(pathToLiteral: string): any[] {
  // Get the literal from the literals object using the pathToLiteral as the key
  const literal = globalThis.literals[pathToLiteral];

  // If the literal is not found or is not an array, throw an error
  if (!literal || !Array.isArray(literal))
    throw new Error(`Literal not found or is not of type array: ${pathToLiteral}`);

  // Return the literal
  return literal;
}

/**
 * Fetch a literal from the given path.
 * @param pathToLiteral - The path to the literal concatenated with '.' (e.g., 'cat.description').
 * @returns The value of the literal if found.
 * @throws An error if the literal is not found or is not a function
 */
export function fetchFunction(pathToLiteral: string): (...args: any[]) => string {
  // Get the literal from the literals object using the pathToLiteral as the key
  const literal = globalThis.literals[pathToLiteral];

  // If the literal is not found or is not a function, throw an error
  if (!literal || typeof literal !== 'function')
    throw new Error(`Literal not found or is not of type function: ${pathToLiteral}`);

  // Return the literal
  return literal;
}
