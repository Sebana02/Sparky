import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { reply, deferReply } from '@utils/interaction-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('unban.description'),
  userName: fetchString('unban.options.member.name'),
  userDescription: fetchString('unban.options.member.description'),
  reasonName: fetchString('unban.options.reason.name'),
  reasonDescription: fetchString('unban.options.reason.description'),
  notBanned: fetchString('unban.not_banned'),
  response: fetchFunction('unban.response'),
};

/**
 * Command that unbans a member from the server
 * The member will be able to join the server again
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
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get user and reason
    const user = inter.options.getUser(commandLit.userName, true);
    const reason = inter.options.getString(commandLit.reasonName, true);

    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Check if the member is banned
    const bannedList = await inter.guild?.bans.fetch();
    const bannedMember = bannedList?.find((ban) => ban.user === user);
    if (!bannedMember)
      return await reply(
        inter,
        {
          embeds: [
            createEmbed({
              description: commandLit.notBanned,
              color: ColorScheme.error,
            }),
          ],
          ephemeral: true,
        },
        2
      );

    //Unban the member
    await inter.guild?.members.unban(bannedMember.user, reason);

    //Create the embed
    const embed = createEmbed({
      description: commandLit.response(user, reason),
      color: ColorScheme.moderation,
    });

    //Send a reply to the interaction
    await reply(inter, { embeds: [embed] }, 2);

    //Send a DM to him explaining the reason of the unban
    //Note: This will not work if the member has DMs disabled
    //Actually, this'll never work as user is not in cache
    //await bannedMember.user.send(...)
  },
};
