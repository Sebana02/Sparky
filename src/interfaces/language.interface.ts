/**
 * Interface for language object
 */
export interface ILanguageObject {
  /** Language key */
  [key: string]:
    | ILanguageObject
    | string
    | any[]
    | ((...args: any[]) => string);
}
