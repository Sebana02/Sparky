import { ChatInputCommandInteraction, Client } from "discord.js";
import { createEmbed, ColorScheme } from "../embed/embed-utils";
import { reply } from "../interaction-utils";
import { ICommand } from "../../interfaces/command.interface";
import { fetchLiteral } from "../language-utils";

export async function commandErrorHandler(
  command: ICommand,
  client: Client,
  inter: ChatInputCommandInteraction,
  ...args: any[]
): Promise<void> {
  // Tries to execute the command function
  try {
    await command.run(client, inter, ...args);
  } catch (error: any) {
    logger.error(
      `An error occurred in command "${command.name}":\n`,
      error.stack
    );

    // Create an error embed
    const errorEmbed = createEmbed({
      color: ColorScheme.error,
      author: {
        name: fetchLiteral(
          "utils.error_handler.command_error_handler.response"
        ),
        iconURL: client?.user?.displayAvatarURL(),
      },
    });

    // Reply to the interaction with the error embed
    await reply(
      inter,
      {
        embeds: [errorEmbed],
        ephemeral: true,
      },
      { deleteTime: 2 },
      false
    );
  }
}
