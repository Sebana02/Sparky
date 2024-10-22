const { createEmbed } = require('@utils/embed/embed-utils')
const { SearchResult, Track, GuildQueue } = require('discord-player')
const { Client, EmbedBuilder } = require('discord.js')
const { LyricsData } = require('@discord-player/extractor')
const { fetchObject } = require('@utils/language-utils.js')

//Preload literals
const literals = fetchObject('utils.embed.music_presets')

// Color scheme for the music embeds
const ColorScheme = {
  error: 0xff2222, // Dark red for errors
  playing: 0x13f857, // Green for playing
  added: 0x40e0d0, // Turquoise for added
  general: 0xffa500 // Orange for general
}

/**
 * Preset music embed for different situations
 */
module.exports = {
  /**
   * Generates an error embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The error embed
   */
  musicError: (client) => {
    return createEmbed({
      color: ColorScheme.error,
      author: {
        name: literals.error,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a no results embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The no results embed
   */
  noResults: (client) => {
    return createEmbed({
      color: ColorScheme.error,
      author: {
        name: literals.no_results,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a no playlist embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The no results embed
   */
  noPlaylist: (client) => {
    return createEmbed({
      color: ColorScheme.error,
      author: {
        name: literals.no_playlist,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a no queue embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The no queue embed
   */
  noQueue: (client) => {
    return createEmbed({
      color: ColorScheme.error,
      author: {
        name: literals.no_queue,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a no history embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The no history embed
   */
  noHistory: (client) => {
    return createEmbed({
      color: ColorScheme.error,
      author: {
        name: literals.no_history,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a no lyrics embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The no lyrics embed
   */
  noLyrics: (track) => {
    return createEmbed({
      color: ColorScheme.error,
      author: {
        name: literals.no_lyrics,
        iconURL: track.thumbnail
      }
    })
  },

  /**
   * Generates an added to queue embed.
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The added to queue embed
   */
  addToQueue: (track) => {
    return createEmbed({
      color: ColorScheme.added,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: literals.add_to_queue
      }
    })
  },

  /**
   * Generates an added to queue many embed
   * @param {SearchResult} results - The results object
   * @returns {EmbedBuilder} - The added to queue many embed
   */
  addToQueueMany: (results) => {
    return createEmbed({
      color: ColorScheme.added,
      author: {
        name: literals.add_to_queue_many.title(results.tracks.length),
        iconURL: results.tracks[0].thumbnail
      },
      footer: {
        text: literals.add_to_queue_many.description
      }
    })
  },

  /**
   * Generates a previous track embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The previous track embed
   */
  previousTrack: (track) => {
    return createEmbed({
      color: ColorScheme.added,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: literals.previous_track
      }
    })
  },

  /**
   * Generates a stopped embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The stopped embed
   */
  stop: (client) => {
    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: literals.stop,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a paused embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The paused embed
   */
  pause: (track) => {
    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: literals.pause
      }
    })
  },

  /**
   * Generates a resumed embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The resumed embed
   */
  resume: (track) => {
    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: literals.resume
      }
    })
  },

  /**
   * Generates a cleared embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The cleared embed
   */
  clear: (client) => {
    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: literals.clear,
        iconURL: client.user.displayAvatarURL()
      }
    })
  },

  /**
   * Generates a loop embed
   * @param {number} repeatMode - The repeat mode
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The loop embed
   */
  loop: (repeatMode, track) => {
    const names = [
      literals.loop.modes.off,
      literals.loop.modes.track,
      literals.loop.modes.queue,
      literals.loop.modes.autoplay
    ]

    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: literals.loop(names[repeatMode]),
        iconURL: track.thumbnail
      }
    })
  },

  /**
   * Generates a queue embed
   * @param {GuildQueue} queue - The queue object
   * @returns {EmbedBuilder} - The queue embed
   */
  currentQueue: (queue) => {
    const methods = ['', '| 🔂', '| 🔁', '| 🔀']
    const nextSongs = queue.getSize() > 5 ?
      literals.current_queue.next_songs.add(queue.getSize() - 5) :
      literals.current_queue.next_songs.no_add(queue.getSize())
    const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`)

    return createEmbed({
      color: ColorScheme.general,
      thumbnail: queue.currentTrack.thumbnail,
      description: `${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`,
      author: {
        name: `${queue.currentTrack.title} | ${queue.currentTrack.author} ${methods[queue.repeatMode]}`
      },
      footer: {
        text: literals.current_queue.response
      }
    })
  },

  /**
   * Generates a volume embed
   * @param {number} vol - The new volume
   * @param {Track} track - The track object
   */
  volume: (vol, track) => {
    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: literals.volume(vol),
        iconURL: track.thumbnail
      }
    })
  },

  /**
   * Generates a lyrics embed
   * @param {LyricsData} lyricsData - The lyrics object
   * @returns {EmbedBuilder} - The lyrics embed
   */
  lyrics: (lyricsData) => {
    const trimmedLyrics = lyricsData.lyrics.substring(0, 1997)

    return createEmbed({
      color: ColorScheme.general,
      title: lyricsData.title,
      url: lyricsData.url,
      thumbnail: lyricsData.thumbnail,
      author: {
        name: lyricsData.artist.name,
        iconURL: lyricsData.artist.image,
        url: lyricsData.artist.url
      },
      description: trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
    })
  },

  /**
   * Generates a skip embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The skip embed
   */
  skip: (track) => {
    return createEmbed({
      color: ColorScheme.general,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: literals.skip
      }
    })
  },

  /**
   * Generates a now playing embed
   * @param {GuildQueue} queue - The queue object
   * @returns {EmbedBuilder} - The now playing embed
   */
  nowPlaying: (queue, player) => {
    const track = queue.currentTrack
    const loopModes = [
      literals.loop.modes.off,
      literals.loop.modes.track,
      literals.loop.modes.queue,
      literals.loop.modes.autoplay
    ]

    return createEmbed({
      color: ColorScheme.playing,
      thumbnail: track.thumbnail,
      title: `${track.title} | ${track.author}`,
      description: literals.now_playing(player.volume, track.duration, player.createProgressBar(), loopModes[queue.repeatMode], track.requestedBy)
    })
  },

  /**
   * Generates a shuffle embed
   * @param {GuildQueue} queue - The queue object
   * @returns {EmbedBuilder} - The shuffle embed
   */
  shuffle: (queue) => {
    return createEmbed({
      color: ColorScheme.general,
      author: { name: literals.shuffle.title(queue.tracks.size), iconURL: queue.currentTrack.thumbnail },
      footer: { text: literals.shuffle.description }
    })
  },

  /**
   * Generates a save embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The save embed
   */
  savePrivate: (track) => {
    return createEmbed({
      color: ColorScheme.general,
      title: `:arrow_forward: ${track.title}`,
      thumbnail: track.thumbnail,
      fields: [
        { name: ':hourglass: Duration:', value: `\`${track.duration}\``, inline: true },
        { name: 'Song by:', value: `\`${track.author}\``, inline: true },
        { name: 'Views :eyes:', value: `\`${Number(track.views).toLocaleString()}\``, inline: true },
        { name: 'Song URL:', value: `\`${track.url}\`` }
      ]
    })
  },

  /**
   * Generates a save embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The save embed
   */
  save: (track) => {
    return createEmbed({
      color: ColorScheme.general,
      author: { name: `${track.title} | ${track.author}`, iconURL: track.thumbnail },
      footer: { text: literals.save }
    })
  },

  /**
   * Generates a playing embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The playing embed
   */
  playing: (track) => {
    return createEmbed({
      color: ColorScheme.playing,
      author: { name: `${track.title} | ${track.author}`, iconURL: track.thumbnail },
      footer: { text: literals.playing }
    })
  },

  /**
   * Generates a empty channel embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The empty channel embed
   */
  emptyChannel: (client) => {
    return createEmbed({
      color: ColorScheme.general,
      author: { name: literals.empty_channel, iconURL: client.user.displayAvatarURL() }
    })
  },

  /**
     * Generates a empty queue embed
     * @param {Client} client - The Discord client object
     * @returns {EmbedBuilder} - The empty channel embed
     */
  emptyQueue: (client) => {
    return createEmbed({
      color: ColorScheme.general,
      author: { name: literals.empty_queue, iconURL: client.user.displayAvatarURL() }
    })
  },

}
