import { Client, GuildMember } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';
import { fetchFunction } from '../../utils/language-utils.js';

/**
 * Event that is called when a member joins a guild
 * Logs the event and sends a welcome message to the member
 */
export const event: IEvent = {
  event: 'guildMemberAdd',

  /**
   * Callback function for the event
   * @param client - The discord client
   * @param member - The member that joined the guild
   */
  callback: async (client: Client, member: GuildMember): Promise<void> => {
    //Log the event
    logger.info(`New member: ${member.user.tag} (id : ${member.user}) joined the server`);

    //Send a welcome message to the member
    await member.send(fetchFunction('guild_member_add')(member.guild.name, member.user.username));
  },
};
