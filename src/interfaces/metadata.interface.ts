import { TextBasedChannel, VoiceBasedChannel } from 'discord.js';

export interface IMetadata {
  /** The channel where the command was executed */
  channel: TextBasedChannel;

  /** The voice channel where the user is */
  voiceChannel: VoiceBasedChannel;

  /** Wheter trivia is being played or not */
  trivia?: boolean;
}
