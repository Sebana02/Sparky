import { Client, ChatInputCommandInteraction, PollAnswerData, PollLayoutType, SlashCommandBuilder } from 'discord.js';
import { fetchReply, reply } from '@utils/interaction-utils.js';
import { fetchString } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('poll.description'),
  questionName: fetchString('poll.options.question.name'),
  questionDescription: fetchString('poll.options.question.description'),
  optionsName: fetchString('poll.options.options.name'),
  optionsDescription: fetchString('poll.options.options.description'),
  timeName: fetchString('poll.options.time.name'),
  timeDescription: fetchString('poll.options.time.description'),
  multiAnswerName: fetchString('poll.options.multi_answer.name'),
  multiAnswerDescription: fetchString('poll.options.multi_answer.description'),
  insufficientOptions: fetchString('poll.checkings.insufficient_options'),
  tooManyOptions: fetchString('poll.checkings.too_many_options'),
};

/**
 * Command that creates a poll
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.questionName).setDescription(commandLit.questionDescription).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName(commandLit.optionsName).setDescription(commandLit.optionsDescription).setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName(commandLit.timeName).setDescription(commandLit.timeDescription).setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName(commandLit.multiAnswerName).setDescription(commandLit.multiAnswerDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get options, poll title and time
    const options = inter.options.getString(commandLit.optionsName, true).trim();
    const pollTheme = inter.options.getString(commandLit.questionName, true).trim();
    const time = inter.options.getNumber(commandLit.timeName, true);
    const multiAnswer = inter.options.getBoolean(commandLit.multiAnswerName, true);

    // Check if the options are correct
    const possibleAnsw: PollAnswerData[] = options
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
      .map((option) => ({ text: option }));

    if (possibleAnsw.length < 2)
      return await reply(inter, { content: commandLit.insufficientOptions, ephemeral: true }, 2);
    else if (possibleAnsw.length > 10)
      return await reply(inter, { content: commandLit.tooManyOptions, ephemeral: true }, 2);

    // Send the poll
    await reply(inter, {
      poll: {
        question: {
          text: pollTheme,
        },
        duration: Math.max(Math.ceil(time / 3600), 1),
        answers: possibleAnsw,
        allowMultiselect: multiAnswer,
        layoutType: PollLayoutType.Default,
      },
    });

    // Set timeout to end the poll manually
    setTimeout(async () => {
      const reply = await fetchReply(inter);
      if (reply.poll) reply.poll.end();
    }, time * 1000);
  },
};
