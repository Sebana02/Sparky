/**
 * Interface for a language object.
 */
export interface ILanguageObject {
  /** Language key. */
  [key: string]:
    | ILanguageObject // Nested language objects
    | string // String values
    | number // Numeric values
    | unknown[] // Arrays of unknown type
    | ((...args: unknown[]) => string); // Function returning a string
}
