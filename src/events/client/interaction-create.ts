import { useQueue } from 'discord-player';
import { commandErrorHandler } from '../../utils/error-handler.js';
import { reply } from '../../utils/interaction-utils.js';
import { fetchString, fetchObject } from '../../utils/language-utils.js';
import { Client, GuildMember, GuildMemberRoleManager, Interaction, PermissionsBitField } from 'discord.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { IEvent } from '../../interfaces/event.interface.js';

const eventLit = fetchObject('events.client.interaction_create');

/**
 * Event that is called when the bot receives an interaction
 */
const event: IEvent = {
  event: 'interactionCreate',

  /**
   * Callback function to be executed when the interactionCreate event is triggered
   * @param client - The discord client
   * @param inter - The interaction object
   * @returns Promise<void> - A Promise that resolves when the function is done executing
   */
  callback: async (client: Client, inter: Interaction): Promise<void> => {
    //If interaction is a command
    if (inter.isChatInputCommand()) {
      //Log interaction
      let cmdInfo = `/${inter.commandName} `;
      inter.options.data.forEach((option) => {
        cmdInfo += `${option.name}: ${option.value} `;
      });

      logger.info(
        `Command: ${cmdInfo} | User: ${inter.user.username} (id : ${inter.user}) | Guild: ${inter.guild?.name} (id : ${inter.guildId})`
      );

      const command: ICommand = globalThis.commands.get(inter.commandName);

      //If command has permissions restrictions and user does not have them -> error
      if (command.permissions && !(inter.member?.permissions as PermissionsBitField).has(command.permissions))
        return await reply(
          inter,
          {
            content: fetchString('no_permissions', eventLit),
            ephemeral: true,
          },
          { deleteTime: 2 },
          false
        );

      //If command requires user to be in voice channel
      if (command.voiceChannel) {
        //If DJ role is enabled for the command and user does not have DJ role -> error
        if (
          process.env.DJ_ROLE &&
          process.env.DJ_ROLE.trim() !== '' &&
          !(inter.member?.roles as GuildMemberRoleManager).cache.some(
            (role) => role.id === process.env.DJ_ROLE
          )
        )
          return await reply(
            inter,
            {
              content: fetchString('no_dj_role', eventLit),
              ephemeral: true,
            },
            { deleteTime: 2 },
            false
          );

        //If trivia is enabled -> error
        const queue = useQueue(inter.guildId as string);
        if (queue && (queue.metadata as { trivia: boolean }).trivia)
          return await reply(
            inter,
            {
              content: fetchString('no_commands_trivia', eventLit),
              ephemeral: true,
            },
            {
              deleteTime: 2,
            },
            false
          );

        //User is not on a voice channel -> error
        if (!(inter.member as GuildMember).voice.channel)
          return await reply(
            inter,
            {
              content: fetchString('no_voice_channel', eventLit),
              ephemeral: true,
            },
            {
              deleteTime: 2,
            },
            false
          );

        //User is not on the same voice channel as bot -> error
        if (
          inter.guild?.members.me?.voice.channel &&
          (inter.member as GuildMember).voice.channel?.id !== inter.guild.members.me.voice.channel.id
        )
          return await reply(
            inter,
            {
              content: fetchString('not_same_voice_channel', eventLit),
              ephemeral: true,
            },
            {
              deleteTime: 2,
            },
            false
          );
      }
      //Execute command
      await commandErrorHandler(command, client, inter);
    }
  },
};
export default event;
