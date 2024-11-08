import { TextChannel, VoiceChannel } from 'discord.js';

export interface IMetadata {
  /** The channel where the command was executed */
  channel: TextChannel;

  /** The voice channel where the user is */
  voiceChannel: VoiceChannel;

  /** Wheter trivia is being played or not */
  trivia?: boolean;
}
