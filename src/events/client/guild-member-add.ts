import { Client, GuildMember } from "discord.js";
import { IEvent } from "../../interfaces/event.interface";
import { fetchLiteral } from "../../utils/language-utils";

/**
 * Event that is called when a member joins a guild
 * Logs the event and sends a welcome message to the member
 */
const event: IEvent = {
  event: "guildMemberAdd",

  /**
   * Callback function for the event
   * @param client - The discord client
   * @param member - The member that joined the guild
   */
  callback: async (client: Client, member: GuildMember): Promise<void> => {
    //Log the event
    logger.info(
      `New member: ${member.user.tag} (id : ${member.user}) joined the server`
    );

    //Send a welcome message to the member
    await member.send(
      fetchLiteral("events.client.guild_member_add.response")(
        member.guild.name,
        member.user.username
      )
    );
  },
};

export default event;
