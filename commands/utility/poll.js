const { ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply, fetchReply } = require('@utils/interaction-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('utility.poll.description'),
    questionName: fetchCommandLit('utility.poll.options.question.name'),
    questionDesc: fetchCommandLit('utility.poll.options.question.description'),
    optionsName: fetchCommandLit('utility.poll.options.options.name'),
    optionsDesc: fetchCommandLit('utility.poll.options.options.description'),
    timeName: fetchCommandLit('utility.poll.options.time.name'),
    timeDesc: fetchCommandLit('utility.poll.options.time.description'),

    insufficientOptions: fetchCommandLit('utility.poll.checkings.insufficient_options'),
    tooManyOptions: fetchCommandLit('utility.poll.checkings.too_many_options'),

    pollEnded: (votes) => fetchCommandLit('utility.poll.responses.ended', votes),
    pollInProgress: (time) => fetchCommandLit('utility.poll.responses.in_progress', time),
    vote: (option) => fetchCommandLit('utility.poll.responses.voted', option)

}

/**
 * Command that creates a poll
 */
module.exports = {
    name: 'poll',
    description: literals.description,
    options: [
        {
            name: literals.questionName,
            description: literals.questionDesc,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: literals.optionsName,
            description: literals.optionsDesc,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: literals.timeName,
            description: literals.timeDesc,
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 10
        }
    ],
    run: async (client, inter) => {
        //Get options and check they fit the requirements
        const options = inter.options.getString(literals.optionsName).split(',').map(e => e.trim()).filter(Boolean)
        if (options.length < 2)
            return await reply(inter, { content: literals.insufficientOptions, ephemeral: true, deleteTime: 2 })

        else if (options.length > 10)
            return await reply(inter, { content: literals.tooManyOptions, ephemeral: true, deleteTime: 2 })

        const poll = inter.options.getString(literals.questionName).trim()

        //Defer reply
        await deferReply(inter)

        //Create votes -> Array<{option, value}>
        const votes = options.map(option => ({ option, value: 0 }))

        //Send initial poll embed
        const embed = createPollEmbed(inter, poll, votes, false)
        const components = createButtons(votes)
        await reply(inter, { embeds: [embed], components })

        //Create a collection of votes
        const finalVotes = await createCollection(inter, votes, poll, components)

        //Send the final poll embed
        const embedResult = createPollEmbed(inter, poll, finalVotes, true)
        await reply(inter, { embeds: [embedResult] })
    }

}

/**
 * Creates a poll embed
 * @param {Interaction} inter The interaction
 * @param {String} poll The poll title
 * @param {Array<{option, value}>} votes The votes
 * @param {Boolean} end If the poll has ended
 * @returns {MessageEmbed} The poll embed
 */
function createPollEmbed(inter, poll, votes, end = false) {
    //Calculate total votes
    const totalVotes = votes.reduce((total, vote) => total + vote.value, 0)

    //Calculate percentage and create the message for each option
    let votation = []
    votes.forEach(vote => {
        const percentage = totalVotes !== 0 ? (100 * vote.value / totalVotes).toFixed(2) : 0
        const filledBars = '✅'.repeat(vote.value)
        const emptyBars = '⬛'.repeat(totalVotes - vote.value)

        const msg = `${filledBars}${emptyBars} ${vote.value} | ${percentage}%`
        votation.push({ name: vote.option, value: msg })
    })

    //Create the embed and return it
    return createEmbed({
        color: ColorScheme.utility,
        title: poll,
        fields: votation,
        footer: { text: inter.user.username, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
        setTimestamp: true,
        description: !end ?
            literals.pollInProgress(inter.options.getNumber(literals.timeName)) :
            literals.pollEnded(totalVotes)
    })
}

/**
 * Creates buttons for each option
 * @param {Array<{option, value}>} votes The votes
 * @returns {Array<ActionRowBuilder>} Buttons for each option
 */
function createButtons(votes) {
    //Create a button for each option
    const buttons = votes.map((vote, i) =>
        new ButtonBuilder()
            .setLabel(vote.option)
            .setCustomId(`vote_${i}`)
            .setStyle('Primary')
    )

    const components = []
    const maxButtonsPerRow = 5
    const numRows = Math.ceil(buttons.length / maxButtonsPerRow)

    //Distribution of buttons in rows
    for (let i = 0; i < numRows; i++) {
        const ini = i * maxButtonsPerRow
        const row = new ActionRowBuilder()

        if (i === numRows - 1)  //Last row
            row.addComponents(buttons.slice(ini, ini + (buttons.length - ini)))
        else
            row.addComponents(buttons.slice(ini, ini + maxButtonsPerRow))


        components.push(row)
    }

    return components
}

/**
 * Creates a collection of votes and updates the poll embed
 * @param {Interaction} inter The interaction
 * @param {Array<{option, value}>} votes The votes
 * @param {String} poll The poll title
 * @param {Array<ActionRowBuilder>} components Buttons for each option
 * @returns {Promise<Array<{option, value}>>} The final votes. It resolves when the collector ends or rejects if there is an error
 */
async function createCollection(inter, votes, poll, components) {
    //Gets the poll message
    const msg = await fetchReply(inter)

    //Create a collector for the votes
    const filter = (i) => !i.user.bot && i.customId.startsWith('vote_')
    const countReactions = new Map()
    const collector = msg.createMessageComponentCollector({ filter, time: inter.options.getNumber(literals.timeName) * 1000 })

    //This promise resolves with the final votes when the collector ends or rejects if there is an error
    return await new Promise(async (resolve, reject) => {

        //When a user votes
        collector.on('collect', async (interaction) => {

            try {
                //Get the index of the option voted
                const index = parseInt(interaction.customId.split('_')[1])

                //Remove previous user vote 
                const previousVote = countReactions.get(interaction.user.id)
                if (previousVote !== undefined)
                    votes[previousVote].value--

                //Add new vote
                countReactions.set(interaction.user.id, index)
                votes[index].value++

                //Reply to the user
                reply(interaction, {
                    content: literals.vote(votes[index].option)
                    , ephemeral: true, deleteTime: 2, propagate: false
                })

                //Update the poll embed
                const embedResult = createPollEmbed(inter, poll, votes, false)
                await reply(inter, { embeds: [embedResult], components: components })
            } catch (error) {
                reject(error)
                collector.stop()
            }
        })

        //When the collector ends, resolve the promise with the final votes
        collector.on('end', () => resolve(votes))
    })

}