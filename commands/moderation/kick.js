const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

//Kick a member from the server until they are re-invited, they will not be able to re-enter the server
module.exports = {
    name: 'kick',
    description: 'Explusar a un miembro del servidor.',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a expulsar del servidor',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se expulsa al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        const member = inter.options.getMember('member');
        const reason = inter.options.getString('reason');

        await inter.deferReply({ ephemeral: true });

        if (member.id === inter.user.id) return await inter.editReply({ content: 'No puedes expulsarte a ti mismo', ephemeral: true });
        if (member.user.bot) return await inter.editReply({ content: 'No puedes expulsar a un bot', ephemeral: true })
        if (!member.kickable) return await inter.editReply({ content: 'No se pudo expulsar al miembro del servidor', ephemeral: true });


        await member.kick(reason)
            .then(async () => {
                await member.send(`Has sido expulsado del servidor ${inter.guild.name} por '${reason}'`)
                    .catch(err => console.error('El miembro tiene los DM desactivados: ' + err));

                await inter.editReply({ content: `${member} ha sido expulsado del servidor`, ephemeral: true });
            })
            .catch(err => {
                inter.editReply({ content: 'No se pudo expulsar al miembro del servidor', ephemeral: true })
                console.error(err);
            });

    }
}