import {
  ButtonBuilder,
  ActionRowBuilder,
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ButtonStyle,
  MessageComponentInteraction,
  User,
  EmbedBuilder,
} from 'discord.js';
import { reply, deferReply, fetchReply } from '../../utils/interaction-utils.js';
import { createEmbed, modifyEmbed, ColorScheme } from '../../utils/embed/embed-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from 'interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('rps.description'),
  optionName: fetchString('rps.option.name'),
  optionDescription: fetchString('rps.option.description'),
  checkAgainstBot: fetchString('rps.checkings.against_bot'),
  checkAgainstSelf: fetchString('rps.checkings.against_self'),
  selection: fetchFunction('rps.selection'),
  resultsTie: fetchString('rps.results.tie'),
  resultsWin: fetchFunction('rps.results.win'),
};

/**
 * Command that allows users to play rock, paper, scissors with a friend
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription(commandLit.description)
    .addUserOption((option) =>
      option.setName(commandLit.optionName).setDescription(commandLit.optionDescription).setRequired(true)
    ) as SlashCommandBuilder,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the opponent and check if it is a bot or the author of the interaction
    const opponent = inter.options.getUser(commandLit.optionName, true);
    if (opponent.bot) return await reply(inter, { content: commandLit.checkAgainstBot, ephemeral: true }, 2);
    if (opponent === inter.user)
      return await reply(inter, { content: commandLit.checkAgainstSelf, ephemeral: true }, 2);

    // Defer reply
    await deferReply(inter, { ephemeral: false });

    // Define players object
    const players: Player[] = [
      { user: inter.user, move: 'Rock', voted: false },
      { user: opponent, move: 'Rock', voted: false },
    ];

    // Create buttons and send the message
    let gameEmbed = generateEmbed(players);
    await reply(inter, { embeds: [gameEmbed], components: [createActionRow()] });

    // Handle the interaction
    await handleInteraction(inter, players, gameEmbed);
  },
};

/**
 * Player object
 */
type Player = {
  user: User;
  move: keyof typeof RPSMove;
  voted: boolean;
};

/**
 * Represents the choices available in the Rock, Paper, Scissors game.
 */
const RPSMove = {
  Rock: '🪨',
  Paper: '🗞️',
  Scissors: '✂️',
};

/**
 * Generates an embed for the game
 * @param players The players of the game
 * @returns The embed for the game
 */
function generateEmbed(players: Player[]): EmbedBuilder {
  return createEmbed({
    title: `${players[0].user.username} vs ${players[1].user.username}`,
    color: ColorScheme.game,
  });
}

/**
 * Creates an action row with buttons
 * @returns The action row with the buttons
 */
function createActionRow(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    Object.entries(RPSMove).map(([key, value]) =>
      new ButtonBuilder().setLabel(value).setCustomId(key).setStyle(ButtonStyle.Primary)
    )
  );
}

/**
 * Handles the interaction of the players
 * @param inter The interaction of the command
 * @param players The players of the game
 */
async function handleInteraction(
  inter: ChatInputCommandInteraction,
  players: Player[],
  embed: EmbedBuilder
): Promise<void> {
  const replyMessage = await fetchReply(inter);
  const collector = replyMessage.createMessageComponentCollector({
    filter: (interaction: MessageComponentInteraction) =>
      interaction.isButton() &&
      Object.keys(RPSMove).includes(interaction.customId) &&
      players.some((person) => person.user === interaction.user),
    time: 5000,
  });

  collector.on('collect', async (interaction: MessageComponentInteraction) => {
    // Get player move
    const move = interaction.customId as keyof typeof RPSMove;

    // Reply to the player with their move
    reply(interaction, { content: commandLit.selection(RPSMove[move]), ephemeral: true }, 2);

    // Store the move of the player
    players.forEach((player) => {
      if (player.user === interaction.user) {
        player.move = move;
        player.voted = true;
      }
    });

    // If all players have voted, stop
    if (players.every((player) => player.voted)) collector.stop();
  });

  // Show the result when the collector ends
  collector.on('end', () => {
    showResult(inter, players, embed);
  });
}

/**
 * Shows the result of the game
 * @param inter The interaction of the command
 * @param players The players of the game
 * @param embed The embed of the game
 */
async function showResult(inter: ChatInputCommandInteraction, players: Player[], embed: EmbedBuilder): Promise<void> {
  const gameMoves = `${players[0].user.username} ${RPSMove[players[0].move]} vs ${RPSMove[players[1].move]} ${players[1].user.username}`;

  // Modify the embed with the result
  if (players[0].move === players[1].move)
    modifyEmbed(embed, {
      description: commandLit.resultsTie,
      title: gameMoves,
    });
  else
    modifyEmbed(embed, {
      description:
        (players[0].move === 'Rock' && players[1].move === 'Scissors') ||
        (players[0].move === 'Scissors' && players[1].move === 'Paper') ||
        (players[0].move === 'Paper' && players[1].move === 'Rock')
          ? commandLit.resultsWin(players[0].user.username)
          : commandLit.resultsWin(players[1].user.username),
      title: gameMoves,
    });

  // Reply with the result
  await reply(inter, { embeds: [embed], components: [] });
}
