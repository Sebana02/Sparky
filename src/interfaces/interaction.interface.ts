import { ActionRowBuilder, EmbedBuilder } from 'discord.js';

/**
 * Interface for the interaction object
 */
export interface IInteractionReply {
  /** The content of the interaction */
  content?: string;

  /** Whether the message should be ephemeral */
  ephemeral?: boolean;

  /** The embeds of the interaction */
  embeds?: EmbedBuilder[];

  /** The components of the interaction */
  components?: ActionRowBuilder[];
}

/**
 * Interface for the interaction defer object
 */
export interface IInteractionDefer {
  /** Whether the message should be ephemeral */
  ephemeral: boolean;
}

/**
 * Interface for the interaction delete object
 */
export interface IInteractionDelete {
  /** The time to delete the message, negative means no delete */
  deleteTime: number;
}
