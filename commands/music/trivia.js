const { deferReply, reply, fetchReply } = require('@utils/interactionUtils')
const { QueryType, useQueue, useMainPlayer, usePlayer } = require('discord-player')
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, InteractionType } = require('discord.js')
const { noResults, noPlaylist } = require('@utils/embedMusicPresets')
const { createEmbed } = require('@utils/embedUtils')

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
        await deferReply(inter)

        let queue = useQueue(inter.guildId)
        if (queue) queue.delete()

        const results = await searchResults(inter)

        if (!results.hasTracks()) {
            return await reply(inter, {
                embeds: [noResults(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }
        if (!results.hasPlaylist() || results.tracks.length < 4) {
            return await reply(inter, {
                embeds: [noPlaylist(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        triviaRound(inter, [], results, [...results.tracks]) //players: {user: user, score: score}
    }
}

async function searchResults(inter) {
    const player = useMainPlayer()
    const playlist = inter.options.getString('playlist')

    return await player.search(playlist, {
        requestedBy: inter.member,
        searchEngine: QueryType.AUTO
    })
}

function selectSong(results, toBePlayed) {
    //select random song from toBePlayed
    let correctSong = toBePlayed[Math.floor(Math.random() * toBePlayed.length)]

    //remove song from toBePlayed
    toBePlayed = toBePlayed.filter(s => s !== correctSong)


    //select 3 random songs from results.tracks that are not the same as song
    let incorrectSongs = results.tracks.filter(s => s !== correctSong)
    incorrectSongs = incorrectSongs.sort(() => Math.random() - Math.random()).slice(0, 4 - 1)

    //create buttons array with the 4 songs and then suffle it
    let songs = [correctSong]
    incorrectSongs.forEach(s => songs.push(s))
    songs = songs.sort(() => Math.random() - Math.random())

    return { correctSong, songs }
}

function createButtons(songs) {
    let buttonsRow = new ActionRowBuilder()
    songs.forEach(b => {
        buttonsRow.addComponents(
            new ButtonBuilder()
                .setLabel((b.title + ' | ' + b.author).substring(0, 80))
                .setStyle('Primary')
                .setCustomId(JSON.stringify({ id: b.id }))

        )
    })

    buttonsRow.addComponents(
        new ButtonBuilder()
            .setLabel('Stop')
            .setStyle('Danger')
            .setCustomId(JSON.stringify({ id: 'Stop' }))

    )

    return buttonsRow
}

function createLeaderboard(players, end) {
    const playersSorted = players.sort((a, b) => b.score - a.score)
    return createEmbed({
        footer: { text: !end ? 'Adivina la canción' : 'Se ha acabado el trivia!' },
        description: (playersSorted.length > 0 ? '**Puntuación**\n' : '') + playersSorted.map(p => `***${p.user.username} : ${p.score}***`).join('\n'),
        color: 0xffa500
    })
}

async function playSong(inter, song) {

    const player = usePlayer(inter.guildId)
    const queue = useQueue(inter.guildId)

    await useMainPlayer().play(inter.member.voice.channel, song.url, {
        nodeOptions: {
            metadata: {
                voiceChannel: inter.member.voice.channel,
                channel: inter.channel,
                trivia: true
            },
            leaveOnEmpty: false,
            leaveOnEnd: false,
            leaveOnStop: false,
            bufferingTimeout: 0,
            selfDeaf: true
        }
    })

    if (queue && queue.isPlaying())
        player.skip()
}

async function awaitInteraction(inter, players, correctSong, results, toBePlayed) {
    let filter = (i) => !i.user.bot && i.type === InteractionType.MessageComponent
    let message = await fetchReply(inter)

    await message.awaitMessageComponent({ filter, time: trackDurationToMilliseconds(correctSong.duration) + 10000, max: 1 })
        .then(async i => {

            if (JSON.parse(i.customId).id === 'Stop') {
                const result = createEmbed({
                    author: { name: 'Se ha parado el trivia!', iconURL: i.user.displayAvatarURL() },
                    color: 0xffa500
                })
                await reply(i, { embeds: [result], deleteTime: 1.5 })

                await endTrivia(inter, players)
            }
            else {
                if (JSON.parse(i.customId).id === correctSong.id) {
                    let player = players.find(p => p.user === i.user)
                    if (player) player.score++
                    else players.push({ user: i.user, score: 1 })

                    const result = createEmbed({
                        author: { name: `Correcto, ${i.user.tag}, +1 punto!`, iconURL: i.user.displayAvatarURL() },
                        footer: { text: `La canción era ${(correctSong.title + ' - ' + correctSong.author).substring(0, 80)}` },
                        color: 0xffa500
                    })

                    await reply(i, { embeds: [result], deleteTime: 1.5 })
                }
                else {
                    const result = createEmbed({
                        author: { name: `Incorrecto, ${i.user.tag}, tal vez la próxima vez!`, iconURL: i.user.displayAvatarURL() },
                        footer: { text: `La canción era ${(correctSong.title + ' - ' + correctSong.author).substring(0, 80)}` },
                        color: 0xffa500
                    })

                    await reply(i, { embeds: [result], deleteTime: 1.5 })
                }

                await triviaRound(inter, players, results, toBePlayed)
            }

        })
        .catch(async () => {
            await endTrivia(inter, players)
        })
}

async function endTrivia(inter, players) {
    const leaderboard = createLeaderboard(players, true)
    await reply(inter, {
        embeds: [leaderboard],
        ephemeral: false,
    })

    const queue = useQueue(inter.guildId)
    if (queue) queue.delete()
}

function trackDurationToMilliseconds(duration) {
    const [minutes, seconds] = duration.split(':').map(Number)
    return (minutes * 60 + seconds) * 1000
}

async function triviaRound(inter, players, results, toBePlayed) {
    if (toBePlayed.length === 0) return await endTrivia(inter, players)

    const { correctSong, songs } = selectSong(results, toBePlayed)

    await playSong(inter, correctSong)

    const buttonsRow = createButtons(songs)
    const leaderboard = createLeaderboard(players, false)

    await reply(inter, {
        embeds: [leaderboard],
        components: [buttonsRow]
    })

    await awaitInteraction(inter, players, correctSong, results, toBePlayed)
}