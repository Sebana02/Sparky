import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { useQueue, Track, QueueRepeatMode } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, loop } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '../../../interfaces/metadata.interface.js';

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
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription(commandLit.description)
    .addNumberOption((option) =>
      option
        .setName(commandLit.loopName)
        .setDescription(commandLit.loopDescription)
        .setRequired(true)
        .addChoices(
          { name: commandLit.loopChoiceOff, value: QueueRepeatMode.OFF },
          { name: commandLit.loopChoiceTrack, value: QueueRepeatMode.TRACK },
          { name: commandLit.loopChoiceQueue, value: QueueRepeatMode.QUEUE },
          { name: commandLit.loopChoiceAutoplay, value: QueueRepeatMode.AUTOPLAY }
        )
    ),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and loop mode
    const queue = useQueue<IQueuePlayerMetadata>(inter.guild?.id as string);
    const loopMode = inter.options.getNumber(commandLit.loopName, true) as QueueRepeatMode;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Set the repeat mode
    queue.setRepeatMode(loopMode);

    //Send the loop embed
    await reply(inter, {
      embeds: [loop(queue.repeatMode, queue.currentTrack as Track<ITrackMetadata>)],
    });
  },
};
