import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';
import { useQueue, GuildQueue, Track, QueueRepeatMode } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, loop } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('loop.description'),
  loopName: fetchString('loop.option.name'),
  loopDescription: fetchString('loop.option.description'),
  loopChoiceOff: fetchString('loop.option.choices.off'),
  loopChoiceTrack: fetchString('loop.option.choices.track'),
  loopChoiceQueue: fetchString('loop.option.choices.queue'),
  loopChoiceAutoplay: fetchString('loop.option.choices.autoplay'),
};

/**
 * Command for setting the loop mode
 */
export const command: ICommand = {
  name: 'loop',
  description: commandLit.description,
  voiceChannel: true,
  options: [
    {
      name: commandLit.loopName,
      description: commandLit.loopDescription,
      type: ApplicationCommandOptionType.Number,
      required: true,
      choices: [
        { name: commandLit.loopChoiceOff, value: QueueRepeatMode.OFF },
        { name: commandLit.loopChoiceTrack, value: QueueRepeatMode.TRACK },
        { name: commandLit.loopChoiceQueue, value: QueueRepeatMode.QUEUE },
        { name: commandLit.loopChoiceAutoplay, value: QueueRepeatMode.AUTOPLAY },
      ],
    },
  ],

  /**
   * Function for the command
   * @param client -  The client
   * @param inter - The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and loop mode
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;
    const loopMode = inter.options.getNumber(commandLit.loopName, true);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Set the repeat mode
    queue.setRepeatMode(loopMode);

    //Send the loop embed
    await reply(inter, {
      embeds: [loop(queue.repeatMode, queue.currentTrack as Track)],
    });
  },
};
