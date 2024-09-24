const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that sets up a reminder
 */
module.exports = {
    name: 'remind',
    description: 'Crea un recordatorio',
    options: [
        {
            name: 'tiempo',
            type: ApplicationCommandOptionType.String,
            description: 'Cuando quieres que te recuerde? (ejemplo: 1h 30m 1d 10s)',
            required: true
        },
        {
            name: 'recordatorio',
            type: ApplicationCommandOptionType.String,
            description: 'Que quieres que te recuerde?',
            required: true
        }
    ],
    async run(client, inter) {

        //Get time and message
        const time = inter.options.getString('tiempo')
        const message = inter.options.getString('recordatorio')

        // Parse time
        const cont = time.replace(/\s+/g, '') // Get rid of spaces
            .toLowerCase() // Make it lowercase
            .match(/\d+[dhms]/g) //Use regex to get number+unit combination


        //Check if time is valid
        if (!cont) return await reply(inter, { content: 'Tiempo inválido', ephemeral: true, deleteTime: 5 })

        //Map time to object    
        const date = cont
            .map(x => {
                const [num, unit] = x.match(/\d+|\D/g)  // Split number and unit
                return { num: parseInt(num), unit }     // Return the number and unit object
            })

        //Send confirmation message
        //We do not wait for this to finish, as the reminder would be delayed
        reply(inter, { content: `De acuerdo, te lo recordaré en ${date.map(({ num, unit }) => `${num}${unit}`).join(' ')}`, ephemeral: true, deleteTime: 5 })


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
                footer: { text: `Recordatorio de ${inter.user.tag}`, iconURL: inter.user.displayAvatarURL({ dynamic: true }) },
                color: ColorScheme.utility
            })
            await inter.channel.send({ embeds: [embed] })
        }, futureDate - Date.now())
    }
}