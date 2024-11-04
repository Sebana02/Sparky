import { GuildQueue, useQueue } from 'discord-player';
import { commandErrorHandler } from '../../utils/error-handler.js';
import { reply } from '../../utils/interaction-utils.js';
import { fetchString } from '../../utils/language-utils.js';
import {
  Client,
  GuildMember,
  GuildMemberRoleManager,
  Interaction,
  PermissionsBitField,
  VoiceBasedChannel,
} from 'discord.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { IEvent } from '../../interfaces/event.interface.js';
import { IMetadata } from '../../interfaces/metadata.interface.js';

/**
 * Literal object for the event
 */
const eventLit = {
  noPermissions: fetchString('interaction_create.no_permissions'),
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

  /**
   * Callback function to be executed when the interactionCreate event is triggered
   * @param client - The discord client
   * @param inter - The interaction object
   * @returns A Promise that resolves when the function is done executing
   */
  callback: async (client: Client, inter: Interaction): Promise<void> => {
    // If interaction was on a guild, guild and member properties should be present
    if (!inter.guild || !inter.member) return;

    // If interaction is a chat input command, on a guild
    if (inter.isChatInputCommand()) {
      //Log interaction
      let cmdInfo = `/${inter.commandName} ` + inter.options.data.map((opt) => `${opt.name}: ${opt.value}`).join(' ');
      logger.info(
        `Command: ${cmdInfo} | User: ${inter.user.username} (id : ${inter.user}) | Guild: ${inter.guild.name} (id : ${inter.guildId})`
      );

      //Get command
      const command: ICommand = globalThis.commands.get(inter.commandName);

      //Check if command exists
      if (!command) throw new Error(`Command ${inter.commandName} not found`);

      // Check command permissions
      if (command.permissions && !(inter.member.permissions as PermissionsBitField).has(command.permissions))
        return await reply(inter, { content: eventLit.noPermissions, ephemeral: true }, 2);

      // Check if command requires user to be in a voice channel
      if (command.voiceChannel) {
        // Get DJ role from environment variable and fetch member roles
        const djRole: string | undefined = process.env.DJ_ROLE?.trim();
        const memberRoles: GuildMemberRoleManager = inter.member.roles as GuildMemberRoleManager;

        // Check if user has DJ role if DJ role is set
        if (djRole && !memberRoles.cache.some((role) => role.name === djRole))
          return await reply(inter, { content: eventLit.noDJRole, ephemeral: true }, 2);

        // Get queue and whether trivia is enabled
        const queue: GuildQueue<IMetadata> | null = useQueue(inter.guild);
        const trivia: boolean | undefined = queue ? queue.metadata.trivia : false;

        // Check if queue and trivia are enabled, if so, no voice commands allowed
        if (queue && trivia) return await reply(inter, { content: eventLit.noCommandsTrivia, ephemeral: true }, 2);

        // Get user and voice channel of the interacting user
        const user: GuildMember = inter.member as GuildMember;
        const voiceChannel: VoiceBasedChannel | null = user.voice.channel;

        // Check if user is in a voice channel, if not, return error
        if (!voiceChannel) return await reply(inter, { content: eventLit.noVoiceChannel, ephemeral: true }, 2);

        // Get bot's voice channel
        const botVoiceChannel: VoiceBasedChannel | null = inter.guild.members.me
          ? inter.guild.members.me.voice.channel
          : null;

        // Check if bot is in a voice channel and if user is in the same voice channel as the bot
        if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id)
          return await reply(inter, { content: eventLit.noSameVoiceChannel, ephemeral: true }, 2);
      }

      //Execute command
      await commandErrorHandler(command, client, inter);
    }
  },
};
