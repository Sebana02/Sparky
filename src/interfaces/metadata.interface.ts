import { TextChannel, VoiceChannel } from 'discord.js';

/**
 * Interface for the queue metadata
 */
export interface IQueuePlayerMetadata {
  /** The channel where the command was executed */
  channel: TextChannel;

  /** The voice channel where the user is */
  voiceChannel: VoiceChannel;

  /** Wheter trivia is being played or not */
  trivia?: boolean;
}

/**
 * Interface for the track metadata
 */
export interface ITrackMetadata {}
