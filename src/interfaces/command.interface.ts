import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

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
  /** The name of the option, important that it is in lowercase entirely and without spaces */
  readonly name: string;

  /** A brief description of what the option does. */
  readonly description: string;

  /** The type of the option */
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
  /** Command name, important that it is in lowercase entirely and without spaces */
  readonly name: string;

  /** Command description */
  readonly description: string;

  /**
   * Command run function
   * @param client The Discord client
   * @param inter The interaction that triggered the command
   * @returns {Promise<void>} A promise that resolves when the command is done executing
   */
  readonly run: (
    client: Client,
    inter: ChatInputCommandInteraction
  ) => Promise<void>;

  /** Command optional options. */
  readonly options?: ICommandOption[];

  /** Command permissions, needed to run the command,
   * use PermissionFlagsBits properties to set the permissions, concatenated with | operator
   */
  readonly permissions?: (typeof PermissionFlagsBits)[keyof typeof PermissionFlagsBits];

  /** Wheter the command requires the user to be in a voice channel to execute it */
  readonly voiceChannel?: boolean;
}
