const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'disconnect',
    description: 'Desconecta el bot',
    permissions: PermissionsBitField.Flags.Administrator,
    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true });
        try {
            await inter.editReply({ content: `Desconectando, ${inter.user.username}...`, ephemeral: true });
            await client.destroy();
        } catch (error) {
            console.error(`Error al desconectar el bot: ${error.message}`);
            await inter.editReply({ content: 'Ocurrió un error al desconectar el bot', ephemeral: true });
        }
    },
};
