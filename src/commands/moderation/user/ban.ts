import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder, GuildMember } from 'discord.js';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('ban.description'),
  userName: fetchString('ban.options.member.name'),
  userDescription: fetchString('ban.options.member.description'),
  reasonName: fetchString('ban.options.reason.name'),
  reasonDescription: fetchString('ban.options.reason.description'),
  selfBan: fetchString('ban.self_ban'),
  notBannable: fetchString('ban.not_bannable'),
  response: fetchFunction('ban.response'),
  dmResponse: fetchFunction('ban.dm_response'),
};

/**
 * Command that bans a member from the server
 * The member will not be able to join the server again until someone unban him
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName(commandLit.userName).setDescription(commandLit.userDescription).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName(commandLit.reasonName).setDescription(commandLit.reasonDescription).setRequired(true)
    ) as SlashCommandBuilder,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Get member and reason
    const member = inter.options.getMember(commandLit.userName) as GuildMember;
    const reason = inter.options.getString(commandLit.reasonName, true);

    //Check the member is not the bot, the author of the interaction and that the member is bannable
    if (member.id === inter.user.id)
      return await reply(
        inter,
        {
          embeds: [
            createEmbed({
              description: commandLit.selfBan,
              color: ColorScheme.moderation,
            }),
          ],
          ephemeral: true,
        },
        2
      );

    if (!member.bannable || member.user.bot)
      return await reply(
        inter,
        {
          embeds: [
            createEmbed({
              description: commandLit.notBannable,
              color: ColorScheme.moderation,
            }),
          ],
          ephemeral: true,
        },
        2
      );

    //Send a DM to him explaining the reason of the ban
    //Note: This will not work if the member has DMs disabled, so we need to catch the error
    let dmMessagge = await member.send(commandLit.dmResponse(inter.guild?.name, reason)).catch(() => null);

    //Ban the member
    await member.ban({ reason: reason, deleteMessageSeconds: 0 }).catch(async (error) => {
      // If this catch statement is reached, the member was not banned, so we need to delete the DM we sent in case it was sent
      if (dmMessagge) await dmMessagge.delete();
      throw error;
    });

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member, reason),
      color: ColorScheme.moderation,
    });

    //Send message confirming the ban
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
