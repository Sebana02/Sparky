const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interaction-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('utility.remind.description'),
    timeName: fetchCommandLit('utility.remind.options.time.name'),
    timeDesc: fetchCommandLit('utility.remind.options.time.description'),
    reminderName: fetchCommandLit('utility.remind.options.reminder.name'),
    reminderDesc: fetchCommandLit('utility.remind.options.reminder.description'),
    invalidTime: fetchCommandLit('utility.remind.invalid_time'),
    reminderSet: (time) => fetchCommandLit('utility.remind.reminder_set', time),
    response: (user) => fetchCommandLit('utility.remind.response', user)
}

/**
 * Command that sets up a reminder
 */
module.exports = {
    name: 'remind',
    description: literals.description,
    options: [
        {
            name: literals.timeName,
            type: ApplicationCommandOptionType.String,
            description: literals.timeDesc,
            required: true
        },
        {
            name: literals.reminderName,
            type: ApplicationCommandOptionType.String,
            description: literals.reminderDesc,
            required: true
        }
    ],
    async run(client, inter) {

        //Get time and message
        const time = inter.options.getString(literals.timeName)
        const message = inter.options.getString(literals.reminderName)

        // Parse time
        const cont = time.replace(/\s+/g, '') // Get rid of spaces
            .toLowerCase() // Make it lowercase
            .match(/\d+[dhms]/g) //Use regex to get number+unit combination


        //Check if time is valid
        if (!cont)
            return await reply(inter, { content: literals.invalidTime, ephemeral: true, deleteTime: 5 })

        //Map time to object    
        const date = cont
            .map(x => {
                const [num, unit] = x.match(/\d+|\D/g)  // Split number and unit
                return { num: parseInt(num), unit }     // Return the number and unit object
            })

        //Send confirmation message
        //We do not wait for this to finish, as the reminder would be delayed
        reply(inter, {
            content: literals.reminderSet(date.map(({ num, unit }) => `${num}${unit}`).join(' ')),
            ephemeral: true, deleteTime: 5
        })


        //Calculate future date
        let futureDate = new Date()
        date.forEach(({ num, unit }) => {
            switch (unit) {
                case 'd':
                    futureDate.setDate(futureDate.getDate() + num)
                    break
                case 'h':
                    futureDate.setHours(futureDate.getHours() + num)
                    break
                case 'm':
                    futureDate.setMinutes(futureDate.getMinutes() + num)
                    break
                case 's':
                    futureDate.setSeconds(futureDate.getSeconds() + num)
                    break
            }
        })

        //Set reminder
        setTimeout(async () => {
            //Create embed
            const embed = createEmbed({
                description: message,
                setTimestamp: true,
                footer: {
                    text: literals.response(inter.user.tag),
                    iconURL: inter.user.displayAvatarURL({ dynamic: true })
                },
                color: ColorScheme.utility
            })
            await inter.channel.send({ embeds: [embed] })
        }, futureDate - Date.now())
    }
}