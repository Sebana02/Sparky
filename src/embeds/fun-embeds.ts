import { EmbedData, ChatInputCommandInteraction, User } from 'discord.js';
import { ColorScheme } from '@utils/embed-utils.js';
import { fetchArray, fetchFunction, fetchString } from '@utils/language-utils.js';

/**
 * Literal object for fun embeds
 */
const funLit = {
  catMessage: fetchFunction('cat.response'),

  dogMessage: fetchFunction('dog.response'),

  gifMessage: fetchFunction('gif.response'),

  hugTitle: fetchFunction('hug.response.description'),
  hugFooter: fetchFunction('hug.response.footer'),

  memeMessage: fetchFunction('meme.response'),

  pokeTitle: fetchFunction('poke.response.description'),
  pokeFooter: fetchFunction('poke.response.footer'),

  shutUpTitle: fetchFunction('shut_up.response.description'),
  shutUpFooter: fetchFunction('shut_up.response.footer'),

  slapTitle: fetchFunction('slap.response.description'),
  slapFooter: fetchFunction('slap.response.footer'),

  eightBallAnswers: fetchArray('8ball.response.answers'),
  eightBallFooter: fetchFunction('8ball.response.footer'),

  coinFlipFooter: fetchFunction('coin_flip.response.footer'),
  coinFlipHeads: fetchString('coin_flip.response.heads'),
  coinFlipTails: fetchString('coin_flip.response.tails'),
};

/**
 * Fun embed preset for cat command
 * @param inter The interaction object
 * @returns The cat embed
 */
export function cat(inter: ChatInputCommandInteraction): EmbedData {
  return {
    color: ColorScheme.fun,
    footer: {
      text: funLit.catMessage(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for dog command
 * @param inter The interaction object
 * @returns The dog embed
 */
export function dog(inter: ChatInputCommandInteraction): EmbedData {
  return {
    color: ColorScheme.fun,
    footer: {
      text: funLit.dogMessage(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for gif command
 * @param inter The interaction object
 * @param category The gif category
 * @returns The gif embed
 */
export function gif(inter: ChatInputCommandInteraction, category: string): EmbedData {
  return {
    color: ColorScheme.fun,
    footer: {
      text: funLit.gifMessage(inter.user.username, category),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for hug command
 * @param inter The interaction object
 * @param targetUser The user being hugged
 * @returns The hug embed
 */
export function hug(inter: ChatInputCommandInteraction, targetUser: User): EmbedData {
  return {
    color: ColorScheme.fun,
    description: funLit.hugTitle(targetUser),
    footer: {
      text: funLit.hugFooter(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for meme command
 * @param inter The interaction object
 * @returns The meme embed
 */
export function meme(inter: ChatInputCommandInteraction): EmbedData {
  return {
    color: ColorScheme.fun,
    footer: {
      text: funLit.memeMessage(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for poke command
 * @param inter The interaction object
 * @param targetUser The user being poked
 * @returns The poke embed
 */
export function poke(inter: ChatInputCommandInteraction, targetUser: User): EmbedData {
  return {
    color: ColorScheme.fun,
    description: funLit.pokeTitle(targetUser),
    footer: {
      text: funLit.pokeFooter(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for shut up command
 * @param inter The interaction object
 * @param targetUser The user being told to shut up
 * @returns The shut up embed
 */
export function shutUp(inter: ChatInputCommandInteraction, targetUser: User): EmbedData {
  return {
    color: ColorScheme.fun,
    description: funLit.shutUpTitle(targetUser),
    footer: {
      text: funLit.shutUpFooter(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for slap command
 * @param inter The interaction object
 * @param targetUser The user being slapped
 * @returns The slap embed
 */
export function slap(inter: ChatInputCommandInteraction, targetUser: User): EmbedData {
  return {
    color: ColorScheme.fun,
    description: funLit.slapTitle(targetUser),
    footer: {
      text: funLit.slapFooter(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for 8ball command
 * @param inter The interaction object
 * @param question The question
 * @returns The 8ball embed
 */
export function eightBall(inter: ChatInputCommandInteraction, question: string): EmbedData {
  return {
    title: `🎱 ${funLit.eightBallAnswers[Math.floor(Math.random() * funLit.eightBallAnswers.length)]}`,
    color: ColorScheme.fun,
    footer: {
      text: funLit.eightBallFooter(inter.user.username, question),
      iconURL: inter.user.displayAvatarURL(),
    },
  };
}

/**
 * Fun embed preset for coin flip command
 * @param inter The interaction object
 * @returns The coin flip embed
 */
export function coinFlip(inter: ChatInputCommandInteraction): EmbedData {
  return {
    footer: {
      text: funLit.coinFlipFooter(inter.user.username),
      iconURL: inter.user.displayAvatarURL(),
    },
    title: `${Math.random() < 0.5 ? funLit.coinFlipHeads : funLit.coinFlipTails}`,
    color: ColorScheme.fun,
  };
}
