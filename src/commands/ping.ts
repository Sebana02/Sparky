import { fetchFunction, fetchString } from '../utils/language-utils.js';
import { ICommand } from '../interfaces/command.interface.js';
import { getRandomGif } from '../utils/gif-utils.js';
import { ILanguageObject } from 'interfaces/language.interface.js';

export const command: ICommand = {
  name: 'ping',
  description: 'Ping!',
  run: async (client, inter) => {
    const b = await getRandomGif('ping');
    if (b) {
      await inter.reply({ content: a.response as string });
    }
  },
};

let a: ILanguageObject;
export function init() {
  console.log('Initializing ping...');

  a = {
    response: fetchString('ping.response'),
    a: fetchFunction('ping.a'),
  };
}
