/**
 * Interface for a language object.
 */
export interface ILanguageObject {
  /** Language key. */
  [key: string]:
    | ILanguageObject // Nested language objects
    | string // String values
    | number // Numeric values
    | any[] // Arrays of unknown type
    | ((...args: any[]) => string); // Function returning a string
}
