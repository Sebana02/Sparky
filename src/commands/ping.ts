import { ICommand } from '../interfaces/command.interface.js';
import { getRandomGif } from '../utils/gif-utils.js';

export const command: ICommand = {
  name: 'ping',
  description: 'Ping!',
  run: async (client, inter) => {
    const a = await getRandomGif('ping');
    if (a) {
      await inter.reply({ content: a });
    }
  },
};

export default command;
