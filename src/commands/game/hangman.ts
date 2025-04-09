import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  User,
  ButtonStyle,
  MessageComponentInteraction,
  DMChannel,
  Message,
  TextChannel,
} from 'discord.js';
import { deferReply, reply, fetchReply } from '@utils/interaction-utils.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { fetchString, fetchFunction, fetchArray } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('hangman.description'),
  optionName: fetchString('hangman.option.name'),
  optionDescription: fetchString('hangman.option.description'),
  choiceCustom: fetchString('hangman.option.choices.custom'),
  choiceRandom: fetchString('hangman.option.choices.random'),

  gatherPlayersEmbed: fetchFunction('hangman.gather_players.embed'),
  butttonJoin: fetchString('hangman.gather_players.buttons.join'),
  buttonExit: fetchString('hangman.gather_players.buttons.exit'),
  confirmationJoin: fetchString('hangman.gather_players.confirmation.join'),
  confirmationExit: fetchString('hangman.gather_players.confirmation.exit'),

  noPlayers: fetchString('hangman.checkings.no_players'),
  notEnoughPlayers: fetchString('hangman.checkings.not_enough_players'),

  wordlist: fetchArray('hangman.word_list'),

  customSelectPlayer: fetchFunction('hangman.custom_select_player'),
  gatherWordChosenOne: fetchFunction('hangman.gather_word.chosen_one'),
  noWordGivenDM: fetchString('hangman.gather_word.no_word_given.dm'),
  noWordGivenChannel: fetchFunction('hangman.gather_word.no_word_given.channel'),
  wordGivenValid: fetchString('hangman.gather_word.word_given.valid_word'),
  wordGivenInvalid: fetchString('hangman.gather_word.word_given.invalid_word'),
  wordGivenTooManyTries: fetchString('hangman.gather_word.word_given.too_many_tries'),

  noWordSelected: fetchString('hangman.no_word_selected'),

  progressLives: fetchString('hangman.progress.lives'),
  progressFaults: fetchString('hangman.progress.faults'),
  progressPlayers: fetchFunction('hangman.progress.players'),

  resultWinCustom: fetchFunction('hangman.results.custom.win'),
  resultWinRandom: fetchString('hangman.results.random.win'),
  resultLoseCustom: fetchFunction('hangman.results.custom.lose'),
  resultLoseRandom: fetchFunction('hangman.results.random.lose'),
  resultTimeout: fetchFunction('hangman.results.timeout'),
};

/**
 * Command that allows users to play hangman
 * Custom option allows a player to choose a word and the other players to guess it
 * Random option chooses a random word from a list and the players have to guess it
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option
        .setName(commandLit.optionName)
        .setDescription(commandLit.optionDescription)
        .setRequired(true)
        .addChoices(
          { name: commandLit.choiceCustom, value: 'custom' },
          { name: commandLit.choiceRandom, value: 'random' }
        )
    ),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Defer the reply
    await deferReply(inter, { ephemeral: false });

    // Gather players
    let players = await gatherPlayers(inter);

    // Get the game type
    const gameType = inter.options.getString(commandLit.optionName, true);

    //Check if enough players have joined
    if (players.length == 0) return await reply(inter, { content: commandLit.noPlayers }, 2);
    if (gameType === 'custom' && players.length < 2)
      return await reply(inter, { content: commandLit.notEnoughPlayers }, 2);

    //Choose word according to game type
    let wordSelection: WordSelection = { word: '', selector: undefined };
    switch (gameType) {
      //random word
      case 'random':
        wordSelection = {
          word: commandLit.wordlist[Math.floor(Math.random() * commandLit.wordlist.length)],
          selector: undefined,
        };
        break;

      //ask a player to choose a word
      case 'custom':
        // Inform the players that a word is being chosen
        await reply(inter, { content: commandLit.customSelectPlayer(players.length) });

        // Get word from players
        wordSelection = await getWordFromPlayer(players, inter);

        break;
    }

    // Check if a word was chosen
    if (!wordSelection.word) return await reply(inter, { content: commandLit.noWordSelected }, 2);

    //Create the game
    let hangmanGame: Game = {
      wordSelection: wordSelection,
      lives: 6,
      progress: '-'.repeat(wordSelection.word.length),
      remaining: wordSelection.word.length,
      misses: [],
      status: GameStatus.inProgress,
    };

    //Show the progress
    await showProgress(inter, hangmanGame, players);

    // Handle the interaction
    await handleInteraction(inter, hangmanGame, players);
  },
};

/**
 * Type for the user selection
 */
type WordSelection = {
  word: string;
  selector: User | undefined;
};

/**
 * Type for the game
 */
type Game = {
  wordSelection: WordSelection;
  lives: number;
  progress: string;
  remaining: number;
  misses: string[];
  status: GameStatus;
};

/**
 * Array with the hangman figures
 */
const gameFigures = [
  ` +---+\n |   |      \n     |\n     |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n     |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n |   |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|   |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|\\  |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|\\  |      \n/    |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|\\  |      \n/ \\  |      \n     |\n==========  `,
];

/**
 * Represents the status of the game
 */
enum GameStatus {
  lose = 0,
  inProgress = 1,
  win = 2,
}

/**
 * Function to gather players
 * @param inter The interaction of the command
 * @returns The list of players
 */
async function gatherPlayers(inter: ChatInputCommandInteraction): Promise<User[]> {
  // Time to wait for players to join
  const time = 10;

  // Initial message and buttons to join the game
  const initialMessage = createEmbed({
    color: ColorScheme.game,
    footer: {
      text: commandLit.gatherPlayersEmbed(time),
      icon_url: inter.user.displayAvatarURL(),
    },
  });

  // Create the action row with the buttons
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel(commandLit.butttonJoin).setCustomId('join').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setLabel(commandLit.buttonExit).setCustomId('exit').setStyle(ButtonStyle.Secondary)
  );

  // Send initial message
  await reply(inter, { embeds: [initialMessage], components: [row] });

  // Fetch the reply
  const replyMessage = await fetchReply(inter);

  //Create a collector to gather players
  const collector = await replyMessage.createMessageComponentCollector({
    filter: (interaction: MessageComponentInteraction) =>
      interaction.isButton() && (interaction.customId === 'join' || interaction.customId === 'exit'),
    time: time * 1000,
  });

  //Return a promise that resolves with the list of players when the collector ends
  return await new Promise<User[]>((resolve, reject) => {
    //List of players
    let players: User[] = [];

    collector.on('collect', (i) => {
      //Player wants to join
      if (i.customId === 'join') {
        //Add player to the list if they haven't joined yet
        if (!players.find((player) => player.id === i.user.id)) players.push(i.user);

        //Reply to the player
        reply(i, { content: commandLit.confirmationJoin, ephemeral: true }, 2);
      }

      //Player doesn't want to join
      else if (i.customId === 'exit') {
        //Remove player from the list
        players = players.filter((player) => player.id != i.user.id);

        //Reply to the player
        reply(i, { content: commandLit.confirmationExit, ephemeral: true }, 2);
      }
    });

    //Resolve the promise when the collector ends
    collector.on('end', () => {
      resolve(players);
    });
  }).catch((error) => {
    throw error;
  });
}

/**
 * Function to get the next message from a DM channel
 * @param channel The DM channel
 * @param maxTime The time to wait for the message in milliseconds
 * @returns The message
 */
async function getNextMessage(channel: DMChannel, maxTime: number): Promise<Message | undefined> {
  return await channel
    .awaitMessages({
      filter: (msg: Message) => !msg.author.bot,
      max: 1,
      time: maxTime,
      errors: ['time'],
    })
    .then((collected) => collected?.first());
}

/**
 * Function to get the word from a player
 * @param players The list of players
 * @param inter The interaction of the command
 * @returns The word and the player that chose it (if any)
 */
async function getWordFromPlayer(players: User[], inter: ChatInputCommandInteraction): Promise<WordSelection> {
  // Word and player that chose it
  let wordSelection: WordSelection = { word: '', selector: undefined };

  // Array with the possible selectors
  let possibleSelectors = [...players];

  // While no word is chosen and there are possible selectors
  while (!wordSelection.word && possibleSelectors.length > 0) {
    //Choose a player and remove them from the list
    const chosenOne = possibleSelectors.splice(Math.floor((Math.random() * 1000) % possibleSelectors.length), 1)[0];

    // Time to wait for the player to choose a word
    const time = 30;

    //Send a DM to the player
    const dmChannel = await chosenOne.createDM();
    await dmChannel.send(commandLit.gatherWordChosenOne(time));

    // Max tries to get the word
    const maxTries = 3;

    //Get the word from the player, 3 tries
    for (let tries = 0; tries < maxTries; tries++) {
      //Try to get the word from the player
      const playerMessage = await getNextMessage(dmChannel, time * 1000);

      // Word given by the player, check if it's valid
      if (!playerMessage) {
        await dmChannel.send(commandLit.noWordGivenDM);
        await reply(inter, { content: commandLit.noWordGivenChannel(chosenOne) });
        break;
      }
      //Check if the message is a valid word, if not, try again up to 3 times
      const msg = playerMessage.content.toLowerCase();
      if (msg.match(`^[A-Za-zÀ-ú]{3,}$`)) {
        // Set the word and the player that chose it
        wordSelection = { word: msg, selector: chosenOne };

        // Remove the player from the list of players
        players = players.filter((p) => p.id !== chosenOne.id);

        // Send a message to the player
        await dmChannel.send(commandLit.wordGivenValid);
        break;
      } else {
        // Send a message to the player
        await dmChannel.send(commandLit.wordGivenInvalid);
        if (tries == maxTries - 1) await dmChannel.send(commandLit.wordGivenTooManyTries);
        continue;
      }
    }
  }

  //Return the word and the player that chose it (if any)
  return wordSelection;
}

/**
 * Guesses a letter in the word
 * @param game The game object
 * @param letter The letter to guess
 */
function guess(game: Game, letter: string) {
  // If the letter is not in the progress and is in the word, update progress
  if (!game.progress.includes(letter) && game.wordSelection.word.includes(letter)) {
    game.wordSelection.word.split('').forEach((char: string, index: number) => {
      if (char === letter) {
        game.progress = replaceAt(game.progress, index, letter);
        if (--game.remaining == 0) game.status = GameStatus.win;
      }
    });
  } // If letter was not in misses, add it, and check if the game is over
  else if (!game.misses.includes(letter)) {
    game.misses.push(letter);
    if (--game.lives == 0) game.status = GameStatus.lose;
  }
}

/**
 * Guesses the whole word
 * @param game The game object
 * @param word The word to guess
 */
function guessAll(game: Game, word: string) {
  // If the word is correct, update progress and set status to win
  if (game.wordSelection.word === word) {
    game.progress = game.wordSelection.word;
    game.remaining = 0;
    game.status = GameStatus.win;
  } // If the word is incorrect, add it to misses and check if the game is over
  else if (--game.lives == 0) {
    game.status = GameStatus.lose;
  }
}

/**
 * Replaces a portion of a string at a specified index with a new string.
 * @param string The original string
 * @param index The index at which to replace
 * @param replacement The string to insert
 * @returns The modified string
 */
function replaceAt(string: string, index: number, replacement: string) {
  return string.slice(0, index) + replacement + string.slice(index + replacement.length);
}

/**
 * Shows the progress of the game
 * @param inter The interaction of the command
 * @param game The game object
 * @param players The players of the game
 */
async function showProgress(inter: ChatInputCommandInteraction, game: Game, players: User[]): Promise<void> {
  //Set the information to show in the screen and create embed
  const gameEmbed = createEmbed({
    description: '```\n' + gameFigures[6 - game.lives] + `\n${game.progress}` + '\n```',
    color: ColorScheme.game,
    fields: [
      {
        name: commandLit.progressLives,
        value: '💖 '.repeat(game.lives) + '🖤 '.repeat(6 - game.lives),
        inline: true,
      },
      {
        name: commandLit.progressFaults,
        value: game.misses.join(' '),
        inline: true,
      },
    ],
    footer: {
      text: commandLit.progressPlayers(players.map((p) => p.username).join(', ')),
    },
  });

  await reply(inter, { embeds: [gameEmbed], components: [] });
}

/**
 * Shows the result of the game
 * @param inter The interaction of the command
 * @param game The game object
 * @param selector The player that chose the word
 */
async function showResult(inter: ChatInputCommandInteraction, game: Game): Promise<void> {
  //Set the message according to the game status
  let msg = '';
  if (game.status === GameStatus.win) {
    msg = game.wordSelection.selector
      ? commandLit.resultWinCustom(game.wordSelection.selector.username)
      : commandLit.resultWinRandom;
  } else if (game.status === GameStatus.lose) {
    msg = game.wordSelection.selector
      ? commandLit.resultLoseCustom(game.wordSelection.selector.username, game.wordSelection.word)
      : commandLit.resultLoseRandom(game.wordSelection.word);
  } else msg = commandLit.resultTimeout(game.wordSelection.word);

  //Create embed
  const embed = createEmbed({
    description: '```\n' + gameFigures[6 - game.lives] + `\n${game.progress}` + '\n```',
    color: ColorScheme.game,
    fields: [
      {
        name: commandLit.progressLives,
        value: '💖 '.repeat(game.lives) + '🖤 '.repeat(6 - game.lives),
        inline: true,
      },
      {
        name: commandLit.progressFaults,
        value: game.misses.join(' '),
        inline: true,
      },
    ],
    footer: { text: msg },
  });

  //Show the result
  await reply(inter, { embeds: [embed], components: [] });
}

/**
 * Handles the interaction for the game
 * @param inter The interaction of the command
 * @param game The game object
 * @param players The players of the game
 */
async function handleInteraction(inter: ChatInputCommandInteraction, game: Game, players: User[]): Promise<void> {
  //Create a collector for the messages
  const collector = (inter.channel as TextChannel).createMessageCollector({
    filter: (message: Message) => !!players.find((p) => p.id === message.author.id),
    time: 10 * 1000 * 60, // max of 10 minutes per game
  });

  collector.on('collect', async (message) => {
    //Get letter, erase message and check if it's a valid letter
    if (message.content.match(`^[A-Za-zÀ-ú]{1,}$`)) {
      const c = message.content.toLowerCase();
      await message.delete();

      //If the letter is more than one character, guess the whole word and remove the player from the list
      if (c.length > 1) {
        guessAll(game, c);
        players = players.splice(
          players.findIndex((player) => message.author.id == player.id),
          1
        );
      }
      //Guess the letter e.o.c.
      else {
        guess(game, c);
      }

      //Show the progress
      await showProgress(inter, game, players);

      //Check if the game has ended, if so, stop the collectors
      if (game.status !== GameStatus.inProgress) {
        collector.stop();
      } else if (players.length < 1) {
        collector.stop();
        game.status = GameStatus.lose;
      }
    }
  });

  // Show the result
  collector.on('end', async () => {
    await showResult(inter, game);
  });
}
