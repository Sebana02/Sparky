import { useQueue } from 'discord-player';
import { commandErrorHandler } from '../../utils/error-handler.js';
import { reply } from '../../utils/interaction-utils.js';
import { fetchString } from '../../utils/language-utils.js';
import { ChatInputCommandInteraction, Client, Guild, GuildMember, Interaction } from 'discord.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';
import { IQueuePlayerMetadata } from '../../interfaces/metadata.interface.js';

/**
 * Literal object for the event
 */
const eventLit = {
  noDJRole: fetchString('interaction_create.no_dj_role'),
  noCommandsTrivia: fetchString('interaction_create.no_commands_trivia'),
  noVoiceChannel: fetchString('interaction_create.no_voice_channel'),
  noSameVoiceChannel: fetchString('interaction_create.no_same_voice_channel'),
};

/**
 * Event that is called when the bot receives an interaction
 */
export const event: IEvent = {
  event: 'interactionCreate',

  emitter: Emitter.Client,

  callback: async (client: Client, inter: Interaction): Promise<void> => {
    // If interaction is a chat input command
    if (inter.isChatInputCommand()) {
      //Get command and check if it exists
      const command: ICommand | undefined = globalThis.commands.get(inter.commandName);
      if (!command) throw new Error(`Command ${inter.commandName} not found`);
      const cmdInfo = `/${inter.commandName} ` + inter.options.data.map((opt) => `${opt.name}: ${opt.value}`).join(' ');

      // If command was executed in a guild
      if (inter.inGuild()) {
        // Get guild member and guild, if we are on a guild, member/guild should exist
        const guildMember = inter.member as GuildMember;
        const guild = inter.guild as Guild;

        // Check if command requires user to be in a voice channel
        if (command.voiceChannel && !(await hasVoiceChannelRequirements(inter, guildMember, guild))) return;

        // Check if command was executed on allowed channels
        if (config.app.guildConfig?.ignoreChannels?.includes(inter.channelId)) return;

        // Check if command was executed by allowed roles
        if (config.app.guildConfig?.ignoreRoles?.some((role) => guildMember.roles.cache.some((r) => r.id === role)))
          return;

        //Log interaction
        logger.info(
          `Command: ${cmdInfo} | User: ${inter.user.username} (id : ${inter.user}) | Guild: ${guild.name} (id : ${guild.id})`
        );

        //Execute command
        await commandErrorHandler(command, client, inter);
      }
      // If command was executed in DM and command is not blocked in DMs
      else if (!command.blockedInDMs) {
        //Log interaction
        logger.info(`Command: ${cmdInfo} | User: ${inter.user.username} (id : ${inter.user}) | DM`);

        //Execute command
        await commandErrorHandler(command, client, inter);
      }
    }
  },
};

/**
 * Validate if user meets the requirements to use a voice channel command
 * @param inter - The interaction object
 * @param guildMember - The guild member object
 * @returns A Promise that resolves to a boolean
 */
async function hasVoiceChannelRequirements(
  inter: ChatInputCommandInteraction,
  guildMember: GuildMember,
  guild: Guild
): Promise<boolean> {
  const djRole = config.app.guildConfig?.djRoleId;
  const memberRoles = guildMember.roles.cache;
  const voiceChannel = guildMember.voice.channel;
  const botVoiceChannel = guild.members.me?.voice.channel;

  if (djRole && !memberRoles.some((role) => role.id === djRole)) {
    await reply(inter, { content: eventLit.noDJRole, ephemeral: true }, 2);
    return false;
  }
  if (!voiceChannel) {
    await reply(inter, { content: eventLit.noVoiceChannel, ephemeral: true }, 2);
    return false;
  }
  if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id) {
    await reply(inter, { content: eventLit.noSameVoiceChannel, ephemeral: true }, 2);
    return false;
  }
  if (useQueue<IQueuePlayerMetadata>(guild)?.metadata.trivia) {
    await reply(inter, { content: eventLit.noCommandsTrivia, ephemeral: true }, 2);
    return false;
  }
  return true;
}
