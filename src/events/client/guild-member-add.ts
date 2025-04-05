import { Client, GuildMember } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';
import { fetchFunction } from '../../utils/language-utils.js';

/**
 * Literal object for the event
 */
const eventLit = {
  response: fetchFunction('guild_member_add'),
};

/**
 * Event that is called when a member joins a guild
 * Logs the event and sends a welcome message to the member
 */
export const event: IEvent = {
  event: 'guildMemberAdd',

  emitter: Emitter.Client,

  callback: async (client: Client, member: GuildMember): Promise<void> => {
    //Log the event
    logger.info(`New member: ${member.user.tag} (id : ${member.user}) joined the server`);

    // Send a welcome message to the channel if the channel is set
    const welcomeChannelId = config.app.guildConfig?.welcomeChannelId;
    if (welcomeChannelId) {
      const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
      if (welcomeChannel?.isSendable()) {
        await welcomeChannel.send(eventLit.response(member.guild.name, member.user));
      } else {
        logger.error(`Welcome channel not found or is not sendable`);
      }
    }
    //Send a welcome message to the member
    await member.send(eventLit.response(member.guild.name, member.user));
  },
};
