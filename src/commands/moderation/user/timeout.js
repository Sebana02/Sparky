const { ApplicationCommandOptionType } = require('discord.js');
const { reply, deferReply } = require('@utils/interaction-utils.js');
const permissions = require('@utils/permissions.js');

/**
 * Command that timeouts a member from the server
 * The member will not be able to send messages in the server for the given time
 */
module.exports = {
  name: 'timeout',
  description: 'Silencia a un miembro del servidor x tiempo',
  permissions: permissions.KickMembers,
  options: [
    {
      name: 'usuario',
      description: 'El miembro a silenciar del servidor.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'motivo',
      description: 'La razón por la que se silencia al miembro',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'tiempo',
      description: 'El tiempo que se aislará al miembro en minutos',
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 1,
    },
  ],
  run: async (client, inter) => {
    //Get member, reason and time
    const member = inter.options.getMember('usuario');
    const reason = inter.options.getString('motivo');
    const time = inter.options.getNumber('tiempo');

    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Check the member is not the bot or the author of the interaction
    if (member.id === inter.user.id)
      return await reply(inter, {
        content: 'No puedes aislarte a ti mismo',
        ephemeral: true,
        deleteTime: 2,
      });
    if (member.user.bot)
      return await reply(inter, {
        content: 'No puedes aislar a un bot',
        ephemeral: true,
        deleteTime: 2,
      });

    //Send a DM to the member explaining the reason of the timeout
    //Note: This will not work if the member has DMs disabled
    let dmMessagge = await member
      .send(`Has sido aislado del servidor **${inter.guild.name}** por **${reason}** durante **${time}** minutos`)
      .catch(() => null);

    //Timeout the member
    await member.timeout(time * 60 * 1000, reason).catch((error) => {
      // If this catch statement is reached, the member was not timed out, so we need to delete the DM we sent in case it was sent
      if (dmMessagge) dmMessagge.delete().catch(() => null);
      throw error;
    });

    //Send message confirming the timeout
    await reply(inter, {
      content: `**${member}** ha sido aislado del servidor durante **${time}** minuto(s)`,
      ephemeral: true,
      propagate: false,
      deleteTime: 2,
    });
  },
};
