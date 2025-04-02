import { ActivityOptions, Base64Resolvable, BufferResolvable, PresenceData, PresenceStatusData } from 'discord.js';

/**
 * Interface for client configuration, including non-sensitive information.
 */
export interface IClientConfig {
  locale?: string;
  logPath?: string;
  guildId?: string;
  welcomeChannelId?: string;
  djRoleId?: string;
  setAFK?: boolean;
  setActivity?: ActivityOptions;
  setAvatar?: BufferResolvable | Base64Resolvable | null;
  setBanner?: BufferResolvable | Base64Resolvable | null;
  setPresence?: PresenceData;
  setStatus?: PresenceStatusData;
  setUsername?: string;
}

/**
 * Interface for secret configuration, including sensitive information.
 * This information should not be shared publicly or stored in version control.
 */
export interface ISecretConfig {
  /**
   * Discord bot token for authentication.
   */
  token: string;
  /**
   * Tenor API key for GIF support.
   */
  tenorAPIKey?: string;
}

/**
 * Interface for the overall configuration, combining both client and secret configurations.
 */
export interface IConfig {
  /**
   * Client configuration, including non-sensitive information.
   */
  client: IClientConfig;
  /**
   * Secret configuration, including sensitive information.
   * This information should not be shared publicly or stored in version control.
   */
  secret: ISecretConfig;
}
