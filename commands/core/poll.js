const { ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply, fetchReply } = require('@utils/interactionUtils.js')
const createEmbed = require('@utils/embedUtils.js')

//Command that creates a poll
module.exports = {
    name: 'poll',
    description: 'Crea una encuesta',
    options: [
        {
            name: 'tema',
            description: 'Tema de la encuesta',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'opciones',
            description: 'Opciones de la encuesta (separadas por comas)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'tiempo',
            description: 'Tiempo que dura la encuesta en segundos',
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 10
        }
    ],
    run: async (client, inter) => {
        //Get poll information
        const options = inter.options.getString('opciones').split(',').map(e => e.trim()).filter(Boolean)
        if (options.length < 2)
            return await reply(inter, { content: 'Pon al menos dos opciones', ephemeral: true, deleteTime: 2 })

        else if (options.length > 10)
            return await reply(inter, { content: 'Demasiadas opciones, pon como mucho 10', ephemeral: true, deleteTime: 2 })

        const poll = inter.options.getString('tema').trim()

        await deferReply(inter)

        //Create votes, array of {option, value}
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

//Create the poll embed
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

    return createEmbed({
        color: 0xff0000,
        title: poll,
        fields: votation,
        footer: { text: inter.user.username, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
        setTimestamp: true,
        description: !end ? `Teneis ${inter.options.getNumber('tiempo')} segundos para votar\n` : `Votos totales: ${totalVotes}`
    })
}

//Create buttons for each option
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

    //Create a row for each 5 buttons
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

//Create a collection of votes and update the poll embed
//Returns the final votes
async function createCollection(inter, votes, poll, components) {
    const msg = await fetchReply(inter)
    const filter = (i) => !i.user.bot && i.customId.startsWith('vote_')
    const countReactions = new Map()

    const collector = msg.createMessageComponentCollector({ filter, time: inter.options.getNumber('tiempo') * 1000 })

    return new Promise(async (resolve, reject) => {
        collector.on('collect', async (interaction) => {
            try {
                const index = parseInt(interaction.customId.split('_')[1])

                //Remove previous vote 
                const previousVote = countReactions.get(interaction.user.id)
                if (previousVote)
                    votes[previousVote].value--

                //Add new vote
                countReactions.set(interaction.user.id, index)
                votes[index].value++

                //Reply to the user
                await reply(interaction, { content: `Has votado por '**${votes[index].option}**' `, ephemeral: true, deleteTime: 2 }, propagate = false)


                //Update the poll embed
                const embedResult = createPollEmbed(inter, poll, votes, false)
                await reply(inter, { embeds: [embedResult], components: components })
            } catch (error) {
                reject(error)
            }
        })

        collector.on('end', () => resolve(votes))
    })

}