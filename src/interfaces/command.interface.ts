import { Client, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

/**
 * Interface for a Discord Slash Command.
 */
export interface ICommand {
  /**
   * Discord Slash Command
   */
  data: SlashCommandBuilder;

  /**
   * Whether the command requires the user to be in a voice channel.
   */
  readonly voiceChannel?: boolean;

  /**
   * Whether the command will be blocked in DMs.
   * By default, commands are allowed in DMs.
   */
  readonly blockedInDMs?: boolean;

  /**
   * Command execution function.
   * @param client The Discord client.
   * @param inter The interaction that triggered the command.
   * @returns A promise that resolves when the command is done executing.
   */
  readonly execute: (client: Client, inter: ChatInputCommandInteraction, ...args: any[]) => Promise<void>;
}
