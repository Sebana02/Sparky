import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

/**
 * Interface for a command option choice.
 */
export interface ICommandOptionChoice {
  /** The name of the choice. */
  readonly name: string;

  /** The value of the choice. */
  readonly value: string | number;
}

/**
 * Interface for a command option.
 */
export interface ICommandOption {
  /** The name of the option (must be in lowercase and without spaces). */
  readonly name: string;

  /** A brief description of what the option does. */
  readonly description: string;

  /** The type of the option. */
  readonly type: ApplicationCommandOptionType;

  /** Whether the option is required. */
  readonly required?: boolean;

  /** Optional choices for the option. */
  readonly choices?: ICommandOptionChoice[];
}

/**
 * Interface for a command.
 */
export interface ICommand {
  /** Command name (must be in lowercase and without spaces). */
  readonly name: string;

  /** Command description. */
  readonly description: string;

  /**
   * Command execution function.
   * @param client The Discord client.
   * @param inter The interaction that triggered the command.
   * @returns A promise that resolves when the command is done executing.
   */
  readonly run: (
    client: Client,
    inter: ChatInputCommandInteraction
  ) => Promise<void>;

  /** Command optional options. */
  readonly options?: ICommandOption[];

  /**
   * Command permissions needed to run the command.
   * Use PermissionFlagsBits properties to set the permissions, concatenated with the | operator.
   */
  readonly permissions?: (typeof PermissionFlagsBits)[keyof typeof PermissionFlagsBits];

  /** Whether the command requires the user to be in a voice channel to execute it. */
  readonly voiceChannel?: boolean;
}
