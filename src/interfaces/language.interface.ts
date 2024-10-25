/**
 * Interface for language object
 */
export interface ILanguageObject {
  /** Language key */
  [key: string]:
    | ILanguageObject
    | string
    | number
    | any[]
    | ((...args: any[]) => string);
}
