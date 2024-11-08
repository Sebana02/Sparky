import { Client } from 'discord.js';

/**
 * Enum for the emitters.
 */
export enum Emitter {
  Process = 'process',
  Client = 'client',
  Player = 'player',
}

/**
 * Interface for an event.
 */
export interface IEvent {
  /**
   * The event name should correspond to a valid event name of the corresponding emitter, otherwise it won't work.
   * @see https://nodejs.org/api/process.html#process-events for the events of the process emitter.
   * @see https://discord.js.org/#/docs/main/stable/class/Client for the events of the client emitter.
   * @see https://discord-player.js.org/docs/discord-player/type/GuildQueueEvents for the events of the player emitter.
   */
  readonly event: string;

  /**
   * The emitter of the event.
   */
  readonly emitter: Emitter;

  /**
   * Event callback.
   * @param client The Discord client.
   * @param args The arguments passed to the event.
   * @returns A promise that resolves when the event is done executing.
   */
  readonly callback: (client: Client, ...args: any[]) => Promise<void>;
}
