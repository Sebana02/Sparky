const { QueryType, useQueue, useMainPlayer } = require('discord-player')
const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, InteractionType } = require('discord.js')

module.exports = {
    name: 'trivia',
    description: "Juega al trivia con canciones",
    voiceChannel: true,
    options: [
        {
            name: 'playlist',
            description: 'playlist para el trivia',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, inter) => {

        await inter.deferReply()

        let queue = useQueue(inter.guildId)
        const player = useMainPlayer()

        if (queue)
            queue.delete()

        const playlist = inter.options.getString('playlist')
        const results = await player.search(playlist, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        })

        let songsNumber = 4


        if (!results.hasTracks()) return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `Sin resultados` }).setColor(0xff0000)], ephemeral: true })
        if (!results.hasPlaylist()) return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `No es una playlist` }).setColor(0xff0000)], ephemeral: true })
        if (results.tracks.length < songsNumber) return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `La playlist debe tener al menos 4 canciones` }).setColor(0xff0000)], ephemeral: true })

        let players = [] //{user: user, score: score}

        let stop = false

        //tracks that are left to be played
        let toBePlayed = [...results.tracks]


        //while there are songs to be played and the trivia is not stopped
        while (toBePlayed.length > 0 && !stop) {

            //select random song from toBePlayed
            let correctSong = toBePlayed[Math.floor(Math.random() * toBePlayed.length)]

            //remove song from toBePlayed
            toBePlayed = toBePlayed.filter(s => s !== correctSong)


            //select 3 random songs from results.tracks that are not the same as song
            let incorrectSongs = results.tracks.filter(s => s !== correctSong)
            incorrectSongs = incorrectSongs.sort(() => Math.random() - Math.random()).slice(0, songsNumber - 1)

            //create buttons array with the 4 songs and then suffle it
            let songs = [correctSong]
            incorrectSongs.forEach(s => songs.push(s))
            songs = songs.sort(() => Math.random() - Math.random())


            //create buttons
            let buttonsRow = new ActionRowBuilder()
            songs.forEach(b => {
                buttonsRow.addComponents(
                    new ButtonBuilder()
                        .setLabel((b.title + ' - ' + b.author).substring(0, 80))
                        .setStyle('Primary')
                        .setCustomId(JSON.stringify({ id: b.id }))

                )
            })


            //add stop button
            buttonsRow.addComponents(
                new ButtonBuilder()
                    .setLabel('Stop')
                    .setStyle('Danger')
                    .setCustomId(JSON.stringify({ id: 'Stop' }))

            )

            //create leaderboard table depending on players array
            //calculate players percentage of correct answers
            //sort players array by score
            //create leaderboard table
            let leaderboard = new EmbedBuilder()
                .setTitle('Adivina la canción')
                .setDescription('**PUNTUACIÓN**\n' + players.map(p => `${p.user.username} : ${p.score}`).join('\n'))
                .setColor(0x13f857)


            //if theres an error with the song, skip it (try block)
            try {
                //skip and play next track
                await player.play(inter.member.voice.channel, correctSong.url, {
                    nodeOptions: {
                        metadata: {
                            voiceChannel: inter.member.voice.channel,
                            channel: inter.channel,
                            client: client,
                            trivia: true
                        },
                        leaveOnEmptyCooldown: 0,
                        leaveOnEmpty: true,
                        leaveOnEnd: true,
                        bufferingTimeout: 0,
                        selfDeaf: true
                    }
                })
                queue = useQueue(inter.guildId)
                if (queue && queue.isPlaying())
                    player.skip()
                //send message with buttons and leaderboard
                let message = await inter.editReply({ components: [buttonsRow], embeds: [leaderboard] })


                //wait for button click
                let filter = (i) => !i.user.bot && i.type === InteractionType.MessageComponent
                await message.awaitMessageComponent({ filter, time: 300000, max: 1 })
                    .then(async i => {
                        let result = new EmbedBuilder()

                        if (JSON.parse(i.customId).id === 'Stop') { //stop
                            stop = true
                            result
                                .setTitle('Se ha parado el trivia!')
                                .setColor(0x13f857)

                        }
                        else if (JSON.parse(i.customId).id === correctSong.id) { //correct song
                            //add 1 point to player
                            let player = players.find(p => p.user === i.user)
                            if (player) player.score++
                            else players.push({ user: i.user, score: 1 })

                            //send message with correct answer
                            result
                                .setTitle('Correcto!')
                                .setDescription(`La canción era **${(correctSong.title + ' - ' + correctSong.author).substring(0, 80)}**`)
                                .setColor(0x13f857)

                        }
                        else {
                            result
                                .setTitle('Incorrecto!')
                                .setDescription(`La canción era **${(correctSong.title + ' - ' + correctSong.author).substring(0, 80)}**`)
                                .setColor(0x13f857)
                        }

                        return await i.reply({ embeds: [result], ephemeral: false })
                            .then(reply => setTimeout(() => reply.delete(), 1500))

                    })
            } catch (error) {
                console.log(error)
                continue
            }

        }

        if (queue)
            await queue.delete()

        let leaderboard = new EmbedBuilder()
            .setTitle('Se ha acabado el trivia!')
            .setDescription('**PUNTUACIÓN**\n' + players.map(p => `${p.user.username} : ${p.score}`).join('\n'))
            .setColor(0x13f857)

        return await inter.editReply({ components: [], embeds: [leaderboard] })
    },
}
