import { ActivityOptions, Base64Resolvable, BufferResolvable, PresenceData, PresenceStatusData } from 'discord.js';
import localesJson from '../../locales/locales.json';

/**
 * Interface for user configuration.
 */
export interface IUserConfig {
  /**
   * Language locale for the bot, default is 'en-US'.
   */
  locale?: localeKeys;
  /**
   * Path to the log file, default is '.log'.
   */
  logPath?: string;
  /**
   * Configuration for the guild (server). If not provided, the bot will be configured globally.
   */
  guildConfig?: IGuildConfig;
  /**
   * Configuration for the client user (bot).
   */
  clientConfig?: IClientConfig;
}

/**
 * Interface for guild configuration, including server-specific settings.
 */
export interface IGuildConfig {
  /**
   * ID of the guild (server) the bot is connected to.
   */
  guildId: string;
  /**
   * ID of the channel for logging events and messages.
   */
  welcomeChannelId?: string;
  /**
   * List of IDs of channels to ignore commands in.
   */
  ignoreChannels?: string[];
  /**
   * List of IDs of roles to ignore commands from.
   */
  ignoreRoles?: string[];
  /**
   * ID of the role for DJ permissions.
   */
  djRoleId?: string;
}

/**
 * Interface for client user (bot) configuration.
 */
export interface IClientConfig {
  /**
   * Whether to set the bot as AFK.
   */
  setAFK?: boolean;
  /**
   * Activity options for the bot.
   */
  setActivity?: ActivityOptions;
  /**
   * Avatar for the bot.
   */
  setAvatar?: BufferResolvable | Base64Resolvable | null;
  /**
   * Banner for the bot.
   */
  setBanner?: BufferResolvable | Base64Resolvable | null;
  /**
   * Presence data for the bot.
   */
  setPresence?: PresenceData;
  /**
   * Status data for the bot.
   */
  setStatus?: PresenceStatusData;
  /**
   * Username for the bot.
   */
  setUsername?: string;
}

/**
 * Type for language locale keys, derived from the locales JSON file.
 * This ensures that only valid locale keys are used in the configuration.
 */
export const locales = localesJson;
export type localeKeys = keyof typeof locales;

/**
 * Interface for client configuration, including non-sensitive information.
 */
export interface IApplicationConfig {
  /**
   * Default language locale for the bot, default is 'en-US'.
   */
  defaultLocale: localeKeys;
  /**
   * Language locale for the bot, default is 'en-US'.
   */
  locale: localeKeys;
  /**
   * Path to the log file, default is '.log'.
   */
  logPath: string;
  /**
   * Configuration for the guild (server). If not provided, the bot will not be configured globally.
   */
  guildConfig?: IGuildConfig;
  /**
   * Configuration for the client user (bot).
   */
  clientConfig?: IClientConfig;
}

/**
 * Interface for secret configuration, including sensitive information.
 * This information should not be shared publicly or stored in version control.
 */
export interface ISecretConfig {
  /**
   * Discord bot token for authentication.
   */
  token?: string;
  /**
   * Tenor API key for GIF support.
   */
  tenorAPIKey?: string;
}

/**
 * Interface for the overall configuration, combining both app and secret configurations.
 */
export interface IConfig {
  /**
   * App configuration, including non-sensitive information.
   */
  app: IApplicationConfig;
  /**
   * Secret configuration, including sensitive information.
   * This information should not be shared publicly or stored in version control.
   */
  secret: ISecretConfig;
}
