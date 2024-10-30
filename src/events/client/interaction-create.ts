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
 * Event that is called when the bot receives an interaction
 */
export const event: IEvent = {
  event: 'interactionCreate',

  /**
   * Callback function to be executed when the interactionCreate event is triggered
   * @param client - The discord client
   * @param inter - The interaction object
   * @returns Promise<void> - A Promise that resolves when the function is done executing
   */
  callback: async (client: Client, inter: Interaction): Promise<void> => {
    // Return if interaction was not received on a guild or if any of the required properties are missing
    if (!inter.guild || !inter.member || !inter.guildId || !inter.user) return;

    // If interaction is a command
    if (inter.isChatInputCommand()) {
      //Log interaction
      let cmdInfo = `/${inter.commandName} `;
      inter.options.data.forEach((option) => {
        cmdInfo += `${option.name}: ${option.value} `;
      });

      logger.info(
        `Command: ${cmdInfo} | User: ${inter.user.username} (id : ${inter.user}) | Guild: ${inter.guild?.name} (id : ${inter.guildId})`
      );

      //Get command
      const command: ICommand = globalThis.commands.get(inter.commandName);

      if (!command) throw new Error(`Command ${inter.commandName} not found`);

      // Check command permissions
      if (command.permissions && (inter.member.permissions as PermissionsBitField).missing(command.permissions))
        return await reply(
          inter,
          { content: fetchString('interaction_create.no_permissions'), ephemeral: true },
          { deleteTime: 2 },
          false
        );

      // Check if command requires user to be in a voice channel
      if (command.voiceChannel) {
        // Get DJ role from environment variable and fetch member roles
        const djRole: string | undefined = process.env.DJ_ROLE?.trim();
        const memberRoles: GuildMemberRoleManager = inter.member.roles as GuildMemberRoleManager;

        // Check if user has DJ role if DJ role is set
        if (djRole && !memberRoles.cache.some((role) => role.name === djRole))
          return await reply(
            inter,
            { content: fetchString('interaction_create.no_dj_role'), ephemeral: true },
            { deleteTime: 2 },
            false
          );

        // Get queue and whether trivia is enabled
        const queue: GuildQueue<IMetadata> | null = useQueue(inter.guildId);
        const trivia: boolean | undefined = queue ? queue.metadata.trivia : false;

        // Check if queue and trivia are enabled, if so, no voice commands allowed
        if (queue && trivia)
          return await reply(
            inter,
            { content: fetchString('interaction_create.no_commands_trivia'), ephemeral: true },
            { deleteTime: 2 },
            false
          );

        // Get user and voice channel of the interacting user
        const user: GuildMember = inter.member as GuildMember;
        const voiceChannel: VoiceBasedChannel | null = user.voice.channel;

        // Check if user is in a voice channel, if not, return error
        if (!voiceChannel)
          return await reply(
            inter,
            { content: fetchString('interaction_create.no_voice_channel'), ephemeral: true },
            { deleteTime: 2 },
            false
          );

        // Get bot's voice channel
        const botVoiceChannel: VoiceBasedChannel | null = inter.guild.members.me
          ? inter.guild.members.me.voice.channel
          : null;

        // Check if bot is in a voice channel and if user is in the same voice channel as the bot
        if (botVoiceChannel && voiceChannel.id !== botVoiceChannel.id)
          return await reply(
            inter,
            { content: fetchString('interaction_create.not_same_voice_channel'), ephemeral: true },
            { deleteTime: 2 },
            false
          );
      }

      //Execute command
      await commandErrorHandler(command, client, inter);
    }
  },
};
