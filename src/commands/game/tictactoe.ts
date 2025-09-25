import {
  ButtonBuilder,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  User,
  EmbedBuilder,
  ButtonStyle,
  MessageComponentInteraction,
  MessageFlags,
} from 'discord.js';
import { createEmbed, modifyEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { reply, deferReply, fetchReply, update } from '@utils/interaction-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('tictactoe.description'),
  optionName: fetchString('tictactoe.option.name'),
  optionDescription: fetchString('tictactoe.option.description'),

  checkAgainstBot: fetchString('tictactoe.checkings.against_bot'),
  checkAgainstSelf: fetchString('tictactoe.checkings.against_self'),

  turn: fetchFunction('tictactoe.turn'),
  notYourTurn: fetchString('tictactoe.select.not_your_turn'),
  selected: fetchFunction('tictactoe.select.selected'),

  timeout: fetchString('tictactoe.results.timeout'),
  win: fetchFunction('tictactoe.results.win'),
  draw: fetchString('tictactoe.results.draw'),
};

/**
 * Command that allows user to play tic tac toe with a friend
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('tictactoe')
    .setDescription(commandLit.description)
    .addUserOption((option) =>
      option.setName(commandLit.optionName).setDescription(commandLit.optionDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the opponent and check if it is a bot or the author of the interaction
    const opponent = inter.options.getUser(commandLit.optionName, true);
    if (opponent.bot)
      return await reply(inter, { content: commandLit.checkAgainstBot, flags: MessageFlags.Ephemeral }, 2);
    if (opponent === inter.user)
      return await reply(inter, { content: commandLit.checkAgainstSelf, flags: MessageFlags.Ephemeral }, 2);

    //Defer the reply
    await deferReply(inter, { flags: MessageFlags.Ephemeral });

    //Define the players object
    const players: Player[] = [
      { user: inter.user, symbol: BoxSymbol.X },
      { user: opponent, symbol: BoxSymbol.O },
    ];

    //Define the turn
    let turn: Turn = BoxSymbol.X;

    //Define the board
    let board: BoxSymbol[][] = [
      [BoxSymbol.Blank, BoxSymbol.Blank, BoxSymbol.Blank],
      [BoxSymbol.Blank, BoxSymbol.Blank, BoxSymbol.Blank],
      [BoxSymbol.Blank, BoxSymbol.Blank, BoxSymbol.Blank],
    ];

    //Send the message
    await reply(inter, {
      embeds: [generateEmbed(board, players, turn)],
      components: createActionRows(board),
    });

    await handleInteraction(inter, board, players, turn);
  },
};

type Turn = Exclude<BoxSymbol, BoxSymbol.Blank>;

/**
 * Player object
 */
type Player = {
  user: User;
  symbol: Turn;
};

/**
 * Box symbols for the game
 */
enum BoxSymbol {
  X = '❌',
  O = '⭕',
  Blank = '⬜',
}

/**
 * Check if the cell is valid
 * @param board The board of the game
 * @param row row of the cell
 * @param column The column of the cell
 * @returns Whether the cell is valid
 */
function isValidCell(board: BoxSymbol[][], row: number, column: number): boolean {
  return board[row][column] === BoxSymbol.Blank;
}

/**
 * Check if the player has won
 * @param board The board of the game
 * @param symbol The symbol of the player
 * @returns Whether the player has won
 */
function hasWon(board: BoxSymbol[][], symbol: BoxSymbol): boolean {
  // Check for horizontal and vertical lines
  for (let i = 0; i < board.length; i++) {
    if (
      (board[i][0] === symbol && board[i][1] === symbol && board[i][2] === symbol) ||
      (board[0][i] === symbol && board[1][i] === symbol && board[2][i] === symbol)
    ) {
      return true;
    }
  }

  // Check for diagonal lines
  if (
    (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) ||
    (board[2][0] === symbol && board[1][1] === symbol && board[0][2] === symbol)
  ) {
    return true;
  }

  //No winner
  return false;
}

/**
 * Check if the game is a draw
 * @param board The board of the game
 * @returns Whether the game is a draw
 */
function isDraw(board: BoxSymbol[][]): boolean {
  return board.every((row) => row.every((cell) => cell !== BoxSymbol.Blank));
}

/**
 * Generates an embed for the game
 * @param board The board of the game
 * @param players The players of the game
 * @param turn The current turn
 * @returns The embed for the game
 */
function generateEmbed(board: BoxSymbol[][], players: Player[], turn: Turn): EmbedBuilder {
  // Parse the board into a string
  const boardString =
    '---------------\n| ' +
    board.map((row) => row.join('  |  ')).join(' | \n---------------\n | ') +
    ' | \n---------------' +
    '\n';

  //Get the player's turn
  const player = players.find((player) => player.symbol === turn);

  // Create the embed
  return createEmbed({
    title: 'Tic Tac Toe',
    description: boardString,
    footer: {
      text: commandLit.turn(player?.user.username),
      icon_url: player?.user.displayAvatarURL(),
    },
    color: ColorScheme.game,
  });
}

/**
 * Creates the buttons for the game
 * @param board The board of the game
 * @returns The action rows with the buttons
 */
function createActionRows(board: BoxSymbol[][]): ActionRowBuilder<ButtonBuilder>[] {
  //Create the icons for the buttons
  const icons = ['🡤', '🡡', '🡥', '🡠', '▪', '🡢', '🡧', '🡣', '🡦'];

  //Create the buttons
  const buttons = icons.map((value, index) =>
    new ButtonBuilder()
      .setLabel(value)
      .setCustomId(index.toString())
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!isValidCell(board, Math.floor(index / 3), index % 3))
  );

  //Distribution of the buttons in 3x3 grid (3 rows
  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(0, 3)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(3, 6)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(6, 9)),
  ];
}

/**
 * Handles the interaction for the game
 * @param inter The interaction of the command
 * @param board The board of the game
 * @param players The players of the game
 * @param turn The current turn
 */
async function handleInteraction(
  inter: ChatInputCommandInteraction,
  board: BoxSymbol[][],
  players: Player[],
  turn: Turn
): Promise<void> {
  //Fetch the reply
  const replyMessage = await fetchReply(inter);
  const collector = replyMessage.createMessageComponentCollector({
    filter: (interaction: MessageComponentInteraction) =>
      interaction.isButton() && players.some((person) => person.user === interaction.user),
    time: 15000,
  });

  collector.on('collect', async (interaction: MessageComponentInteraction) => {
    // Check if it is the player's turn
    if (players.find((player) => player.user === interaction.user)?.symbol !== turn)
      return reply(interaction, { content: commandLit.notYourTurn, flags: MessageFlags.Ephemeral }, 2);

    // Get the row and column of the cell
    const index = parseInt(interaction.customId);
    const row = Math.floor(index / 3);
    const column = index % 3;

    // Update the board
    board[row][column] = turn;

    // Check if player won or there is draw
    const playerWon = hasWon(board, turn);
    const draw = isDraw(board);
    if (playerWon || draw) {
      // Update the embed
      const gameEmbed = modifyEmbed(generateEmbed(board, players, turn), {
        footer: {
          text: playerWon ? commandLit.win(interaction.user.username) : commandLit.draw,
          icon_url: interaction.user.displayAvatarURL(),
        },
      });

      //Update interaction
      await update(interaction, { embeds: [gameEmbed], components: [] });

      //Stop collector
      return collector.stop();
    }

    // Change the turn
    turn = turn === BoxSymbol.X ? BoxSymbol.O : BoxSymbol.X;

    // Update the embed
    await update(interaction, {
      embeds: [generateEmbed(board, players, turn)],
      components: createActionRows(board),
    });

    //Reset the timer
    collector.resetTimer();
  });

  collector.on('end', async () => {
    if (collector.endReason === 'time') {
      await reply(inter, { content: commandLit.timeout, flags: MessageFlags.Ephemeral, embeds: [], components: [] }, 2);
    }
  });
}
