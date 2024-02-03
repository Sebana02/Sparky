const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

//Mutes a member from the server
module.exports = {
    name: 'mute',
    description: 'Mutea a un miembro del servidor',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a mutear del servidor.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se mutea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, inter) => {
        const member = inter.options.getMember('member');
        const reason = inter.options.getString('reason');

        await inter.deferReply({ ephemeral: true });

        if (member.id === inter.user.id) return await inter.editReply({ content: 'No puedes mutearte a ti mismo', ephemeral: true });
        if (member.user.bot) return await inter.editReply({ content: 'No puedes mutear a un bot', ephemeral: true })

        let muteRole = await inter.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            try {
                muteRole = await inter.guild.roles.create({
                    name: "Muted",
                    color: "#514f48",
                    permissions: [],
                    reason: "Se necesita un rol para mutear a los miembros"
                },
                )

                await inter.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(muteRole, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false,
                        Connect: false,
                    })
                })
            } catch (err) {
                console.error(err);
            }
        }

        if (member.roles.cache.has(muteRole.id)) return inter.editReply({ content: 'El miembro ya está muteado', ephemeral: true });

        member.roles.set([muteRole.id])
            .then(() => {
                member.send(`Has sido muteado en ${inter.guild.name} por - ${reason}`)
                    .catch(err => console.error('El miembro tiene los DM desactivados: ' + err))

                inter.editReply({ content: `El miembro ${member} ha sido muteado`, ephemeral: true });
            })
            .catch(err => {
                console.error(err)
                inter.editReply({ content: 'No se pudo mutear al miembro', ephemeral: true });
            });

    }
}