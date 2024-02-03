const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

//Bans a member from the server, the member will not be able to join the server again until someone unban him
module.exports = {
    name: 'ban',
    description: 'Banea a un miembro del servidor.',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a banear del servidor',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se banea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        const member = inter.options.getMember('member');
        const reason = inter.options.getString('reason');

        await inter.deferReply({ ephemeral: true });

        if (member.id === inter.user.id) return await inter.editReply({ content: 'No puedes banearte a ti mismo', ephemeral: true });
        if (member.user.bot) return await inter.editReply({ content: 'No puedes banear a un bot', ephemeral: true })
        if (!member.bannable) return await inter.editReply({ content: 'No se pudo banear al miembro del servidor', ephemeral: true });

        await member.ban({ reason: reason, deleteMessageSeconds: 0 })
            .then(async () => {
                await member.send(`Has sido baneado del servidor ${inter.guild.name} por '${reason}'`)
                    .catch(err => console.error('El miembro tiene los DM desactivados: ' + err));

                await inter.editReply({ content: `${member} ha sido baneado del servidor`, ephemeral: true });
            })
            .catch(err => {
                inter.editReply({ content: 'No se pudo banear al miembro del servidor', ephemeral: true })
                console.error(err);
            });
    }
}