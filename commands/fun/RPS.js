const { EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'rps',
    description: 'Juega al piedra/papel/tijeras con un amigo',
    options: [
        {
            name: 'oponent',
            description: 'Menciona a tu oponente',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, inter) => {

        const opponent = inter.options.getUser('oponent');
        if (opponent.bot) return inter.reply('No puedes jugar contra un bot');
        if (opponent === inter.user) return inter.reply('No puedes jugar contra ti mismo');

        await inter.deferReply();

        let game = new RPS({ inter });

        game.createGame()
            .catch(err => {
                inter.editReply({ content: "Ha ocurrido un error", embeds: [], components: [] });
                console.log("Ha ocurrido un error" + err);
            })

    }
};


class RPS {
    constructor({ inter }) {
        this.icons = ['✂', '🥌', '🧻'];
        this.inter = inter;
    }

    async createGame() {
        let embed = new EmbedBuilder()
            .setTitle(`${this.inter.user.username} vs ${this.inter.options.getUser('oponent').username}`)
            .setColor(0x323437)

        let buttons = this.createButtons();

        await this.inter.editReply({ embeds: [embed], components: [buttons] });

        let elecciones = await this.collectInteracion();

        embed.setTitle(`${elecciones[0].user.username} ${this.icons[elecciones[0].index]} 
            vs ${this.icons[elecciones[1].index]} ${elecciones[1].user.username}`);

        await this.inter.editReply({ embeds: [embed], components: [] });

    }

    createButtons() {
        let row = new ActionRowBuilder();

        for (let i = 0; i <= 2; i++) {

            row.addComponents(
                new ButtonBuilder()
                    .setLabel(this.icons[i])
                    .setCustomId(JSON.stringify({ index: i }))
                    .setStyle('Primary'));
        }

        return row;
    }

    async collectInteracion() {

        let elecciones = [];

        return new Promise(async (resolve, reject) => {

            let msg = await this.inter.fetchReply();
            const filter = (i) => (!i.user.bot && JSON.parse(i.customId).index !== undefined);
            const collector = await msg.createMessageComponentCollector({ filter, time: 60000, });

            collector.on('collect', async (i) => {

                i.reply({ content: `Has escogido ${this.icons[JSON.parse(i.customId).index]}`, ephemeral: true })
                    .then(setTimeout(() => i.deleteReply(), 2000));

                if (i.user === this.inter.options.getUser('oponent') || i.user === this.inter.user) {

                    elecciones.filter((person) => person.user !== i.user)
                    elecciones.push({ user: i.user, index: JSON.parse(i.customId).index });

                    if (elecciones.length === 2) {
                        collector.stop();
                        resolve(elecciones);
                    }
                }
            });
        });
    }
}

