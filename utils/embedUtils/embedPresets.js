const { createEmbed } = require('@utils/embedUtils/embedUtils')
const { SearchResult, Track, GuildQueue } = require('discord-player')
const { Client, EmbedBuilder } = require('discord.js')

/**
 * Preset embed for different situations
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
  }
}
