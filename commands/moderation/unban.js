const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

//Unbans a member from the server
module.exports = {
    name: 'unban',
    description: 'Desbanea a un miembro del servidor.',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a desbanear del servidor.',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se desbanea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        const member = inter.options.getString('member');
        const reason = inter.options.getString('reason');

        await inter.deferReply({ ephemeral: true });

        const bannedList = await inter.guild.bans.fetch();
        const bannedMember = bannedList.find(ban => ban.user.username === member);

        if (!bannedMember) return await inter.editReply({ content: `${member} no está baneado del servidor`, ephemeral: true });
        await inter.guild.members.unban(bannedMember.user.id, reason)
            .then(async () => {
                await bannedMember.user.send(`Has sido desbaneado del servidor ${inter.guild.name} por '${reason}'`)
                    .catch(err => console.error('El miembro tiene los DM desactivados: ' + err));

                await inter.editReply({ content: `${member} ha sido desbaneado del servidor`, ephemeral: true });
            })
            .catch(err => {
                console.error(err);
                return inter.editReply({ content: 'No se pudo desbanear al miembro del servidor', ephemeral: true });
            });

    }
}
