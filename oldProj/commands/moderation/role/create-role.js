const { ApplicationCommandOptionType } = require('discord.js');
const { createEmbed } = require('@utils/embed/embed-utils.js');
const { reply, deferReply } = require('@utils/interaction-utils.js');
const permissions = require('@utils/permissions.js');

/**
 * Command that creates a role with the specified name and color
 */
module.exports = {
  name: 'createrole',
  description: 'Crea un rol con el nombre y color especificado',
  permissions: permissions.ManageRoles,
  options: [
    {
      name: 'nombre',
      description: 'El nombre del nuevo rol',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'color',
      description: 'El color del nuevo rol en formato HEX (ej. #FFFFFF)',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async (client, inter) => {
    //Get the role name and color from the interaction
    const roleName = inter.options.getString('nombre');
    const roleColor = inter.options.getString('color') || '#FFFFFF';

    // Check if the color is a valid HEX code
    if (!/^#([A-Fa-f0-9]{6})$/.test(roleColor))
      return reply(inter, {
        content: 'El color especificado no es un código HEX válido',
        ephemeral: true,
        deleteTime: 2,
      });

    // Defer reply
    await deferReply(inter, { ephemeral: true });

    // Check if the role already exists
    if (inter.guild.roles.cache.find((role) => role.name === roleName))
      return reply(inter, {
        content: 'Ya existe un rol con ese nombre',
        ephemeral: true,
        deleteTime: 2,
      });

    //TODO: is not finished
  },
};
