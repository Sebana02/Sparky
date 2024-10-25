import { ILanguageObject } from "../src/interfaces/language.interface.js";

//   export function fetchFormattedLiteral (pathToLiteral:string, ...args:any[]):string|null { {
//     return fetch(pathToLiteral)(...args);
//   }

//   export function fetchLiteral(pathToLiteral:string):ILanguageObject|null {
//     return fetch(pathToLiteral);
//   }

//   export function fetchCommandLiteral(pathToLiteral:string):ILanguageObject|null {
//     return fetch('commands.' + pathToLiteral);
//   }

//   export function fetchEventLiteral(pathToLiteral:string):ILanguageObject|null {
//     return fetch(pathToLiteral);
//   }

//   export function fetchUtilLiteral(pathToLiteral:string):ILanguageObject|null {
//     return fetch(pathToLiteral);
//   }

/**
 * Fetch a literal from the literals object stored in literalsObj
 * @param {String} pathToLiteral - The path to the literal (e.g., 'commands.cat.description').
 * @returns {String|null} - The value of the literal, or null if not found.
 */
function fetch(pathToLiteral: string): any {
  //Get keys from path
  const keys = pathToLiteral.split(".");

  let aux: ILanguageObject = literals;

  //Get the value of the literal
  for (const key of keys) {
    if (aux[key]) {
      aux = aux[key] as ILanguageObject;
    } else {
      return null;
    }
  }
}
