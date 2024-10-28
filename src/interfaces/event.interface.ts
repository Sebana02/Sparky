import { Client } from 'discord.js';

/**
 * Interface for an event.
 */
export interface IEvent {
  /**
   * Event name; it should correspond to a valid event name of the corresponding emitter,
   * otherwise it won't work.
   */
  readonly event: string;

  /**
   * Event callback.
   * @param client The Discord client.
   * @param args The arguments passed to the event.
   * @returns A promise that resolves when the event is done executing.
   */
  readonly callback: (client: Client, ...args: any[]) => Promise<void>;
}
