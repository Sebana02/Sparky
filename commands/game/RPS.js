const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { reply, deferReply, fetchReply } = require('@utils/interactionUtils.js')
const { createEmbed, modifyEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils.js')
/**
 * Command that allows users to play rock, paper, scissors with a friend
 */
module.exports = {
    name: 'rps',
    description: fetchCommandLit('game.rps.description'),
    options: [
        {
            name: fetchCommandLit('game.rps.option.name'),
            description: fetchCommandLit('game.rps.option.description'),
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, inter) => {
        //Get the opponent and check if it is a bot or the author of the interaction
        const opponent = inter.options.getUser(fetchCommandLit('game.rps.option.name'))
        if (opponent.bot) return await reply(inter, {
            content: fetchCommandLit('game.rps.checkings.againstBot'),
            ephemeral: true, deleteTime: 2
        })
        if (opponent === inter.user)
            return await reply(inter, {
                content: fetchCommandLit('game.rps.checkings.againstSelf'),
                ephemeral: true, deleteTime: 2
            })

        //Defer reply
        await deferReply(inter)

        //Create the game
        await new RPS(inter).createGame()
    }
}

/**
 * Class that represents a Rock, Paper, Scissors game
 */
class RPS {
    constructor(inter) {
        this.icons = ['✌️', '✋', '✊'] //Scissors, Rock, Paper emojis
        this.inter = inter
    }

    /**
     * Creates the game and waits for the players to choose their move, then shows the result
     */
    async createGame() {
        //Create the embed and buttons
        const embed = createEmbed({
            title: `${this.inter.user.username} vs ${this.inter.options.getUser(fetchCommandLit('game.rps.option.name')).username}`
            , color: ColorScheme.game
        })
        const buttons = this.createButtons()

        //Send the embed and buttons
        await reply(this.inter, { embeds: [embed], components: [buttons] })

        //Wait for the players to choose their move
        let elections = await this.collectInteracion()

        //Check the winner
        const winner = this.checkWinner(elections)

        //Show the result
        modifyEmbed(embed, {
            description: winner,
            title: `${elections[0].user.username} ${this.icons[elections[0].index]} 
            vs ${this.icons[elections[1].index]} ${elections[1].user.username}`
        })

        //Send the result
        await reply(this.inter, { embeds: [embed], components: [] })
    }

    /**
     * Creates the buttons to choose the move
     * @returns {ActionRowBuilder} The buttons to choose the move
     */
    createButtons() {
        let row = new ActionRowBuilder()

        for (let i = 0; i <= 2; i++) {

            row.addComponents(
                new ButtonBuilder()
                    .setLabel(this.icons[i])
                    .setCustomId(JSON.stringify({ index: i }))
                    .setStyle('Primary'))
        }

        return row
    }

    /**
     * Collects the interaction of the players and returns their moves
     * @returns {Promise<Array>} The moves of the players
     */
    async collectInteracion() {

        //Array to store the moves of the players
        let elections = []

        //Wait for the players to choose their move, promise resolves with the elections when both players have chosen
        return await new Promise(async (resolve, reject) => {

            //Fetch the reply
            let msg = await fetchReply(this.inter)

            //Create the collector
            const filter = (i) => (!i.user.bot && JSON.parse(i.customId).index !== undefined)
            const collector = await msg.createMessageComponentCollector({ filter, time: 60000, })

            collector.on('collect', async (i) => {

                try {
                    //When the player chooses a move, reply to them
                    reply(i, {
                        content: fetchCommandLit('game.rps.selection', this.icons[JSON.parse(i.customId).index]),
                        ephemeral: true, deleteTime: 2, propagate: false
                    })

                    //If the interaction is from the author or the opponent, store their move
                    if (i.user === this.inter.options.getUser(fetchCommandLit('game.rps.option.name'))
                        || i.user === this.inter.user) {

                        //Delete theyre previous election if they have chosen again and store the new one
                        elections.filter((person) => person.user !== i.user)
                        elections.push({ user: i.user, index: JSON.parse(i.customId).index })

                        //If both players have chosen, resolve the promise
                        if (elections.length === 2) {
                            collector.stop()
                            resolve(elections)
                        }
                    }
                } catch (error) {
                    reject(error)
                    collector.stop()
                }
            })
        })
    }

    /**
     * Checks the winner of the game
     * @param {Array} elections The moves of the players
     * @returns {String} The winner of the game
     */
    checkWinner(elections) {
        if (elections[0].index === elections[1].index) return fetchCommandLit('game.rps.results.tie')
        else return (elections[0].index + 1) % 3 === elections[1].index
            ? fetchCommandLit('game.rps.results.win', elections[0].user.username)
            : fetchCommandLit('game.rps.results.win', elections[1].user.username)
    }
}

