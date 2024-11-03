import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';
import { followUp, reply } from '../../utils/interaction-utils.js';
import { createEmbed, ColorScheme } from '../../utils/embed/embed-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from '../../interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('remind.description'),
  timeName: fetchString('remind.options.time.name'),
  timeDescription: fetchString('remind.options.time.description'),
  reminderName: fetchString('remind.options.reminder.name'),
  reminderDescription: fetchString('remind.options.reminder.description'),
  invalidTime: fetchString('remind.invalid_time'),
  reminderSet: fetchFunction('remind.reminder_set'),
  response: fetchFunction('remind.response'),
};

/**
 * Command that sets up a reminder
 */
export const command: ICommand = {
  name: 'remind',
  description: commandLit.description,
  options: [
    {
      name: commandLit.timeName,
      description: commandLit.timeDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: commandLit.reminderName,
      description: commandLit.reminderDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   * Run function for this command
   * @param client - The client instance
   * @param inter - The interaction that triggered this command
   */
  async run(client: Client, inter: ChatInputCommandInteraction): Promise<void> {
    //Get time and reminder
    const time = inter.options.getString(commandLit.timeName, true);
    const reminder = inter.options.getString(commandLit.reminderName, true);

    // Parse time into an array of objects ([{num: number, unit: string}])
    const date = time
      .toLowerCase() // Turn into lowercase
      .replace(/\s+/g, '') // Remove spaces
      .match(/\d+[dhms]/g) // Match numbers followed by d, h, m or s
      ?.map((x) => {
        const match = x.match(/\d+|\D/g); // Split into number and unit
        if (!match) return;
        const [num, unit] = match; // Destructure the match
        return { num: parseInt(num), unit }; // Return object
      })
      .filter((item): item is { num: number; unit: string } => item !== undefined); // Filter out any undefined values

    //Check if time is valid
    if (!date) return await reply(inter, { content: commandLit.invalidTime, ephemeral: true }, { deleteTime: 5 });

    //Send confirmation message
    //We do not wait for this to finish, as the reminder would be delayed
    reply(
      inter,
      {
        content: commandLit.reminderSet(date.map(({ num, unit }) => `${num}${unit}`).join(' ')),
        ephemeral: true,
      },
      { deleteTime: 5 }
    );

    //Calculate future date
    let futureDate = new Date();
    date.forEach(({ num, unit }) => {
      switch (unit) {
        case 'd':
          futureDate.setDate(futureDate.getDate() + num);
          break;
        case 'h':
          futureDate.setHours(futureDate.getHours() + num);
          break;
        case 'm':
          futureDate.setMinutes(futureDate.getMinutes() + num);
          break;
        case 's':
          futureDate.setSeconds(futureDate.getSeconds() + num);
          break;
      }
    });

    //Set reminder
    setTimeout(async () => {
      //Create embed
      const embed = createEmbed({
        description: reminder,
        setTimestamp: true,
        footer: {
          text: commandLit.response(inter.user.tag),
          iconURL: inter.user.displayAvatarURL(),
        },
        color: ColorScheme.utility,
      });
      await followUp(inter, { embeds: [embed] });
    }, futureDate.getTime() - Date.now());
  },
};
