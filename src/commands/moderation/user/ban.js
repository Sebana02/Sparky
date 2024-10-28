const { ApplicationCommandOptionType } = require('discord.js');
const { reply, deferReply } = require('@utils/interaction-utils.js');
const permissions = require('@utils/permissions.js');

/**
 * Command that bans a member from the server
 * The member will not be able to join the server again until someone unban him
 */
module.exports = {
  name: 'ban',
  description: 'Banea a un miembro del servidor',
  permissions: permissions.BanMembers,
  options: [
    {
      name: 'usuario',
      description: 'El miembro a banear del servidor',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'motivo',
      description: 'La razón por la que se banea al miembro',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, inter) => {
    //Get member and reason
    const member = inter.options.getMember('usuario');
    const reason = inter.options.getString('motivo');

    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Check the member is not the bot, the author of the interaction and that the member is bannable
    if (member.id === inter.user.id)
      return await reply(inter, {
        content: 'No puedes banearte a ti mismo',
        ephemeral: true,
        deleteTime: 2,
      });
    if (member.user.bot)
      return await reply(inter, {
        content: 'No puedes banear a un bot',
        ephemeral: true,
        deleteTime: 2,
      });
    if (!member.bannable)
      return await reply(inter, {
        content: 'No se pudo banear al miembro del servidor',
        ephemeral: true,
        deleteTime: 2,
      });

    //Send a DM to him explaining the reason of the ban
    //Note: This will not work if the member has DMs disabled
    let dmMessagge = await member
      .send(`Has sido baneado del servidor **${inter.guild.name}** por **${reason}**`)
      .catch(() => null);

    //Ban the member
    await member.ban({ reason: reason, deleteMessageSeconds: 0 }).catch((error) => {
      // If this catch statement is reached, the member was not banned, so we need to delete the DM we sent in case it was sent
      if (dmMessagge) dmMessagge.delete().catch(() => null);
      throw error;
    });

    //Send message confirming the ban
    await reply(inter, {
      content: `**${member}** ha sido baneado del servidor`,
      ephemeral: true,
      propagate: false,
      deleteTime: 2,
    });
  },
};
