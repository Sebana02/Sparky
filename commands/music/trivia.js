const { deferReply, reply, fetchReply } = require('@utils/interactionUtils')
const { QueryType, useQueue, useMainPlayer, usePlayer, SearchResult } = require('discord-player')
const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, InteractionType, EmbedBuilder } = require('discord.js')
const { noResults, noPlaylist } = require('@utils/embedMusicPresets')
const { createEmbed } = require('@utils/embedUtils')

/**
 * Command that allows user to play trivia with songs
 */
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
        //Defer reply
        await deferReply(inter)

        //Delete queue if exists
        let queue = useQueue(inter.guildId)
        if (queue) queue.delete()

        //Search for playlist
        const results = await searchResults(inter)

        //Check if there are results
        if (!results.hasTracks())
            return await reply(inter, { embeds: [noResults(client)], ephemeral: true, deleteTime: 2 })

        //Check if there are enough songs
        if (!results.hasPlaylist() || results.tracks.length < 4)
            return await reply(inter, { embeds: [noPlaylist(client)], ephemeral: true, deleteTime: 2 })


        //Start trivia
        triviaRound(inter, [], results, [...results.tracks]) //players: {user: user, score: score}
    }
}

/**
 * Search for the playlist
 * @param {Interaction} inter Interaction
 * @returns {Promise<SearchResult>} Playlist with the songs
 */
async function searchResults(inter) {
    //Get player and playlist
    const player = useMainPlayer()
    const playlist = inter.options.getString('playlist')

    //Search for playlist and return it
    return await player.search(playlist, { requestedBy: inter.member, searchEngine: QueryType.AUTO })
}

/**
 * Select the song to be played
 * @param {SearchResult} results Entire playlist
 * @param {Array<Track>} toBePlayed Songs that have not been played yet
 * @returns 
 */
function selectSong(results, toBePlayed) {
    //Select random song from toBePlayed
    let correctSong = toBePlayed[Math.floor(Math.random() * toBePlayed.length)]

    //Remove song from toBePlayed
    toBePlayed = toBePlayed.filter(s => s !== correctSong)

    //Select 3 random songs from results.tracks that are not the same as song
    let incorrectSongs = results.tracks.filter(s => s !== correctSong)
    incorrectSongs = incorrectSongs.sort(() => Math.random() - Math.random()).slice(0, 4 - 1)

    //Create array with the 4 songs and then suffle it
    let songs = [correctSong]
    incorrectSongs.forEach(s => songs.push(s))
    songs = songs.sort(() => Math.random() - Math.random())

    //Return correct song and songs that will appear in the round
    return { correctSong, songs }
}

/**
 * Create buttons for the songs
 * @param {Array<Track>} songs Songs to be played
 * @returns {ActionRowBuilder} Buttons row
 */
function createButtons(songs) {

    //Create buttons row
    let buttonsRow = new ActionRowBuilder()

    //Add songs buttons to the row
    songs.forEach(b => {
        buttonsRow.addComponents(
            new ButtonBuilder()
                .setLabel((b.title + ' | ' + b.author).substring(0, 80))
                .setStyle('Primary')
                .setCustomId(JSON.stringify({ id: b.id }))

        )
    })

    //Add stop button to the row
    buttonsRow.addComponents(
        new ButtonBuilder()
            .setLabel('Stop')
            .setStyle('Danger')
            .setCustomId(JSON.stringify({ id: 'Stop' }))

    )

    return buttonsRow
}

/**
 * Create the leaderboard
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 * @param {boolean} end Wheter the trivia has ended
 * @returns {EmbedBuilder} Leaderboard
 */
function createLeaderboard(players, end) {
    //Sort players by score
    const playersSorted = players.sort((a, b) => b.score - a.score)

    //Create embed
    return createEmbed({
        footer: { text: !end ? 'Adivina la canción' : 'Se ha acabado el trivia!' },
        description: (playersSorted.length > 0 ? '**Puntuación**\n' : '') + playersSorted.map(p => `***${p.user.username} : ${p.score}***`).join('\n'),
        color: 0xffa500
    })
}

/**
 * Play the song
 * @param {Interaction} inter Interaction
 * @param {Track} song Song to be played
 */
async function playSong(inter, song) {

    //Get player and queue
    const player = usePlayer(inter.guildId)
    const queue = useQueue(inter.guildId)

    //Play song
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

    //Skip song if it is already playing
    if (queue && queue.isPlaying())
        player.skip()
}

/**
 * Await player interaction with the buttons
 * @param {Interaction} inter Interaction
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 * @param {Track} correctSong Correct song
 * @param {SearchResult} results Entire playlist
 * @param {Array<Track>} toBePlayed Songs that have not been played yet
 */
async function awaitInteraction(inter, players, correctSong, results, toBePlayed) {
    //Filter for the buttons
    let filter = (i) => !i.user.bot && i.type === InteractionType.MessageComponent

    //Fetch the reply
    let message = await fetchReply(inter)

    //Await button interaction
    let buttonInteraction
    await message.awaitMessageComponent({ filter, time: trackDurationToMilliseconds(correctSong.duration) + 10000, max: 1 })
        .then(i => buttonInteraction = i)

    //Check if the button is the stop button
    if (JSON.parse(buttonInteraction.customId).id === 'Stop') {

        //Send message
        const result = createEmbed({
            author: { name: 'Se ha parado el trivia!', iconURL: buttonInteraction.user.displayAvatarURL() },
            color: 0xffa500
        })
        await reply(buttonInteraction, { embeds: [result], deleteTime: 1.5, propagate: false })

        //End trivia
        await endTrivia(inter, players)
    }
    else {
        if (JSON.parse(buttonInteraction.customId).id === correctSong.id) { //Correct answer

            //Add point to the player
            let player = players.find(p => p.user === buttonInteraction.user)
            if (player) player.score++
            else players.push({ user: buttonInteraction.user, score: 1 })

            //Send message
            const result = createEmbed({
                author: { name: `Correcto, ${buttonInteraction.user.tag}, +1 punto!`, iconURL: buttonInteraction.user.displayAvatarURL() },
                footer: { text: `La canción era ${(correctSong.title + ' - ' + correctSong.author).substring(0, 80)}` },
                color: 0xffa500
            })
            await reply(buttonInteraction, { embeds: [result], deleteTime: 1.5, propagate: false })
        }
        else { //Incorrect answer

            //Send message
            const result = createEmbed({
                author: { name: `Incorrecto, ${buttonInteraction.user.tag}, tal vez la próxima vez!`, iconURL: buttonInteraction.user.displayAvatarURL() },
                footer: { text: `La canción era ${(correctSong.title + ' - ' + correctSong.author).substring(0, 80)}` },
                color: 0xffa500
            })
            await reply(buttonInteraction, { embeds: [result], deleteTime: 1.5, propagate: false })
        }

        //Start new round
        await triviaRound(inter, players, results, toBePlayed)
    }

}

/**
 * End the trivia
 * @param {Interaction} inter Interaction
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 */
async function endTrivia(inter, players) {

    //Show leaderboard
    await reply(inter, { embeds: [createLeaderboard(players, true)], ephemeral: false, })

    //Delete queue
    const queue = useQueue(inter.guildId)
    if (queue) queue.delete()
}

/**
 * Convert track duration to milliseconds
 * @param {string} duration Duration of the track, format: mm:ss
 * @returns {number} Duration in milliseconds
 */
function trackDurationToMilliseconds(duration) {
    const [minutes, seconds] = duration.split(':').map(Number)
    return (minutes * 60 + seconds) * 1000
}

/**
 * Play a round of trivia
 * @param {Interaction} inter Interaction
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 * @param {SearchResult} results Entire playlist
 * @param {Array<Track>} toBePlayed Songs that have not been played yet
 */
async function triviaRound(inter, players, results, toBePlayed) {
    //Check if there are songs left
    if (toBePlayed.length === 0) return await endTrivia(inter, players)

    //Select song to be played
    const { correctSong, songs } = selectSong(results, toBePlayed)

    //Play song
    await playSong(inter, correctSong)

    //Create buttons row and leaderboard
    const buttonsRow = createButtons(songs)
    const leaderboard = createLeaderboard(players, false)

    //Send message
    await reply(inter, { embeds: [leaderboard], components: [buttonsRow] })

    //Await interaction of the player with the buttons
    await awaitInteraction(inter, players, correctSong, results, toBePlayed)
}