import {
  ActionRowBuilder,
  ButtonBuilder,
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonStyle,
  MessageComponentInteraction,
} from 'discord.js';
import { reply, deferReply, fetchReply, update } from '../../utils/interaction-utils.js';
import { createEmbed, ColorScheme, modifyEmbed } from '../../utils/embed/embed-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { IEmbedField } from 'interfaces/embed.interface.js';

type Votes = { option: string; value: number }[];

const commandLit = {
  description: fetchString('poll.description'),
  questionName: fetchString('poll.options.question.name'),
  questionDescription: fetchString('poll.options.question.description'),
  optionsName: fetchString('poll.options.options.name'),
  optionsDescription: fetchString('poll.options.options.description'),
  timeName: fetchString('poll.options.time.name'),
  timeDescription: fetchString('poll.options.time.description'),
  insufficientOptions: fetchString('poll.checkings.insufficient_options'),
  tooManyOptions: fetchString('poll.checkings.too_many_options'),
  inProgress: fetchFunction('poll.responses.in_progress'),
  ended: fetchFunction('poll.responses.ended'),
};

/**
 * Command that creates a poll
 */
export const command: ICommand = {
  name: 'poll',
  description: commandLit.description,
  options: [
    {
      name: commandLit.questionName,
      description: commandLit.questionDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: commandLit.optionsName,
      description: commandLit.optionsDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: commandLit.timeName,
      description: commandLit.timeDescription,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  /**
   * Run the command
   * @param client
   * @param inter
   * @returns
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get options, poll title and time
    const options = inter.options.getString(commandLit.optionsName, true)?.trim();
    const pollTheme = inter.options.getString(commandLit.questionName, true)?.trim();
    const time = inter.options.getNumber(commandLit.timeName, true);

    // Check if the options are correct
    const optionArr = options
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    if (optionArr.length < 2)
      return await reply(inter, { content: commandLit.insufficientOptions, ephemeral: true }, { deleteTime: 2 });
    else if (optionArr.length > 10)
      return await reply(inter, { content: commandLit.tooManyOptions, ephemeral: true }, { deleteTime: 2 });

    //Defer reply
    await deferReply(inter);

    //Create votes
    const votes: Votes = optionArr.map((option) => ({ option, value: 0 }));

    //Create poll embed
    let embed: EmbedBuilder = createPollEmbed(inter, pollTheme, time, votes);

    //Send initial poll embed
    await reply(inter, {
      embeds: [embed],
      components: createPollButtons(votes),
    });

    // Collect votes from users
    await collectVotes(inter, votes, time, embed);

    //Send the final poll embed
    await reply(inter, {
      embeds: [modifyPollEmbed(embed, votes, true)],
      components: [],
    });
  },
};

/**
 * Process the votes and calculate the total votes and the message for each option
 * @param votes - The votes
 * @returns An object with the total votes and an array of fields with the message for each option
 */
function processVotes(votes: Votes): { totalVotes: number; votation: IEmbedField[] } {
  //Calculate total votes
  const totalVotes = votes.reduce((total, vote) => total + vote.value, 0);

  //Calculate percentage and create the message for each option
  let votation: IEmbedField[] = [];
  votes.forEach((vote) => {
    const percentage = totalVotes !== 0 ? ((100 * vote.value) / totalVotes).toFixed(2) : 0;
    const filledBars = '✅'.repeat(vote.value);
    const emptyBars = '⬛'.repeat(totalVotes - vote.value);

    const msg = `${filledBars}${emptyBars} ${vote.value} | ${percentage}%`;
    votation.push({ name: vote.option, value: msg });
  });

  // Return the total votes and the votation message
  return { totalVotes, votation };
}

/**
 * Modifies the poll embed
 * @param embed The embed
 * @param votes The votes
 * @param end If the poll has ended
 * @returns The modified embed
 */
function modifyPollEmbed(embed: EmbedBuilder, votes: Votes, end: boolean): EmbedBuilder {
  //Calculate total votes and create the message for each option
  const { totalVotes, votation } = processVotes(votes);

  // Modify the embed and return it
  return modifyEmbed(embed, {
    fields: votation,
    description: !end ? embed.data.description : commandLit.ended(totalVotes),
  });
}

/**
 * Creates the poll embed
 * @param inter The interaction
 * @param poll The poll title
 * @param time The time of the poll
 * @param votes The votes
 * @param end If the poll has ended
 * @returns The poll embed
 */
function createPollEmbed(inter: ChatInputCommandInteraction, poll: string, time: number, votes: Votes): EmbedBuilder {
  //Calculate total votes and create the message for each option
  const { votation } = processVotes(votes);

  //Create the embed and return it
  return createEmbed({
    color: ColorScheme.utility,
    title: poll,
    fields: votation,
    footer: {
      text: inter.user.username,
      iconURL: inter.user.displayAvatarURL(),
    },
    setTimestamp: true,
    description: commandLit.inProgress(time),
  });
}

/**
 * Creates a button for each option
 * @param votes The votes (possible options)
 * @returns The buttons for each option
 */
function createPollButtons(votes: Votes): ActionRowBuilder[] {
  //Create a button for each option
  const buttons = votes.map((vote, i) =>
    new ButtonBuilder().setLabel(vote.option).setCustomId(`vote_${i}`).setStyle(ButtonStyle.Primary)
  );

  const components = [];
  const maxButtonsPerRow = 5;
  const numRows = Math.ceil(buttons.length / maxButtonsPerRow);

  //Distribution of buttons in rows
  for (let i = 0; i < numRows; i++) {
    const ini = i * maxButtonsPerRow;
    const row = new ActionRowBuilder();

    if (i === numRows - 1)
      //Last row
      row.addComponents(buttons.slice(ini, ini + (buttons.length - ini)));
    else row.addComponents(buttons.slice(ini, ini + maxButtonsPerRow));

    components.push(row);
  }

  return components;
}

/**
 * Creates a collection of votes
 * @param inter The interaction
 * @param votes The votes
 * @param components The buttons
 * @param embed The poll embed
 * @returns The final votes
 */
async function collectVotes(
  inter: ChatInputCommandInteraction,
  votes: Votes,
  time: number,
  embed: EmbedBuilder
): Promise<void> {
  //Gets the poll message
  const pollMsg = await fetchReply(inter);

  // Map to store the user votes (key: user id, value: index of the option voted)
  const countReactions = new Map();

  //Create a collector for the votes
  const collector = pollMsg.createMessageComponentCollector({
    filter: (interaction: MessageComponentInteraction) =>
      interaction.isButton() && interaction.customId.startsWith('vote_'),
    time: time * 1000,
  });

  //This promise resolves with the final votes when the collector ends or rejects if there is an error
  return await new Promise(async (resolve, reject) => {
    //When a user votes
    collector.on('collect', async (interaction: MessageComponentInteraction) => {
      try {
        //Get the index of the option voted
        const index = parseInt(interaction.customId.split('_')[1]);

        //Remove previous user vote
        const previousVote = countReactions.get(interaction.user.id);
        if (previousVote !== undefined) votes[previousVote].value--;

        //Add new vote
        countReactions.set(interaction.user.id, index);
        votes[index].value++;

        //Update the poll embed
        await update(interaction, {
          embeds: [modifyPollEmbed(embed, votes, false)],
        });
      } catch (error) {
        collector.stop();
        reject(error);
      }
    });

    //When the collector ends, resolve the promise with the final votes
    collector.on('end', () => resolve());
  });
}
