const { createEmbed } = require('@utils/embedUtils')
const { SearchResult, Track, GuildQueue } = require('discord-player')
const { Client, EmbedBuilder } = require('discord.js')
const { LyricsData } = require('@discord-player/extractor')


/**
 * Preset music embed for different situations
 */
module.exports = {
  /**
   * Generates an error embed
   * @param {Client} client - The Discord client object
   * @returns {EmbedBuilder} - The error embed
   */
  error: (client) => {
    return createEmbed({
      color: 0xff2222,
      author: {
        name: "Ha ocurrido un error",
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
      color: 0xff2222,
      author: {
        name: 'No hay resultados',
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
      color: 0xff2222,
      author: {
        name: 'Asegúrate que el link sea de una playlist y tenga al menos 5 canciones',
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
      color: 0xff2222,
      author: {
        name: 'No hay música reproduciendose',
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
      color: 0xff2222,
      author: {
        name: 'No hay historial',
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
      color: 0xff2222,
      author: {
        name: 'No hay letra para esta canción',
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
      color: 0xffa500,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: 'añadida a la cola'
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
      color: 0xffa500,
      author: {
        name: `${results.tracks.length} canciones`,
        iconURL: results.tracks[0].thumbnail
      },
      footer: {
        text: 'añadidas a la cola'
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
      color: 0xffa500,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: 'reproduciendo canción anterior'
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
      color: 0xffa500,
      author: {
        name: 'Se ha parado la música',
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
      color: 0xffa500,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: 'pausada'
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
      color: 0xffa500,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: 'reanudada'
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
      color: 0xffa500,
      author: {
        name: `Cola de reproducción vaciada`,
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
    const names = ['desactivado', 'canción', 'cola', 'autoplay']

    return createEmbed({
      color: 0xffa500,
      author: {
        name: `Loop: ${names[repeatMode]}`,
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
    const nextSongs = queue.getSize() > 5 ? `Y otras **${queue.getSize() - 5}** canciones...` : `**${queue.getSize()}** canciones...`
    const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`)

    return createEmbed({
      color: 0xffa500,
      thumbnail: queue.currentTrack.thumbnail,
      setTimestamp: true,
      description: `${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`,
      author: {
        name: `${queue.currentTrack.title} | ${queue.currentTrack.author} ${methods[queue.repeatMode]}`
      },
      footer: {
        text: `en la cola`
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
      color: 0xffa500,
      author: {
        name: `Se ha modificado el volumen a ${vol}%`,
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
      color: 0xffa500,
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
      color: 0xffa500,
      author: {
        name: `${track.title} | ${track.author}`,
        iconURL: track.thumbnail
      },
      footer: {
        text: 'saltada'
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
    const loopModes = ['desactivado', 'canción', 'cola', 'autoplay']

    return createEmbed({
      color: 0xffa500,
      thumbnail: track.thumbnail,
      title: `${track.title} | ${track.author}`,
      description: `Volumen **${player.volume}%**\nDuración **${track.duration}**\nProgreso ${player.createProgressBar()}\nLoop mode **${loopModes[queue.repeatMode]}**\nRequested by ${track.requestedBy}`
    })
  },

  /**
   * Generates a shuffle embed
   * @param {GuildQueue} queue - The queue object
   * @returns {EmbedBuilder} - The shuffle embed
   */
  shuffle: (queue) => {
    return createEmbed({
      color: 0xffa500,
      author: { name: `${queue.tracks.size} canciones`, iconURL: queue.currentTrack.thumbnail },
      footer: { text: 'se han barajeado' }
    })
  },

  /**
   * Generates a save embed
   * @param {Track} track - The track object
   * @returns {EmbedBuilder} - The save embed
   */
  savePrivate: (track) => {
    return createEmbed({
      color: 0xffa500,
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
      color: 0xffa500,
      author: { name: `${track.title} | ${track.author}`, iconURL: track.thumbnail },
      footer: { text: 'enviada al privado' }
    })
  }
}
