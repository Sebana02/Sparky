const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')

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
        //Defer reply
        await deferReply(inter)

        //Get time and message
        const time = inter.options.getString('tiempo')
        const message = inter.options.getString('recordatorio')

        // Parse time
        const date = time
            .replace(/\s+/g, '') // Get rid of spaces
            .match(/\d+[dhms]/g)  // Get all the numbers with their units
            .map(x => { // Map each number with its unit
                const [num, unit] = x.match(/\d+|\D/g)  // Get the number and the unit
                return { num: parseInt(num), unit }     // Return the number and the unit
            })

        //Check if time is valid
        if (date.length === 0)
            return await reply(inter, { content: 'Tiempo inválido', ephemeral: true, deleteTime: 5 })

        //Send confirmation message
        await reply(inter, { content: `Te recordaré en ${date.map(({ num, unit }) => `${num}${unit}`).join(' ')}` })

        //Get current date
        let futureDate = new Date()

        //Add time to future date
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

        //Set reminder as a new thread
        setTimeout(async () => {
            await inter.channel.send({ content: `Recordatorio: ${message}` })
        }, futureDate - Date.now())
    }
}