const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

//Timeout a member from the server
module.exports = {
    name: 'timeout',
    description: 'Silencia a un miembro del servidor x tiempo',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a silenciar del servidor.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se silencia al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'time',
            description: 'El tiempo que se silenciará al miembro en minutos',
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        }
    ],
    run: async (client, inter) => {
        const member = inter.options.getMember('member');
        const reason = inter.options.getString('reason');
        const time = inter.options.getNumber('time');

        inter.deferReply({ ephemeral: true });

        if (member.id === inter.user.id) return await inter.editReply({ content: 'No puedes silenciarte a ti mismo', ephemeral: true });
        if (member.user.bot) return await inter.editReply({ content: 'No puedes silenciar a un bot', ephemeral: true })

        await member.timeout(time * 60 * 1000, reason)
            .then(async () => {
                await member.send(`Has sido silenciado del servidor ${inter.guild.name} por '${reason}'`)
                    .catch(err => console.error('El miembro tiene los DM desactivados: ' + err));

                await inter.editReply({ content: `${member} ha sido silenciado del servidor por ${time}`, ephemeral: true });
            })
            .catch(err => {
                inter.editReply({ content: 'No se pudo silenciar al miembro del servidor', ephemeral: true })
                console.error(err);
            });

    },
};
