const { QueueRepeatMode, useQueue } = require('discord-player')
const { ApplicationCommandOptionType, } = require('discord.js')
const { reply } = require('@utils/interaction-utils')
const { noQueue, loop } = require('@utils/embed/music-presets')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('music.loop.description'),
    optionName: fetchCommandLit('music.loop.option.name'),
    optionDescription: fetchCommandLit('music.loop.option.description'),
    optionChoiceOff: fetchCommandLit('music.loop.option.choice.off'),
    optionChoiceTrack: fetchCommandLit('music.loop.option.choice.track'),
    optionChoiceQueue: fetchCommandLit('music.loop.option.choice.queue'),
    optionChoiceAutoplay: fetchCommandLit('music.loop.option.choice.autoplay')
}


/**
 * Command for setting the loop mode
 */
module.exports = {
    name: 'loop',
    description: literals.description,
    voiceChannel: true,
    options: [
        {
            name: literals.optionName,
            description: literals.optionDescription,
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                { name: literals.optionChoiceOff, value: QueueRepeatMode.OFF },
                { name: literals.optionChoiceTrack, value: QueueRepeatMode.TRACK },
                { name: literals.optionChoiceQueue, value: QueueRepeatMode.QUEUE },
                { name: literals.optionChoiceAutoplay, value: QueueRepeatMode.AUTOPLAY }
            ],
        }
    ],
    run: async (client, inter) => {

        //Get the queue
        const queue = useQueue(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Set the repeat mode
        queue.setRepeatMode(inter.options.getNumber(literals.optionName))

        //Send the loop embed
        await reply(inter, { embeds: [loop(queue.repeatMode, queue.currentTrack)] })
    }
}