import { ILanguageObject } from "../src/interfaces/language.interface";

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
export function fetch(pathToLiteral: string): any {
  // // Split the path by periods
  // const path = pathToLiteral.split(".");
  // // Create a reference to the literals object to work with
  // let literalsObj: ILanguageObject = literals;
  // for (const key of path) {
  //   // If the key doesn't exist, return null
  //   if (!literalsObj.hasOwnProperty(key)) {
  //     return null;
  //   }
  //   // If the key is an object, update the reference to the literals object
  //   if (typeof literalsObj[key] === "object") {
  //     literalsObj = literalsObj[key] as ILanguageObject;
  //   }else if({
  //   }
  //   // Update the reference to the literals object
  //   literalsObj = literalsObj[key];
  // }
}
