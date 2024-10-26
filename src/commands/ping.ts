import { ICommand } from "../interfaces/command.interface";

const command: ICommand = {
  name: "ping",
  description: "Ping!",
  run: async (client, inter) => {
    await inter.reply("Pong!");
  },
};

export default command;
