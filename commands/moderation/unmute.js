const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

//Unmutes a member from the server
module.exports = {
    name: 'unmute',
    description: 'Desmutea a un miembro del servidor',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a desmutear del servidor.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se desmutea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, inter) => {
        const member = inter.options.getMember('member');
        const reason = inter.options.getString('reason');

        await inter.deferReply({ ephemeral: true });

        if (member.id === inter.user.id) return await inter.editReply({ content: 'No puedes desmutearte a ti mismo', ephemeral: true });
        if (member.user.bot) return await inter.editReply({ content: 'No puedes desmutear a un bot', ephemeral: true })

        let muteRole = await inter.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) return inter.editReply({ content: 'No existe el rol "Muted" -> no hay nadie muteado', ephemeral: true });

        if (!member.roles.cache.has(muteRole.id)) return inter.editReply({ content: 'El miembro no está muteado', ephemeral: true });

        member.roles.remove([muteRole.id])
            .then(() => {
                member.send(`Has sido desmuteado en ${inter.guild.name} por - ${reason}`)
                    .catch(err => console.error('El miembro tiene los DM desactivados: ' + err))

                inter.editReply({ content: `El miembro ${member} ha sido desmuteado`, ephemeral: true });
            })
            .catch(err => {
                console.error(err)
                inter.editReply({ content: 'No se pudo desmutear al miembro', ephemeral: true });
            });

    }
}