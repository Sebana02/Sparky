import { ChatInputCommandInteraction, EmbedData } from 'discord.js';
import { ColorScheme } from '@utils/embed-utils.js';
import { fetchFunction } from '@utils/language-utils.js';

/**
 * Literal object for utility embeds
 */
const utilityLit = {
  remindMessage: fetchFunction('remind.response'),
};

/**
 * Utility embed preset for remind command
 * @param inter The interaction object
 * @param reminder The reminder message
 * @returns The remind embed
 */
export function remind(inter: ChatInputCommandInteraction, reminder: string): EmbedData {
  return {
    description: reminder,
    color: ColorScheme.utility,
    footer: {
      text: utilityLit.remindMessage(inter.user.tag),
      iconURL: inter.user.displayAvatarURL(),
    },
    timestamp: Date.now(),
  };
}
