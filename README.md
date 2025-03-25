# PROJECT IS BEING UPDATED TO TYPESCRIPT, README IS OUTDATED

Some parts of the project are yet to be translated into TypeScript, and the README is one of them. The project is being updated to TypeScript to improve code quality and maintainability. The README will be updated soon to reflect the changes and provide accurate information about the project.

# Sparky

> This Discord bot is designed to be an easy and customizable solution for your servers. Ideal for groups of friends, the bot offers a variety of fun and useful commands that enhance chat experience and community interaction.

## Table of Contents

- [PROJECT IS BEING UPDATED TO TYPESCRIPT, README IS OUTDATED](#project-is-being-updated-to-typescript-readme-is-outdated)
- [Sparky](#sparky)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Requirements and Installation](#requirements-and-installation)
  - [Configuration](#configuration)
    - [`.env file`](#env-file)
    - [`Create a new command`](#create-a-new-command)
    - [`Create a new event`](#create-a-new-event)
  - [Commands](#commands)
    - [`Fun commands`](#fun-commands)
    - [`Game commands`](#game-commands)
    - [`Information Commands`](#information-commands)
    - [`Moderation Commands`](#moderation-commands)
    - [`Music Commands`](#music-commands)
    - [`Utility Commands`](#utility-commands)
  - [Events](#events)
    - [`Client`](#client)
    - [`Music`](#music)
    - [`Process`](#process)
  - [Utils](#utils)
  - [Supported languages](#supported-languages)
  - [TODO](#todo)
    - [`Laguages`](#laguages)
    - [`General`](#general)
    - [`IAs`](#ias)
    - [`Embeds`](#embeds)
    - [`Moderation commands`](#moderation-commands-1)
    - [`Security`](#security)
    - [`Update README`](#update-readme)
  - [Known Issues](#known-issues)
  - [License](#license)

## Features

- **Music Control**: Sparky provides full music functionality including play, pause, skip, queue management, volume adjustment, and looping. It supports various music platforms like YouTube, Spotify, and SoundCloud.
- **Moderation Commands**: Sparky helps keep your server under control with commands for banning, kicking, muting, and managing channels. You can also create and manage roles easily.
- **Fun Commands**: Add fun to your server with meme GIFs, cat and dog images, virtual hugs, slaps, and other interactive commands that make the chat experience more lively.
- **Game Commands**: Engage users with built-in games like hangman, rock-paper-scissors (rps), and tic-tac-toe. Users can challenge each other and compete in these fun, light-hearted games.
- **Utility Commands**: Sparky includes useful tools like polls for gathering opinions, reminders for scheduling tasks, and a ping command to check latency.
- **Information Commands**: Get quick insights such as bot uptime or perform Wikipedia searches right from the chat.
- **Configurable Settings**: With the `.env` file, you can customize the bot’s behavior, including token configuration, activity status, DJ role permissions, and more.
- **Slash Command Support**: Sparky exclusively uses modern Discord slash commands, making the bot intuitive to use and easy to interact with.
- **Multi-language Support**: Currently supports Spanish and English, with plans to support additional languages in the future. You can easily modify the bot to support your language (see TODO).

## Requirements and Installation

To install and run the bot locally, follow these steps:

1. Install Node.js and npm from [here](https://nodejs.org/en/download/).

2. Clone the repository:

   ```bash
   git clone https://github.com/Sebana02/Sparky.git
   ```

3. Navigate to the project directory:

   ```bash
   cd Sparky
   ```

4. Install the dependencies:

   ```bash
   npm install
   ```

5. Create a `.env` file in the root of the project with the following information:

   ```bash
   TOKEN=your_discord_bot_token_here
   ```

   You can configure other settings in the `.env` file as well, check the [Configuration](#configuration) section for more details.

6. Start the bot:

   ```bash
   npm run start
   ```

7. Or else start the bot in development mode:

   ```bash
   npm run dev
   ```

   This will start the bot in development mode, allowing you to test changes without restarting the bot. Just save the changes, and the bot will automatically reload.

8. The bot should now be running and connected to your Discord server!

9. If you want to shut down the bot just press `Ctrl + C` in the terminal where the bot is running to send a SIGINT signal to the process.

## Configuration

### `.env file`

The bot has the following configurations through the `.env` file:

- `TOKEN`: The Discord authentication token. Required for the bot to connect to Discord.
- `LOG_FILE`: The file where logs will be stored. If not specified, logs will be stored in **.log** file in the root of the project.
- `LANGUAGE`: The language the bot will use. If not specified, the bot will use the default language (en_US). Take into account that it has to match the name of a folder in the `locales` folder. It is recommend to use `IETF BCP 47` rule for clarity.
- `GUILD_ID`: The ID of the server where the bot will be used. If not specified, the bot will register commands globally, which can take up to an hour to be available.
- `PLAYING_ACTIVITY`: The activity status of the bot. If left empty, the bot will not display any activity status.
- `TENOR_API_KEY`: The API key for the Tenor GIF API. Required for GIF commands, you can get one [here](https://tenor.com/developer/keysignup).
- `DJ_ROLE`: The role ID that will have DJ permissions. If specified, only users with this role will be able to control the music bot.

Here is an example of a `.env` file with all the configurations:

```bash
TOKEN="your_discord_bot_token_here"
LOG_FILE="bot.log"
LANGUAGE="en_US"
GUILD_ID="your_guild_id_here"
PLAYING_ACTIVITY="with Sparky | /help"
TENOR_API_KEY="your_tenor_api_key_here"
DJ_ROLE="your_dj_role_id_here"
```

---

### `Create a new command`

Any new command must be created in the `commands` folder, as this is where the bot will search for commands. The folder structure can be organized as needed, but it is recommended to create a subfolder for each command category.

Each command must be a `.ts` file and must export an [`ICommand`](src/interfaces/command.interface.ts) object with the following properties:

- **`data`** _([`SlashCommandBuilder`](https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder))_:  
  The Discord command.

- **`voiceChannel`** _(optional, boolean, default: `false`)_:  
  Indicates whether the command requires the user to be in a voice channel.

- **`blockedInDMs`** _(optional, boolean, default: `false`)_:  
  Indicates whether the command is blocked in DMs.

- **`execute(`[`client`](https://discord.js.org/#/docs/discord.js/main/class/Client)`,`[`interaction`](https://discord.js.org/#/docs/discord.js/main/class/ChatInputCommandInteraction)`, ...args)`** _(async function)_:  
  The function executed when the command is invoked

Here is a basic command that replies with a greeting:

```typescript
import { ICommand } from '../../interfaces/command.interface.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

export const command: ICommand = {
  data: new SlashCommandBuilder().setName('greetings').setDescription('Greets the user'),

  voiceChannel: false,
  blockedInDMs: false,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    await inter.reply('Hello! How can I help you today?');
  },
};
```

---

### `Create a new event`

Any new events must be created in the `events` folder as it is the path where the bot will look for events. Inside the folder, any substructure can be followed, as the bot will search for events recursively, although it is recommended to create a folder for each category of events.

'Events' must be `.ts` files and must export a [IEvent](src/interfaces/event.interface.ts) object with the following parameters:

- **`name`** _(string)_:  
  The name of the event to listen to. It must match the name of the event emitted by the emitter (see documentation for each emitter).

- **`emitter`** _(Emitter)_:  
  The emitter of the event. It can take values from the `Emitter` enum, which is in the same file as the `IEvent` interface. The possible values are:

  - `Process`: Corresponds to the [`Node process`](https://nodejs.org/api/process.html#process-events).
  - `Client`: Corresponds to the [`Discord client`](https://discord.js.org/#/docs/main/stable/class/Client).
  - `Music`: Corresponds to the [`Discord player library`](https://discord-player.js.org/docs/discord-player/type/GuildQueueEvents).

- **`execute(`[`client`](https://discord.js.org/#/docs/discord.js/main/class/Client)`, ...args)`** _(async function)_:  
  The function executed when the event is triggered.

Here is a basic example of an event that logs when the bot is ready:

```typescript
import { IEvent } from '../../interfaces/event.interface.js';
import { Client } from 'discord.js';

export const event: IEvent = {
  name: 'ready',
  execute: async (client: Client): Promise<void> => {
    console.log(`Logged in as ${client.user.tag}!`);
  },
};
```

## Commands

The bot can be invoked using Discord's slash commands. Sparky offers a variety of commands that can be used to interact with the bot and enhance the chat experience. The commands are divided into categories based on their functionality:

### `Fun commands`

These commands are designed to add fun and entertainment to the chat experience. They include GIFs, memes, and interactive actions like hugs, pokes, and slaps.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/cat` | Sends a random cat GIF | `/cat` | GIFs | [`cat.ts`](src/commands/fun/gif/cat.ts) |
| `/dog` | Sends a random dog GIF | `/dog` | GIFs | [`dog.ts`](src/commands/fun/gif/dog.ts) |
| `/gif <category>` | Sends a random GIF based on the specified `category`. | `/gif weird` | GIFs | [`gif.ts`](src/commands/fun/gif/gif.ts) |
| `/hug <user>` | Sends a GIF giving a hug to a specified `user`. | `/hug @Dave` | GIFs | [`hug.ts`](src/commands/fun/gif/hug.ts) |
| `/meme` | Sends a random meme GIF. | `/meme` | GIFs | [`meme.ts`](src/commands/fun/gif/meme.ts) |
| `/poke <user>` | Sends a GIF poking a specified `user`. | `/poke @Dave` | GIFs | [`poke.ts`](src/commands/fun/gif/poke.ts) |
| `/shutup <user>` | Sends a GIF telling the mentioned `user` to shut up. | `/shutup @Dave` | GIFs | [`shut-up.ts`](src/commands/fun/gif/shut-up.ts) |
| `/slap <user>` | Sends a GIF slapping a specified `user`. | `/slap @Dave` | GIFs | [`slap.ts`](src/commands/fun/gif/slap.ts) |
| `/coinflip` | Flips a coin and returns heads or tails. | `/coinflip` | None | [`coin-flip.ts`](src/commands/fun/coin-flip.ts) |
| `/8ball <question>` | Answers a `question` with a random 8-ball response. | `/8ball Will I win the lottery?` | None | [`8ball.ts`](src/commands/fun/8ball.ts) |

### `Game commands`

These commands are designed to engage users with fun and interactive games. Users can play hangman, rock-paper-scissors, and tic-tac-toe among other games.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/hangman <gamemode>` | Starts a game of hangman. If `random` gamemode is selected, bot will choose the word. If `custom` gamemode is selected, one of the players will choose the word. | `/hangman random` | None | [`hangman.ts`](src/commands/game/hangman.ts) |
| `/rps <opponent>` | Plays a game of rock-paper-scissors against the specified `opponent`. | `/rps @Dave` | None | [`rps.ts`](src/commands/game/rps.ts) |
| `/tictactoe <opponent>` | Starts a game of tic-tac-toe with a specified `opponent`. | `/tictactoe @Dave` | None | [`tictactoe.ts`](src/commands/game/tictactoe.ts) |
| `/trivia <playlist>` | Starts a game of musical trivia with your `playlist` songs. | `/trivia your_playlist_link_here` | None | [`trivia.ts`](src/commands/game/trivia.ts) |

### `Information Commands`

These commands provide quick insights and information to users, including the bot's uptime and Wikipedia searches.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/help` | Displays a list of available commands. | `/help` | None | [`help.ts`](src/commands/info/help.ts) |
| `/uptime` | Displays the bot's uptime | `/uptime` | None | [`uptime.ts`](src/commands/info/uptime.ts) |
| `/wikisearch <query>` | Searches Wikipedia for the specified `query` | `/wikisearch Discord` | None | [`wiki-search.ts`](src/commands/info/wiki-search.ts) |

### `Moderation Commands`

These commands help maintain order and control in the server by providing tools for managing users, roles, and channels.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/hidechannel [channel]` | Hides the specified `channel` from view for users, making it inaccessible until unhidden. If no channel is specified, it hides the channel where the command is used. It can be used both on text and voice channels. | `/hidechannel general` | Channel | [`hide-channel.ts`](src/commands/moderation/channel/hide-channel.ts) |
| `/showchannel [channel]` | Unhides the specified `channel`, making it visible again to users who have access. If no channel is specified, it unhides the channel where the command is used. It can be used both on text and voice channels. | `/showchannel general` | Channel | [`show-channel.ts`](src/commands/moderation/channel/show-channel.ts) |
| `/mutechannel [channel]` | Mutes the specified `channel`, preventing users from sending messages in that channel. If no channel is specified, it mutes the channel where the command is used. It can be used both on text and voice channels. | `/mutechannel general` | Channel | [`mute-channel.ts`](src/commands/moderation/channel/mute-channel.ts) |
| `/unmutechannel [channel]` | Unmutes the specified `channel`, allowing users to send messages once more. If no channel is specified, it unmutes the channel where the command is used. It can be used both on text and voice channels. | `/unmutechannel general` | Channel | [`unmute-channel.ts`](src/commands/moderation/channel/unmute-channel.ts) |
| `/purge [amount]` | Deletes a specified `amount` of messages in the channel, helping to clean up chat clutter. | `/purge 10` | Channel | [`purge.ts`](src/commands/moderation/channel/purge.ts) |
| `/createrole <roleName> [color]` | Creates a new role with the specified `roleName` and, optionally, a `color` in hexadecimal format (#abc123) | `/createrole Admin #FFFFFF` | Role | [`create-role.ts`](src/commands/moderation/role/createrole.ts) |
| `/ban <user>` | Bans a specified `user` from the server, preventing them from joining or interacting with the server. | `/ban @Dave` | User | [`ban.ts`](src/commands/moderation/user/ban.ts) |
| `/unban <user>` | Unbans a specified `user` from the server, allowing them to rejoin and interact with the community. | `/unban @Dave` | User | [`unban.ts`](src/commands/moderation/user/unban.ts) |
| `/bannedlist` | Displays a list of banned users, providing insight into who is currently banned from the server. | `/bannedlist` | User | [`banned-list.ts`](src/commands/moderation/user/banned-list.ts) |
| `/kick <user>` | Kicks a specified `user` from the server, temporarily removing them from the community. | `/kick @Dave` | User | [`kick.ts`](src/commands/moderation/user/kick.ts) |
| `/mute <user>` | Mutes a specified `user` in the server, preventing them from speaking in voice channels or sending messages in text channels. | `/mute @Dave` | User | [`mute.ts`](src/commands/moderation/user/mute.ts) |
| `/unmute <user>` | Unmutes a specified `user`, allowing them to speak in voice channels and send messages again. | `/unmute @Dave` | User | [`unmute.ts`](src/commands/moderation/user/unmute.ts) |
| `/mutedlist` | Displays a list of muted users, showing who is currently unable to send messages or speak. | `/mutedlist` | User | [`muted-list.ts`](src/commands/moderation/user/muted-list.ts) |
| `/setnickname <user> <nickname>` | Sets a `nickname` for a specified `user`, allowing for personalized identification within the server. | `/setnickname @Dave IamNotDave` | User | [`set-nickname.ts`](src/commands/moderation/user/set-nickname.ts) |
| `/resetnickname <user>` | Resets the nickname for a specified `user` to their original username, removing any custom nickname they had. | `/resetnickname @Dave` | User | [`reset-nickname.ts`](src/commands/moderation/user/reset-nickname.ts) |
| `/timeout <user> <reason> <duration>` | Times out a specified `user` for a `reason`, for `duration` minutes, preventing them from sending messages or speaking during that time. | `/timeout @Dave 10` | User | [`timeout.ts`](src/commands/moderation/user/timeout.ts) |
| `/warn <user> <reason>` | Issues a warning to a specified `user`, providing a `reason` for the warning to maintain accountability. | `/warn @Dave Too many infractions` | User | [`warn.ts`](src/commands/moderation/user/warn.ts) |

### `Music Commands`

These commands are designed to control the music player and queue. Users can play, pause, skip, and manage the music queue with these commands.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/back` | Plays the previous song in the queue. | `/back` | Playback | [`back.ts`](src/commands/music/playback/back.ts) |
| `/clear` | Clears the music queue. | `/clear` | Queue | [`clear.ts`](src/commands/music/queue/clear.ts) |
| `/loop <mode>` | Loops the current song or queue. `Mode` can be `song`, `queue`,`autoplay` or `off`. | `/loop song` | Playback | [`loop.ts`](src/commands/music/playback/loop.ts) |
| `/lyrics` | Fetches and displays the lyrics of the currently playing song. | `/lyrics` | Insight | [`lyrics.ts`](src/commands/music/insight/lyrics.ts) |
| `/nowplaying` | Displays information about the currently playing song and the queue. | `/nowplaying` | Insight | [`now-playing.ts`](src/commands/music/insight/now-playing.ts) |
| `/pause` | Pauses the currently playing song. | `/pause` | Playback | [`pause.ts`](src/commands/music/playback/pause.ts) |
| `/play <query>` | Plays a song or playlist from YouTube or a supported URL, including Spotify, Souncloud and other sources. `Query` can be a URL, a song's name or even an author | `/play greedy` | Playback | [`play.ts`](src/commands/music/playback/play.ts) |
| `/playnext <query>` | Adds a song to the queue to play after the current song. | `/playnext Paramore` | Playback | [`play-next.ts`](src/commands/music/playback/play-next.ts) |
| `/queue` | Shows the current music queue. | `/queue` | Queue | [`queue.ts`](src/commands/music/queue/queue.ts) |
| `/resume` | Resumes a paused song. | `/resume` | Playback | [`resume.ts`](src/commands/music/playback/resume.ts) |
| `/save` | Saves the currently playing song to your DMs | `/save` | Insight | [`save.ts`](src/commands/music/insight/save.ts) |
| `/shuffle` | Shuffles the songs in the current queue. | `/shuffle` | Queue | [`shuffle.ts`](src/commands/music/queue/shuffle.ts) |
| `/skip` | Skips the current song. | `/skip` | Playback | [`skip.ts`](src/commands/music/playback/skip.ts) |
| `/stop` | Stops the music and clears the queue. | `/stop` | Playback | [`stop.ts`](src/commands/music/playback/stop.ts) |
| `/volume <level>` | Adjusts the volume of the music player to the specified `level` (0-100). | `/volume 50` | Playback | [`volume.ts`](src/commands/music/playback/volume.ts) |

### `Utility Commands`

These commands provide useful tools for managing polls, reminders, and checking the bot's response time.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/disconnect` | Disconnects the bot from the voice channel. | `/disconnect` | None | [`disconnect.ts`](src/commands/utility/disconnect.ts) |
| `/ping` | Checks the bot's response time and latency. | `/ping` | None | [`ping.ts`](src/commands/utility/ping.ts) |
| `/poll <question> <possible answers> <time>` | Creates a poll with the specified `question` for users to vote on during specified `time`. | `/poll What's your favorite food? Pizza,Salad,Sushi` | None | [`poll.ts`](src/commands/utility/poll.ts) |
| `/remind <time> <reminder>` | Sets a `reminder` for the specified `time` duration. | `/remind 10m I am a reminder` | None | [`remind.ts`](src/commands/utility/remind.ts) |

## Events

The bot has a series of callbacks that are executed when certain events occur. These events are located in the `events` folder and are divided into emitters. Each emitter has a series of events that can be listened to. The bot will automatically register these events when the bot starts. The events are divided into the following emitters:

### `Client`

These events are emitted by the Discord client and are related to the bot's connection and status.

| Event | Description | File |
| --- | --- | --- |
| `ready` | Emitted when the bot is ready to start receiving commands. | [`ready.ts`](src/events/client/ready.ts) |
| `interactionCreate` | Emitted when an interaction is created. | [`interaction-create.ts`](src/events/client/interaction-create.ts) |
| `guildMemberAdd` | Emitted when a new member joins the server. | [`guild-member-add.ts`](src/events/client/guild-member-add.ts) |

### `Music`

These events are emitted by the music player and are related to the music player's status and actions.

| Event | Description | File |
| --- | --- | --- |
| `emptyQueue` | Emitted when the queue is empty. | [`empty-queue.ts`](src/events/music/empty-queue.ts) |
| `emptyChannel` | Emitted when the bot leaves the voice channel. | [`empty-channel.ts`](src/events/music/empty-channel.ts) |
| `error` | Emitted when an error occurs. | [`error.ts`](src/events/music/error.ts) |
| `playerError` | Emitted when an error occurs in the player. | [`player-error.ts`](src/events/music/player-error.ts) |
| `playerStart` | Emitted when the player starts playing a song. | [`player-start.ts`](src/events/music/player-start.ts) |

### `Process`

These events are emitted by the process and are related to the node process status.

| Event | Description | File |
| --- | --- | --- |
| `exit` | Emitted when the process is about to exit. | [`exit.ts`](src/events/process/exit.ts) |
| `SIGINT` | Emitted when the process receives a SIGINT signal. | [`SIGINT.ts`](src/events/process/SIGINT.ts) |
| `unhandledRejection` | Emitted when an unhandled promise rejection occurs. | [`unhandled-rejection.ts`](src/events/process/unhandled-rejection.ts) |
| `uncaughtException` | Emitted when an uncaught exception occurs. | [`uncaught-exception.ts`](src/events/process/uncaught-exception.ts) |

## Utils

In the `utils` folder, you can find a series of utility classes that can be used throughout the bot. These functions are designed to help with common tasks and can be used in any part of the bot:

| Utility | Description | File |
| --- | --- | --- |
| `CommandErrorHandler` | Wrapper class to handle errors in commands. | [`command-error-handler.ts`](src/utils/error-handler/command-error-handler.ts) |
| `MusicPresets` | Functions to create embeds specifically for music commands. | [`music-presets.ts`](src/utils/embed/music-presets.ts) |
| `EmbedUtils` | Functions to create and manage embeds for various purposes. | [`embed_utils.ts`](src/utils/embed_utils.ts) |
| `EventErrorHandler` | Wrapper class to handle errors occurring in events. | [`event-error-handler.ts`](src/utils/error-handler/event-error-handler.ts) |
| `GifUtils` | Utility class to retrieve and send GIFs. | [`gif-utils.ts`](src/utils/gif-utils.ts) |
| `InteractionUtils` | Wrapper class to simplify interaction management. | [`interaction-utils.ts`](src/utils/interaction-utils.ts) |
| `Permissions` | Utility class to check and manage user permissions. | [`permissions.ts`](src/utils/permissions.ts) |

## Supported languages

Currently, the bot only supports Spanish, but more languages will be added in the future:

- [x] Spanish
- [ ] English

You can always modify the bot to support your language.

## TODO

### `Laguages`

### `General`

- [ ] Create a config.ts file to load env variables
- [ ] use subcommands when possible
- [ ] Translate moderation commands
- [ ] Change use of presets in music commands and events
- [ ] Improve visuals and embeds

### `IAs`

- [ ] rps
- [ ] TicTacToe

### `Embeds`

### `Moderation commands`

- [ ] Addrole command
- [ ] Removerole command
- [ ] Createrole command
- [ ] Deleterole command
- [ ] Show permissions command
- [ ] Show roles of a user command
- [ ] Create channel command
- [ ] Delete channel command

- [ ] Add pagination to bannedlist and mutedlist

### `Security`

- [ ] Add a way to avoid users using commands in certain channels
- [ ] More checks regarding who can receive certain commands

### `Update README`

- [ ] Logger
- [ ] Language architecture, template for language, how to add
- [ ] How loading works
- [ ] Change everything about ts
- [ ] Interfaces
- [ ] Dependencies part
- [ ] Merge "how to" into commands and events
- [ ] Check every command, event, util

## Known Issues

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
