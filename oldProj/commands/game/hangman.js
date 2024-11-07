const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { deferReply, reply, fetchReply } = require('@utils/interaction-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Preload literals
const literals = {
  description: fetchCommandLit('game.hangman.description'),
  optionName: fetchCommandLit('game.hangman.option.name'),
  optionDescription: fetchCommandLit('game.hangman.option.description'),
  choiceCustom: fetchCommandLit('game.hangman.option.choices.custom'),
  choiceRandom: fetchCommandLit('game.hangman.option.choices.random'),

  gatherPlayersEmbed: (time) => fetchCommandLit('game.hangman.gather_players.embed', time),
  butttonJoin: fetchCommandLit('game.hangman.gather_players.buttons.join'),
  buttonExit: fetchCommandLit('game.hangman.gather_players.buttons.exit'),
  confirmationJoin: fetchCommandLit('game.hangman.gather_players.confirmation.join'),
  confirmationExit: fetchCommandLit('game.hangman.gather_players.confirmation.exit'),

  noPlayers: fetchCommandLit('game.hangman.checkings.no_players'),
  notEnoughPlayers: fetchCommandLit('game.hangman.checkings.not_enough_players'),

  wordlist: fetchCommandLit('game.hangman.word_list'),

  customSelectPlayer: (playersNumber) => fetchCommandLit('game.hangman.custom_select_player', playersNumber),
  gatherWordChosenOne: (time) => fetchCommandLit('game.hangman.gather_word.chosen_one', time),
  noWordGivenDM: fetchCommandLit('game.hangman.gather_word.no_word_given.dm'),
  noWordGivenChannel: (player) => fetchCommandLit('game.hangman.gather_word.no_word_given.channel', player),
  wordGivenValid: fetchCommandLit('game.hangman.gather_word.word_given.valid_word'),
  wordGivenInvalid: fetchCommandLit('game.hangman.gather_word.word_given.invalid_word'),
  wordGivenTooManyTries: fetchCommandLit('game.hangman.gather_word.word_given.too_many_tries'),
  wordGivenNoPlayersLeft: fetchCommandLit('game.hangman.gather_word.word_given.no_players_left'),

  startError: fetchCommandLit('game.hangman.start_error'),

  progressLives: fetchCommandLit('game.hangman.progress.lives'),
  progressFaults: fetchCommandLit('game.hangman.progress.faults'),
  progressPlayers: (players) => fetchCommandLit('game.hangman.progress.players', players),

  resultWinCustom: (winner) => fetchCommandLit('game.hangman.results.custom.win', winner),
  resultWinRandom: fetchCommandLit('game.hangman.results.random.win'),
  resultLoseCustom: (loser, word) => fetchCommandLit('game.hangman.results.custom.lose', loser, word),
  resultLoseRandom: (word) => fetchCommandLit('game.hangman.results.random.lose', word),
  resultTimeout: fetchCommandLit('game.hangman.results.timeout'),
}

/**
 * Command for playing hangman
 * Two types of games: custom and random
 * Custom: players choose a word
 * Random: bot chooses a word
 */
module.exports = {
  name: 'hangman',
  description: literals.description,
  options: [
    {
      name: literals.optionName,
      description: literals.optionDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: literals.choiceCustom, value: 'custom' },
        { name: literals.choiceRandom, value: 'random' },
      ],
    },
  ],
  run: async (client, inter) => {
    //Defer the reply
    await deferReply(inter)

    //Create the game
    const gameInfo = await startGame(inter)

    if (!gameInfo) return

    //Run the game
    await runGame(inter, gameInfo.game, gameInfo.players)

    //Show the result
    await showResult(inter, gameInfo.game, gameInfo.selector)
  },
}

/**
 * Replaces a character in a string at a given index
 * @param {number} index
 * @param {string} replacement
 * @returns
 */
String.prototype.replaceAt = function (index, replacement) {
  return this.slice(0, index) + replacement + this.slice(index + replacement.length)
}

/**
 * Class for the hangman game
 */
class hangman {
  /**
   * Represents the status of the game
   */
  static gameStatus = {
    lose: 0,
    inProgress: 1,
    win: 2,
  };

  constructor(word) {
    this.word = word //word to guess
    this.lives = 6 //lives
    this.progress = '-'.repeat(word.length) //progress
    this.remaining = word.length //remaining letters to guess
    this.misses = [] //misses
    this.status = hangman.gameStatus.inProgress //game status
  }

  /**
   * Guess a letter
   * @param {string} c - Letter to guess
   */
  guess(c) {
    if (this.progress.includes(c)) {
      //letter already guessed
      --this.lives
    } else if (this.word.includes(c)) {
      //letter is in the word, update progress
      for (let i = 0; i < this.word.length; ++i) {
        if (this.word[i] === c) {
          this.progress = this.progress.replaceAt(i, this.word[i])
          --this.remaining
        }
      }
    } else {
      //letter is not in the word, add to misses
      if (!this.misses.includes(c)) {
        this.misses.push(c)
      }
      --this.lives
    }

    //update game status
    if (this.lives == 0) this.status = hangman.gameStatus.lose
    else if (this.remaining == 0) this.status = hangman.gameStatus.win
  }

  /**
   * Guess the whole word
   * @param {string} word word to guess
   */
  guessAll(word) {
    if (this.word === word) {
      //word is guessed
      this.progress = this.word
      this.remaining = 0
      this.status = hangman.gameStatus.win
    } else {
      //word is not guessed
      if (--this.lives == 0) this.status = hangman.gameStatus.lose
    }
  }
}

// Hangman figure to show the progress of the game
const figure = [
  ` +---+\n |   |      \n     |\n     |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n     |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n |   |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|   |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|\\  |      \n     |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|\\  |      \n/    |      \n     |\n==========  `,
  ` +---+\n |   |      \n O   |\n/|\\  |      \n/ \\  |      \n     |\n==========  `,
]

/**
 * Function to start the game
 * @param {Interaction} inter
 * @returns {object} game - The game object
 */
async function startGame(inter) {
  //gather players and game type
  const players = await gatherPlayers(inter)
  const gameType = inter.options.getString(literals.optionName)

  //check if enough players have joined
  if (players.length == 0)
    return await reply(inter, {
      content: literals.noPlayers,
      embeds: [],
      components: [],
      deleteTime: 2,
    })

  if (gameType === 'custom' && players.length < 2)
    return await reply(inter, {
      content: literals.notEnoughPlayers,
      embeds: [],
      components: [],
      deleteTime: 2,
    })

  //choose word according to game type
  let word, selector
  switch (gameType) {
    //random word
    case 'random':
      word = literals.wordlist[Math.floor(Math.random() * literals.wordlist.length)]
      break

    //ask a player to choose a word
    case 'custom':
      await reply(inter, {
        content: literals.customSelectPlayer(players.length),
        embeds: [],
        components: [],
      })

      //get word from players
      let userSelection = await getWordFromPlayers(players, inter)

      //check if a word was chosen
      if (!userSelection || !userSelection.word || !userSelection.selector) return

      //set word and selector
      word = userSelection.word
      selector = userSelection.selector

      break
  }

  //create the game
  const game = new hangman(word)

  //If created successfully, run the game, else show error message
  if (!(game && players))
    return await reply(inter, {
      content: literals.startError,
      embeds: [],
      deleteTime: 2,
    })

  //return the game object
  return {
    game,
    players,
    selector,
  }
}

/**
 * Function to gather players
 * @param {Interaction} inter
 * @returns {Promise<Array>} The players that have joined the game
 */
async function gatherPlayers(inter) {
  //Time to wait for players to join
  const time = 10

  //Initial message and buttons to join the game
  const embed = createEmbed({
    color: ColorScheme.game,
    footer: {
      text: literals.gatherPlayersEmbed(time),
      icon_url: inter.user.displayAvatarURL(),
    },
  })

  const join = new ButtonBuilder()
    .setLabel(literals.butttonJoin)
    .setCustomId(JSON.stringify({ type: 'join' }))
    .setStyle('Primary')

  const exit = new ButtonBuilder()
    .setLabel(literals.buttonExit)
    .setCustomId(JSON.stringify({ type: 'exit' }))
    .setStyle('Secondary')

  const row = new ActionRowBuilder().addComponents(join, exit)

  //Send initial message
  await reply(inter, { embeds: [embed], components: [row] })
  let msg = await fetchReply(inter)

  //Create a collector to gather players
  const filter = (i) => JSON.parse(i.customId).type === 'join' || JSON.parse(i.customId).type === 'exit'
  const collector = await msg.createMessageComponentCollector({
    filter,
    time: time * 1000,
  })

  //Return a promise that resolves with the list of players when the collector ends
  return await new Promise((resolve, reject) => {
    //List of players
    let players = []

    collector.on('collect', (i) => {
      try {
        //Player wants to join
        if (JSON.parse(i.customId).type === 'join') {
          //Add player to the list if they haven't joined yet
          if (!players.find((p) => p.id === i.user.id)) players.push(i.user)

          //Reply to the player
          reply(i, {
            content: literals.confirmationJoin,
            ephemeral: true,
            deleteTime: 2,
            propagate: false,
          })
        }

        //Player doesn't want to join
        else if (JSON.parse(i.customId).type === 'exit') {
          //Remove player from the list
          players = players.filter((p) => p.id != i.user.id)

          //Reply to the player
          reply(i, {
            content: literals.confirmationJoin,
            ephemeral: true,
            deleteTime: 2,
            propagate: false,
          })
        }
      } catch (error) {
        collector.stop()
        reject(error)
      }
    })

    //Resolve the promise when the collector ends
    collector.on('end', () => {
      resolve(players)
    })
  }).catch((error) => {
    throw error
  })
}

/**
 * Function to get a word from a player
 * @param {Array} players - The players that have joined the game
 * @param {Interaction} inter
 * @returns {object} The word and the player that chose it
 */
async function getWordFromPlayers(players, inter) {
  //If no word is chosen and there is more than one player, choose a player to select a word
  let word, chosenOne
  while (!word && players.length > 1) {
    //Choose a player
    let index = Math.floor((Math.random() * 1000) % players.length)
    chosenOne = players[index]
    players = players.splice(index, 1)

    // Time to wait for the player to choose a word
    const time = 30

    //Send a DM to the player
    const dm = await chosenOne.createDM()
    await dm.send(literals.gatherWordChosenOne(time))

    //Get the word from the player, if the player doesn't respond in time or makes more than 3 tries, choose another player
    let finish = false
    let tries = 0
    let msgCollection
    while (!finish && tries < 3) {
      //Try to get the word from the player
      try {
        msgCollection = await getNextMessage(dm, time * 1000)
      } catch (collected) {
        await dm.send(literals.noWordGivenDM)
        await reply(inter, {
          content: literals.noWordGivenChannel(chosenOne),
        })
        finish = true
        continue
      }

      //Check if the message is a valid word, if not, try again up to 3 times
      const msg = msgCollection.first().content
      if (msg.match(`^[A-Za-zÀ-ú]{3,}$`)) {
        word = msg.toLowerCase()
        finish = true
        await dm.send(literals.wordGivenValid)
      } else {
        await dm.send(literals.wordGivenInvalid)
        if (++tries == 3) await dm.send(literals.wordGivenTooManyTries)
      }
    }
  }

  //If no word is chosen and there is only one player left, return
  if (!word && players.length <= 1)
    return await reply(inter, {
      content: literals.wordGivenNoPlayersLeft,
      embeds: [],
      components: [],
      deleteTime: 2,
    })

  //Return the word and the player that chose it
  return {
    word: word,
    selector: chosenOne,
  }
}

/**
 * Function to get the next message from a channel
 * @param {TextChannel} channel - The channel to get the message from
 * @param {number} maxTime - The maximum time to wait for a message
 * @returns {Promise<Message>} The message
 *
 */
async function getNextMessage(channel, maxTime) {
  const filter = (msg) => !msg.author.bot
  return await channel.awaitMessages({
    filter,
    max: 1,
    time: maxTime,
    errors: ['time'],
  })
}

/**
 * Function to run the game
 * @param {Interaction} inter
 * @param {hangman} game
 * @param {Array} players
 * @returns {Promise} A promise that resolves when the game ends
 */
async function runGame(inter, game, players) {
  //Show the progress
  await showProgress(inter, game, players)

  //Create a collector for the messages
  const filterM = (m) => !m.author.bot && players.find((p) => p.id === m.author.id)
  const collector = await inter.channel.createMessageCollector({
    filter: filterM,
    time: 10 * 1000 * 60,
  }) // max of 10 minutes per game

  //Return a promise that resolves when the game ends
  return new Promise((resolve, reject) => {
    //Message collector
    collector.on('collect', async (m) => {
      try {
        //Get letter, erase message and check if it's a valid letter
        if (m.content.match(`^[A-Za-zÀ-ú]{1,}$`)) {
          const c = m.content.toLowerCase()
          await m.delete()

          //If the letter is more than one character, guess the whole word and remove the player from the list
          if (c.length > 1) {
            game.guessAll(c)
            players = players.splice(
              players.find((p) => m.author.id == p.id),
              1
            )
          } else {
            //Guess the letter e.o.c.
            game.guess(c)
          }

          //Show the progress
          await showProgress(inter, game, players)

          //Check if the game has ended, if so, stop the collectors
          if (game.status !== hangman.gameStatus.inProgress) {
            collector.stop()
          } else if (players.length < 1) {
            collector.stop()
            game.status = hangman.gameStatus.lose
          }
        }
      } catch (error) {
        collector.stop()
        reject(error)
      }
    })

    //End the game when the collectors end, resolve the promise and show the result
    collector.on('end', () => {
      resolve()
    })
  }).catch((error) => {
    throw error
  })
}

/**
 * Function to show the progress of the game
 * @param {Interaction} inter
 * @param {Array<ButtonBuilder>} buttonsObject
 * @param {hangman} game
 * @param {boolean} gameOver
 */
async function showProgress(inter, game, players) {
  //Set the information to show in the screen and create embed
  const embed = createEmbed({
    description: '```\n' + figure[6 - game.lives] + `\n${game.progress}` + '\n```',
    color: ColorScheme.game,
    fields: [
      {
        name: literals.progressLives,
        value: '💖 '.repeat(game.lives) + '🖤 '.repeat(6 - game.lives),
        inline: true,
      },
      {
        name: literals.progressFaults,
        value: game.misses.join(' '),
        inline: true,
      },
    ],
    footer: {
      text: literals.progressPlayers(players.map((p) => p.username).join(', ')),
    },
  })

  await reply(inter, { embeds: [embed] })
}

/**
 * Function to show the result of the game
 * @param {Interaction} inter
 * @param {hangman} game
 * @param {User} selector
 */
async function showResult(inter, game, selector) {
  //Set the message according to the game status
  let msg = ''
  if (game.status === hangman.gameStatus.win) {
    msg = selector ? literals.resultWinCustom(selector.username) : literals.resultWinRandom
  } else if (game.status === hangman.gameStatus.lose) {
    msg = selector ? literals.resultLoseCustom(selector.username, game.word) : literals.resultLoseRandom(game.word)
  } else msg = literals.resultTimeout

  //Create embed
  const embed = createEmbed({
    description: '```\n' + figure[6 - game.lives] + `\n${game.progress}` + '\n```',
    color: ColorScheme.game,
    fields: [
      {
        name: literals.progressLives,
        value: '💖 '.repeat(game.lives) + '🖤 '.repeat(6 - game.lives),
        inline: true,
      },
      {
        name: literals.progressFaults,
        value: game.misses.join(' '),
        inline: true,
      },
    ],
    footer: { text: msg },
  })

  //Show the result
  await reply(inter, { embeds: [embed], components: [] })
}
