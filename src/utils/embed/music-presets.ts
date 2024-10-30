import { createEmbed } from './embed-utils.js';
import { SearchResult, Track, GuildQueue } from 'discord-player';
import { Client, EmbedBuilder } from 'discord.js';
import { LyricsData } from '@discord-player/extractor';
import { fetchFunction, fetchString } from '../language-utils.js';

// Color scheme for the music embeds
const enum ColorScheme {
  error = 0xff2222, // Dark red for errors
  playing = 0x13f857, // Green for playing
  added = 0x40e0d0, // Turquoise for added
  general = 0xffa500, // Orange for general
}

/**
 * Music embed preset for when there are no results
 * @param client - The Discord client object
 * @returns The no results embed
 */
export function musicError(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.error,
    author: {
      name: fetchString('music_presets.error'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Music embed preset for when there are no results
 * @param client - The Discord client object
 * @returns The no results embed
 */
export function noResults(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.error,
    author: {
      name: fetchString('music_presets.no_results'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Music embed preset for when results are not a playlist
 * @param client - The Discord client object
 * @returns The no playlist embed
 */
export function noPlaylist(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.error,
    author: {
      name: fetchString('music_presets.no_playlist'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Generates a no queue embed
 * @param client - The Discord client object
 * @returns The no queue embed
 */
export function noQueue(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.error,
    author: {
      name: fetchString('music_presets.no_queue'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Generates a no history embed
 * @param client - The Discord client object
 * @returns The no history embed
 */
export function noHistory(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.error,
    author: {
      name: fetchString('music_presets.no_history'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Generates a no lyrics embed
 * @param track - The track object
 * @returns The no lyrics embed
 */
export function noLyrics(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.error,
    author: {
      name: fetchString('music_presets.no_lyrics'),
      iconURL: track.thumbnail,
    },
  });
}

/**
 * Generates a added to queue embed.
 * @param track - The track object
 * @returns The added to queue embed
 */
export function addToQueue(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.added,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.add_to_queue'),
    },
  });
}

/**
 * Generates an added to queue many embed
 * @param results - The results object
 * @returns The added to queue many embed
 */
export function addToQueueMany(results: SearchResult): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.added,
    author: {
      name: fetchFunction('music_presets.add_to_queue_many.title')(results.tracks.length),
      iconURL: results.tracks[0].thumbnail,
    },
    footer: {
      text: fetchString('music_presets.add_to_queue_many.description'),
    },
  });
}

/**
 * Generates a previous track embed
 * @param track - The track object
 * @returns The previous track embed
 */
export function previousTrack(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.added,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.previous_track'),
    },
  });
}

/**
 * Generates a stopped embed
 * @param client - The Discord client object
 * @returns The stopped embed
 */
export function stop(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchString('music_presets.stop'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Generates a paused embed
 * @param track - The track object
 * @returns The paused embed
 */
export function pause(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.pause'),
    },
  });
}

/**
 * Generates a resumed embed
 * @param track - The track object
 * @returns The resumed embed
 */
export function resume(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.resume'),
    },
  });
}

/**
 * Generates a cleared embed
 * @param client - The Discord client object
 * @returns The cleared embed
 */
export function clear(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchString('music_presets.clear'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Generates a loop embed
 * @param repeatMode - The repeat mode
 * @param track - The track object
 * @returns The loop embed
 */
export function loop(repeatMode: number, track: Track): EmbedBuilder {
  const names = [
    fetchString('music_presets.loop.modes.off'),
    fetchString('music_presets.loop.modes.track'),
    fetchString('music_presets.loop.modes.queue'),
    fetchString('music_presets.loop.modes.autoplay'),
  ];

  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchFunction('music_presets.loop.response')(names[repeatMode]),
      iconURL: track.thumbnail,
    },
  });
}

/**
 * Generates a queue embed
 * @param queue - The queue object
 * @returns The queue embed
 */
export function currentQueue(queue: GuildQueue): EmbedBuilder {
  const methods = ['', '| 🔂', '| 🔁', '| 🔀'];
  const nextSongs =
    queue.getSize() > 5
      ? fetchFunction('music_presets.current_queue.next_songs.add')(queue.getSize() - 5)
      : fetchFunction('music_presets.current_queue.next_songs.no_add')(queue.getSize());

  const tracks = queue.tracks.map(
    (track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy?.username})`
  );

  return createEmbed({
    color: ColorScheme.general,
    thumbnail: queue.currentTrack?.thumbnail,
    description: `${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`,
    author: {
      name: `${queue.currentTrack?.title} | ${queue.currentTrack?.author} ${methods[queue.repeatMode]}`,
    },
    footer: {
      text: fetchString('music_presets.current_queue.response'),
    },
  });
}

/**
 * Generates a volume embed
 * @param vol - The new volume
 * @param track - The track object
 * @returns The volume embed
 */
export function volume(vol: number, track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchFunction('volume')(vol),
      iconURL: track.thumbnail,
    },
  });
}

/**
 * Generates a lyrics embed
 * @param lyricsData - The lyrics object
 * @returns The lyrics embed
 */
export function lyrics(lyricsData: LyricsData): EmbedBuilder {
  const trimmedLyrics = lyricsData.lyrics.substring(0, 1997);

  return createEmbed({
    color: ColorScheme.general,
    title: lyricsData.title,
    url: lyricsData.url,
    thumbnail: lyricsData.thumbnail,
    author: {
      name: lyricsData.artist.name,
      iconURL: lyricsData.artist.image,
    },
    description: trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics,
  });
}

/**
 * Generates a skipped embed
 * @param track - The track object
 * @returns The skipped embed
 */
export function skip(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.skip'),
    },
  });
}

/**
 * Generates a now playing embed
 * @param queue - The queue object
 * @param player - The player object
 * @returns The now playing embed
 */
export function nowPlaying(queue: GuildQueue, player: any): EmbedBuilder {
  const track = queue.currentTrack;
  const loopModes = [
    fetchString('music_presets.loop.modes.off'),
    fetchString('music_presets.loop.modes.track'),
    fetchString('music_presets.loop.modes.queue'),
    fetchString('music_presets.loop.modes.autoplay'),
  ];

  return createEmbed({
    color: ColorScheme.playing,
    thumbnail: track?.thumbnail,
    title: `${track?.title} | ${track?.author}`,
    description: fetchFunction('music_presets.now_playing')(
      player.volume,
      track?.duration,
      player.createProgressBar(),
      loopModes[queue.repeatMode],
      track?.requestedBy
    ),
  });
}

/**
 * Generates a shuffle embed
 * @param queue - The queue object
 * @returns The shuffle embed
 */
export function shuffle(queue: GuildQueue): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchFunction('music_presets.shuffle.title')(queue.tracks.size),
      iconURL: queue.currentTrack?.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.shuffle.description'),
    },
  });
}

/**
 * Generates a save embed
 * @param track - The track object
 * @returns The save embed
 */
export function savePrivate(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    title: `:arrow_forward: ${track.title}`,
    thumbnail: track.thumbnail,
    fields: [
      {
        name: ':hourglass: Duration:',
        value: `\`${track.duration}\``,
        inline: true,
      },
      { name: 'Song by:', value: `\`${track.author}\``, inline: true },
      {
        name: 'Views :eyes:',
        value: `\`${Number(track.views).toLocaleString()}\``,
        inline: true,
      },
      { name: 'Song URL:', value: `\`${track.url}\`` },
    ],
  });
}

/**
 * Generates a save embed
 * @param track - The track object
 * @returns The save embed
 */
export function save(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: fetchString('music_presets.save'),
    },
  });
}

/**
 * Generates a playing embed
 * @param track - The track object
 * @returns The playing embed
 */
export function playing(track: Track): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.playing,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: { text: fetchString('music_presets.playing') },
  });
}

/**
 * Generates an empty channel embed
 * @param track - The track object
 * @returns The empty channel embed
 */
export function emptyChannel(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchString('music_presets.empty_channel'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}

/**
 * Generates a empty queue embed
 * @param track - The track object
 * @returns The empty channel embed
 */
export function emptyQueue(client: Client): EmbedBuilder {
  return createEmbed({
    color: ColorScheme.general,
    author: {
      name: fetchString('music_presets.empty_queue'),
      iconURL: client.user?.displayAvatarURL(),
    },
  });
}
