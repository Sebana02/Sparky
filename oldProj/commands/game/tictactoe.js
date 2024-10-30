const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { createEmbed, modifyEmbed, ColorScheme } = require('@utils/embed/embed-utils.js');
const { reply, deferReply, fetchReply } = require('@utils/interaction-utils.js');
const { fetchCommandLit } = require('@utils/language-utils.js');
const timeout = require('@commands/moderation/user/timeout');

// Preload literals
const literals = {
  description: fetchCommandLit('game.tictactoe.description'),
  optionName: fetchCommandLit('game.tictactoe.option.name'),
  optionDescription: fetchCommandLit('game.tictactoe.option.description'),

  checkAgainstBot: fetchCommandLit('game.tictactoe.checkings.againstBot'),
  checkAgainstSelf: fetchCommandLit('game.tictactoe.checkings.againstSelf'),

  turn: (player) => fetchCommandLit('game.tictactoe.turn', player),
  notYourTurn: fetchCommandLit('game.tictactoe.select.notYourTurn'),
  selected: (selected) => fetchCommandLit('game.tictactoe.select.selected', selected),

  timeout: fetchCommandLit('game.tictactoe.results.timeout'),
  win: (player) => fetchCommandLit('game.tictactoe.results.win', player),
  draw: fetchCommandLit('game.tictactoe.results.draw'),
};

/**
 * Command that allows user to play tic tac toe with a friend
 */
module.exports = {
  name: 'tictactoe',
  description: literals.description,
  options: [
    {
      name: literals.optionName,
      description: literals.optionDescription,
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  run: async (client, inter) => {
    //Check if the opponent is a bot or the author
    const opponent = inter.options.getUser(literals.optionName);
    if (opponent.bot)
      return await reply(inter, {
        content: literals.checkAgainstBot,
        ephemeral: true,
        deleteTime: 2,
      });
    if (opponent === inter.user)
      return await reply(inter, {
        content: literals.checkAgainstSelf,
        ephemeral: true,
        deleteTime: 2,
      });

    //Defer the reply
    await deferReply(inter);

    //Create the game
    let game = new TicTacToe({
      player_two: opponent,
      inter: inter,
    });

    //Start the game
    await game.execute();
  },
};

/**
 * Class that represents a tic tac toe game
 * @param {Object} options - Options for the game
 * @param {User} options.player_two - The opponent of the player
 * @param {Interaction} options.inter - The interaction object
 */
class TicTacToe {
  constructor(options) {
    this.player_one = options.inter.user; //The author of the command
    this.player_two = options.player_two; //The opponent
    this.inter = options.inter; //The interaction object
    this.turn = this.player_one; //The current turn
    this.board = [
      ['⬜', '⬜', '⬜'],
      ['⬜', '⬜', '⬜'],
      ['⬜', '⬜', '⬜'],
    ]; //The game board
    this.symbols = ['❌', '⭕']; //The symbols for the players
  }

  /**
   * Method that executes the game
   */
  async execute() {
    //Create the initial embed
    const embed = createEmbed({
      title: 'Tic Tac Toe',
      description: this.createBoard(),
      footer: {
        text: literals.turn(this.turn.username),
        iconURL: this.turn.displayAvatarURL(),
      },
      color: ColorScheme.game,
    });

    //Initial message
    await reply(this.inter, {
      embeds: [embed],
      components: this.createButtons(),
    });

    //Loop until the game is over
    let game_over = false;
    let winner = null;
    while (!game_over) {
      //Collect interaction from the player
      const { row, column } = await this.collectInteraction();

      //Check if the player has not interacted, timeout
      if (row === undefined || column === undefined) {
        game_over = true;
        await reply(this.inter, { content: literals.timeout });
        break;
      }

      //Use the player's symbol to fill the cell
      this.board[row][column] = this.symbols[this.turn === this.player_one ? 0 : 1];

      //Check if any of the players have won
      if (this.hasWon(this.symbols[this.turn === this.player_one ? 0 : 1])) {
        game_over = true;
        winner = this.turn;
      } else if (this.isDraw())
        //Check if the game is a draw
        game_over = true;

      //Change the turn
      this.turn = this.turn === this.player_one ? this.player_two : this.player_one;

      //Update the embed
      modifyEmbed(embed, {
        description: this.createBoard(),
        footer: {
          text: literals.turn(this.turn.username),
          iconURL: this.turn.displayAvatarURL(),
        },
      });

      //Update the message
      await reply(this.inter, {
        embeds: [embed],
        components: this.createButtons(),
      });
    }

    //Update the embed with the winner
    modifyEmbed(embed, {
      footer: {
        text: winner ? literals.win(winner.username) : literals.draw,
        iconURL: winner.displayAvatarURL(),
      },
    });

    //Update the message
    await reply(this.inter, { embeds: [embed], components: [] });
  }

  /**
   * Check if the cell is valid -> empty
   * @param {number} row
   * @param {number} column
   * @returns Whether the cell is valid
   */
  isValidCell(row, column) {
    return this.board[row][column] === '⬜';
  }

  /**
   * Check if player with symbol figure has won
   * @param {string} symbol figure of the player
   * @returns Whether the player with symbol figure has won
   */
  hasWon(symbol) {
    // Check for horizontal and vertical lines
    for (let i = 0; i < this.board.length; i++) {
      if (
        (this.board[i][0] === symbol && this.board[i][1] === symbol && this.board[i][2] === symbol) ||
        (this.board[0][i] === symbol && this.board[1][i] === symbol && this.board[2][i] === symbol)
      ) {
        return true;
      }
    }

    // Check for diagonal lines
    if (
      (this.board[0][0] === symbol && this.board[1][1] === symbol && this.board[2][2] === symbol) ||
      (this.board[2][0] === symbol && this.board[1][1] === symbol && this.board[0][2] === symbol)
    ) {
      return true;
    }

    //No winner
    return false;
  }

  /**
   * Check if the game is a draw
   * @returns Whether the game is a draw
   */
  isDraw() {
    return this.board.every((row) => row.every((cell) => cell !== '⬜'));
  }

  /**
   * Create the buttons to interact with the game
   * @returns {Array<ActionRowBuilder>} The buttons to interact with the game
   */
  createButtons() {
    //Create the icons for the buttons
    const icons = ['🡤', '🡡', '🡥', '🡠', '▪', '🡢', '🡧', '🡣', '🡦'];
    const components = [];

    //Create the buttons and dispose them in a 3x3 grid
    for (let i = 0; i < this.board.length; i++) {
      const row = new ActionRowBuilder();

      for (let j = 0; j < this.board.length; j++) {
        const index = i * this.board.length + j;

        //Create the button
        const button = new ButtonBuilder()
          .setLabel(icons[index])
          .setCustomId(JSON.stringify({ row: i, column: j }))
          .setStyle('Primary');

        //Disable the button if the cell is not blank
        if (!this.isValidCell(i, j)) {
          button.setDisabled(true).setStyle('Secondary');
        }

        row.addComponents(button);
      }

      components.push(row);
    }

    return components;
  }

  /**
   * Create map with the current state of the game
   * @returns {string} Map with the current state of the game
   */
  createBoard() {
    return (
      '----------------\n' +
      this.board.map((row) => '  | ' + row.join('  |  ') + ' |  ').join('\n') +
      '\n----------------' +
      '\n'
    );
  }

  /**
   *  Collect interactions from the players
   * @returns {Promise<{row: number, column: number}>} The row and column selected by the player
   */
  async collectInteraction() {
    //Fetch the reply
    let msg = await fetchReply(this.inter);

    //Return a promise that resolves with the {row, column} chosen when the player interacts with the game
    return new Promise(async (resolve, reject) => {
      // Ignore bot interactions and interactions that are not game buttons
      const filter = (i) =>
        !i.user.bot && JSON.parse(i.customId).row !== undefined && JSON.parse(i.customId).column !== undefined;
      const collector = await msg.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      // Listen for 'collect' event
      collector.on('collect', async (interaction) => {
        try {
          //Ignore interactions from other players
          if (interaction.user !== this.turn)
            return await reply(interaction, {
              content: literals.notYourTurn,
              ephemeral: true,
              deleteTime: 2,
            });

          // Stop collector and resolve Promise
          collector.stop();

          const row = JSON.parse(interaction.customId).row;
          const column = JSON.parse(interaction.customId).column;

          await reply(interaction, {
            content: literals.selected(`[${row},${column}]`),
            ephemeral: true,
            deleteTime: 2,
          });

          resolve({ row, column });
        } catch (error) {
          reject(error);
          collector.stop();
        }
      });

      // Listen for 'end' event
      // If the collector ends without collecting anything, the game is over
      collector.on('end', async (collected, reason) => {
        if (reason === 'time') resolve({});
      });
    });
  }
}
