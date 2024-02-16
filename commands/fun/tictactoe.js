const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { createEmbed } = require('@utils/embedUtils/embedUtils.js')
const { reply } = require('@utils/interactionUtils.js')

//Command that allows user to play tic tac toe with a friend
module.exports = {
    name: 'tictactoe',
    description: 'Juega al tictactoe con un amigo',
    options: [
        {
            name: 'oponent',
            description: 'Menciona a tu oponente',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async (client, inter) => {

        //Initial comprobations
        const opponent = inter.options.getUser('oponent')
        if (opponent.bot)
            return await reply(inter, { content: 'No puedes jugar contra un bot', ephemeral: true, deleteTime: 2 })

        if (opponent === inter.user)
            return await reply(inter, { content: 'No puedes jugar contra ti mismo', ephemeral: true, deleteTime: 2 })


        await inter.deferReply()

        //Create the game
        let game = new TicTacToe({
            player_two: opponent,
            inter: inter
        })

        //Start the game
        await game.execute()
    }
}

//Class that represents a tic tac toe game
class TicTacToe {
    constructor(options) {
        this.player_one = options.inter.user
        this.player_two = options.player_two
        this.inter = options.inter
        this.turn = this.player_one
        this.board = [
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜']
        ]
        this.symbols = ['❌', '⭕']
        this.game_over = false
    }

    //Run the game
    async execute() {
        //Initial message
        await reply(this.inter, { embeds: [createEmbed({ description: this.createBoard(), })], components: this.createButtons() })

        //Loop until the game is over
        while (!this.game_over) {

            //Collect interaction from the player
            const { row, column } = await this.collectInteraction()

            if (row === undefined || column === undefined) {
                this.game_over = true
                await reply(this.inter, { content: `Tiempo agotado! Empate` })
                break
            }

            this.board[row][column] = this.symbols[this.turn === this.player_one ? 0 : 1]

            await reply(this.inter, { embeds: [createEmbed({ description: this.createBoard(), })], components: this.createButtons() })


            //Check if the player has won
            if (this.hasWon(this.symbols[this.turn === this.player_one ? 0 : 1])) {
                await reply(this.inter, { content: `${this.turn} ha ganado!` })
                this.game_over = true
                break
            }

            //Check if the game is a draw
            if (this.isDraw()) {
                await reply(this.inter, { content: `Empate!` })
                this.game_over = true
                break
            }

            //Change the turn
            this.turn = this.turn === this.player_one ? this.player_two : this.player_one
        }
    }

    //Chech if the cell is blank
    isValidCell(row, column) {
        return this.board[row][column] === '⬜'
    }

    //Check if player with symbol figure has won
    hasWon(symbol) {

        // Check for horizontal and vertical lines
        for (let i = 0; i < this.board.length; i++) {
            if ((this.board[i][0] === symbol && this.board[i][1] === symbol && this.board[i][2] === symbol) ||
                (this.board[0][i] === symbol && this.board[1][i] === symbol && this.board[2][i] === symbol)) {
                return true
            }
        }

        // Check for diagonal lines
        if ((this.board[0][0] === symbol && this.board[1][1] === symbol && this.board[2][2] === symbol) ||
            (this.board[2][0] === symbol && this.board[1][1] === symbol && this.board[0][2] === symbol)) {
            return true
        }

        //No winner
        return false
    }

    //Check if the game is a draw
    isDraw() {
        return this.board.every(row => row.every(cell => cell !== '⬜'))
    }

    //Create the buttons to interact with the game
    createButtons() {
        const icons = ['↖', '⬆', '↗', '⬅', '◼', '➡', '↙', '⬇', '↘']
        const components = []

        //Create the buttons and dispose them in a 3x3 grid
        for (let i = 0; i < this.board.length; i++) {
            const row = new ActionRowBuilder()

            for (let j = 0; j < this.board.length; j++) {
                const index = i * this.board.length + j

                //Create the button
                const button = new ButtonBuilder()
                    .setLabel(icons[index])
                    .setCustomId(JSON.stringify({ row: i, column: j }))
                    .setStyle('Primary')

                //Disable the button if the cell is not blank
                if (!this.isValidCell(i, j)) {
                    button.setDisabled(true).setStyle('Secondary')
                }

                row.addComponents(button)
            }

            components.push(row)
        }

        return components
    }

    //Create map with the current state of the game
    createBoard() {
        return "----------------\n"
            + this.board.map(row => '  | ' + row.join('  |  ') + ' |  ').join('\n')
            + "\n----------------"
    }

    // Collect interactions from the players
    async collectInteraction() {
        let msg = await this.inter.fetchReply()

        // Notify the current player about their turn
        const turnMessage = await this.inter.followUp(`${this.turn}, es tu turno!`)

        return new Promise(async (resolve, reject) => {
            // Ignore bot interactions and interactions that are not game buttons
            const filter = (i) => (!i.user.bot && JSON.parse(i.customId).row !== undefined && JSON.parse(i.customId).column !== undefined)

            // Use destructuring to extract properties from the customId
            const collector = await msg.createMessageComponentCollector({ filter, time: 60000 })

            // Listen for 'collect' event
            collector.on('collect', async (interaction) => {
                try {
                    //Ignore interactions from other players
                    if (interaction.user !== this.turn)
                        return await reply(interaction, { content: `No es tu turno!`, ephemeral: true, deleteTime: 2 })

                    // Stop collector and resolve Promise
                    collector.stop()

                    const row = JSON.parse(interaction.customId).row
                    const column = JSON.parse(interaction.customId).column

                    await reply(interaction, { content: `Has elegido la casilla [${row},${column}]`, ephemeral: true, deleteTime: 2 })

                    resolve({ row, column })
                } catch (error) {
                    reject(error)
                }
            })

            // Listen for 'end' event
            // If the collector ends without collecting anything, the game is over
            collector.on('end', async (collected, reason) => {
                //Delete the turn message
                await turnMessage.delete()

                if (reason === 'time')
                    resolve({})

            })
        })
    }

}