# Sparky

> This Discord bot is designed to be an easy and customizable solution for your servers. Ideal for groups of friends, the bot offers a variety of fun and useful commands that enhance chat experience and community interaction.

## Table of Contents

- [Sparky](#sparky)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Bot setup](#bot-setup)
    - [Installation](#installation)
    - [Configuration](#configuration)
  - [Commands](#commands)
    - [List of available commands](#list-of-available-commands)
      - [Fun commands](#fun-commands)
      - [Game commands](#game-commands)
      - [Information commands](#information-commands)
      - [Moderation commands](#moderation-commands)
      - [Music commands](#music-commands)
      - [Utility commands](#utility-commands)
    - [Create a new command (for developers)](#create-a-new-command-for-developers)
  - [Events](#events)
    - [List of available events](#list-of-available-events)
      - [Client events](#client-events)
      - [Music events](#music-events)
      - [Process events](#process-events)
    - [Create a new event (for developers)](#create-a-new-event-for-developers)
  - [Utils (for developers)](#utils-for-developers)
  - [Logger](#logger)
    - [Usage (for developers)](#usage-for-developers)
  - [Languages](#languages)
    - [Supported languages](#supported-languages)
    - [Add a new language (for developers)](#add-a-new-language-for-developers)
  - [Fallback behavior](#fallback-behavior)
  - [Troubleshooting](#troubleshooting)
  - [Known Issues](#known-issues)
  - [Contributions](#contributions)
  - [License](#license)

## Features

- 🎵 **Advanced Music Control** – Play, pause, skip, loop, and manage your music queue seamlessly. Supports **YouTube, Spotify, and SoundCloud**.
- 🔨 **Powerful Moderation** – Keep your server safe with **ban, kick, mute**, and role management commands.
- 🎉 **Fun & Interaction** – Send **memes, GIFs, cat & dog pictures**, and interact with virtual **hugs, slaps**, and more.
- 🎮 **Mini Games** – Play **Hangman, Rock-Paper-Scissors, Tic-Tac-Toe**, and other fun challenges with friends.
- 🛠 **Useful Tools** – Create **polls**, set **reminders**, and check **server latency** in one command.
- 📚 **Instant Information** – Get **bot uptime, Wikipedia searches**, and quick data directly from chat.
- ⚙️ **Fully Configurable** – Customize **bot behavior, permissions, and activity status** through the `.env` and `src/config.ts` file.
- 🚀 **Modern Slash Commands** – Uses **Discord’s latest slash command system** for a smooth user experience.
- 🌍 **Multi-language Support** – Available in **English & Spanish**, with more languages coming soon!

## Bot setup

### Installation

To install and run the bot locally, follow these steps:

1. Install Node.js and npm from [here](https://nodejs.org/en/download/).
2. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Sebana02/Sparky.git
   ```

3. Navigate to the project directory:

   ```bash
   cd Sparky
   ```

4. Install the dependencies by running:

   ```bash
   npm install
   ```

5. Create a `.env` file in the root of the project with the following information:

   ```bash
   TOKEN=your_discord_bot_token_here
   ```

   If you don't have a Discord bot token, you can follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) to create one.

   You can configure other settings in the `.env` and `src/config.ts` files. For more details, check the [Configuration](#configuration) section.

6. Invite the bot to your server by following [this guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).

7. To start the bot:

   ```bash
   npm run start
   ```

8. Alternatively, you can start the bot in development mode:

   ```bash
   npm run dev
   ```

   This will start the bot in development mode. The bot will automatically reload when you save changes to the code.

9. The bot should now be running and connected to your Discord server! You can now use the bot by typing `/` in the chat to see a list of available commands.

10. To shut down the bot, press `Ctrl + C` in the terminal where the bot is running.

---

### Configuration

The bot has the following configurations through the `.env` file, located on the root of the project, although only the `TOKEN` is required to run the bot:

| Variable | Description |
| --- | --- |
| `TOKEN` | Discord authentication token (**Required**). |
| `TENOR_API_KEY` | API key for the Tenor GIF API (required for GIF commands). You can get one [here](https://tenor.com/developer/keysignup). |

---

Here is an example of a fully configured `.env` file:

```bash
TOKEN="your_discord_bot_token_here"
TENOR_API_KEY="your_tenor_api_key_here"
```

You can also configure the bot's behavior in the `src/config.ts` file. This file contains various settings that control how the bot operates and general application settings. Here are some of the key settings you can configure:

```typescript
import { IUserConfig } from './interfaces/config.interface.js';

export const userConfig: IUserConfig = {
  locale: 'en_US', // Language of the bot (default: 'en_US -> English')
  logPath: 'bot.log', // Path to the log file (default: '.log')
  // Guild configuration
  guildConfig: {
    guildId: 'your_guild_id', // Guild ID where the bot will be used (default: 'None')
    ignoreChannels: ['channel_id_1', 'channel_id_2'], // Channel IDs to ignore commands from (default: 'None')
    ignoreRoles: ['role_id_1', 'role_id_2'], // Roles to ignore commands from (default: 'None')
    welcomeChannelId: 'your_welcome_channel_id', // Welcome channel ID (default: 'None')
    djRoleId: 'your_dj_role_id', // DJ role ID (default: 'None')
  },
  // Client configuration
  clientConfig: {
    setAFK: false, // Set the bot as AFK (default: false)
    setUsername: 'Sparky', // Set the bot's username (default: 'None')
    // Add any additional client configuration settings here
  },
};
```

Check the [config.interface.ts](src/interfaces/config.interface.ts) file for more details on the available configuration options.

Both `.env` and `src/config.ts` files are not provided in the repository, so you will need to create them manually. The bot will not work without the `.env` file, but it will work without the `src/config.ts` file. If you don't create it, the bot will use the default values. This is the final structure your project should have:

```bash
Sparky
├── .env <--- .env file
├── src/
│   ├── commands/
│   ├── events/
│   ├── interfaces/
│   ├── ...
│   ├── config.ts <--- src/config.ts file
│   └── bot.ts
├── ...
```

## Commands

The bot can be invoked using Discord's slash commands. Sparky offers a variety of commands to interact with it and enhance the chat experience.

### List of available commands

These commands are divided into categories based on their functionality, including fun, games, information, moderation, music, and utility.

#### Fun commands

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

---

#### Game commands

These commands are designed to engage users with fun and interactive games. Users can play hangman, rock-paper-scissors, and tic-tac-toe among other games.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/hangman <gamemode>` | Starts a game of hangman. If `random` gamemode is selected, bot will choose the word. If `custom` gamemode is selected, one of the players will choose the word. | `/hangman random` | None | [`hangman.ts`](src/commands/game/hangman.ts) |
| `/rps <opponent>` | Plays a game of rock-paper-scissors against the specified `opponent`. | `/rps @Dave` | None | [`rps.ts`](src/commands/game/rps.ts) |
| `/tictactoe <opponent>` | Starts a game of tic-tac-toe with a specified `opponent`. | `/tictactoe @Dave` | None | [`tictactoe.ts`](src/commands/game/tictactoe.ts) |
| `/trivia <playlist>` | Starts a game of musical trivia with your `playlist` songs. | `/trivia your_playlist_link_here` | None | [`trivia.ts`](src/commands/game/trivia.ts) |

#### Information commands

These commands provide quick insights and information to users, including the bot's uptime and Wikipedia searches.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/help` | Displays a list of available commands. | `/help` | None | [`help.ts`](src/commands/info/help.ts) |
| `/uptime` | Displays the bot's uptime | `/uptime` | None | [`uptime.ts`](src/commands/info/uptime.ts) |
| `/wikisearch <query>` | Searches Wikipedia for the specified `query` | `/wikisearch Discord` | None | [`wiki-search.ts`](src/commands/info/wiki-search.ts) |

#### Moderation commands

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

---

#### Music commands

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

---

#### Utility commands

These commands provide useful tools for managing polls, reminders, and checking the bot's response time.

| Command | Description | Example | Category | File |
| --- | --- | --- | --- | --- |
| `/disconnect` | Disconnects the bot from the voice channel. | `/disconnect` | None | [`disconnect.ts`](src/commands/utility/disconnect.ts) |
| `/ping` | Checks the bot's response time and latency. | `/ping` | None | [`ping.ts`](src/commands/utility/ping.ts) |
| `/poll <question> <possible answers> <time>` | Creates a poll with the specified `question` for users to vote on during specified `time`. | `/poll What's your favorite food? Pizza,Salad,Sushi` | None | [`poll.ts`](src/commands/utility/poll.ts) |
| `/remind <time> <reminder>` | Sets a `reminder` for the specified `time` duration. | `/remind 10m I am a reminder` | None | [`remind.ts`](src/commands/utility/remind.ts) |

---

### Create a new command (for developers)

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

---

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

## Events

The bot uses events to listen for specific actions or triggers and execute functions when those events occur. Events are used to handle various actions, such as when the bot is ready, a user joins the server, or an error occurs. Events are divided into categories based on their emitter, including the client, music player, and process.

### List of available events

The bot uses several events to handle various actions and triggers. These events are divided into categories based on their emitter, including the client, music player, and process.

#### Client events

These events are emitted by the Discord client and are related to the bot's connection and status.

| Event | Description | File |
| --- | --- | --- |
| `ready` | Emitted when the bot is ready to start receiving commands. | [`ready.ts`](src/events/client/ready.ts) |
| `interactionCreate` | Emitted when an interaction is created. | [`interaction-create.ts`](src/events/client/interaction-create.ts) |
| `guildMemberAdd` | Emitted when a new member joins the server. | [`guild-member-add.ts`](src/events/client/guild-member-add.ts) |

---

#### Music events

These events are emitted by the music player and are related to the music player's status and actions.

| Event | Description | File |
| --- | --- | --- |
| `emptyQueue` | Emitted when the queue is empty. | [`empty-queue.ts`](src/events/music/empty-queue.ts) |
| `emptyChannel` | Emitted when the bot leaves the voice channel. | [`empty-channel.ts`](src/events/music/empty-channel.ts) |
| `error` | Emitted when an error occurs. | [`error.ts`](src/events/music/error.ts) |
| `playerError` | Emitted when an error occurs in the player. | [`player-error.ts`](src/events/music/player-error.ts) |
| `playerStart` | Emitted when the player starts playing a song. | [`player-start.ts`](src/events/music/player-start.ts) |

---

#### Process events

These events are emitted by the process and are related to the node process status.

| Event | Description | File |
| --- | --- | --- |
| `exit` | Emitted when the process is about to exit. | [`exit.ts`](src/events/process/exit.ts) |
| `SIGINT` | Emitted when the process receives a SIGINT signal. | [`SIGINT.ts`](src/events/process/SIGINT.ts) |
| `unhandledRejection` | Emitted when an unhandled promise rejection occurs. | [`unhandled-rejection.ts`](src/events/process/unhandled-rejection.ts) |
| `uncaughtException` | Emitted when an uncaught exception occurs. | [`uncaught-exception.ts`](src/events/process/uncaught-exception.ts) |

---

### Create a new event (for developers)

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
import { IEvent, Emitter } from '../../interfaces/event.interface.js';
import { Client } from 'discord.js';

export const event: IEvent = {
  name: 'ready',
  emitter: Emitter.Client,

  execute: async (client: Client): Promise<void> => {
    console.log(`Logged in as ${client.user.tag}!`);
  },
};
```

## Utils (for developers)

In the `utils` folder, you can find a series of utility classes that can be used throughout the bot. These functions are designed to help with common tasks and can be used in any part of the bot:

| Utility | Description | File |
| --- | --- | --- |
| `CommandErrorHandler` | Wrapper class to handle errors in commands. | [`error-handler.ts`](src/utils/error-handler.ts) |
| `EventErrorHandler` | Wrapper class to handle errors occurring in events. | [`error-handler.ts`](src/utils/error-handler.ts) |
| `InteractionUtils` | Wrapper class to simplify interaction management. | [`interaction-utils.ts`](src/utils/interaction-utils.ts) |
| `GifUtils` | Utility class to retrieve and send GIFs. | [`gif-utils.ts`](src/utils/gif-utils.ts) |
| `LanguageUtils` | Functions to retrieve literals from the selected language. | [`language-utils.ts`](src/utils/language-utils.ts) |
| `EmbedPresets` | Functions to create embed presets and use them anywhere. | [`embed-presets.ts`](src/utils/embed/embed-presets.ts) |
| `EmbedUtils` | Functions to create and manage embeds for various purposes. | [`embed-utils.ts`](src/utils/embed-utils.ts) |

## Logger

The bot includes a logging system that saves logs to a file. The logs are stored in a `.log` file in the project root by default, but you can change the file path in the [`.env`](#configuration) file.

It includes the following log levels:

- **INFO**: General information about the bot's operation.
- **WARN**: Warning messages indicating potential issues.
- **ERROR**: Error messages for critical failures.

```bash
[30/10/2024, 15:45:17] [info] Loading commands...
[29/10/2024, 15:24:53] [warn] Could not find literal at path "ping.a"
[29/10/2024, 13:56:20] [error] Could not load event "ready"
```

---

### Usage (for developers)

The logger object is stored in the process object as a global variable so you can use it anywhere in the bot. To log a message, use the following syntax:

```typescript
// Log an info message
globalThis.logger.info('Loading commands...'); // or
logger.info('Loading commands...');

// Log a warning message
globalThis.logger.warn('Could not find literal at path "ping.a"'); // or
logger.warn('Could not find literal at path "ping.a"');

// Log an error message
globalThis.logger.error('Could not load event "ready"'); // or
logger.error('Could not load event "ready"');
```

## Languages

The bot is designed to support multiple languages, allowing users to interact with the bot in their preferred language.

In order to change the bot's language, you need to modify the `locale` variable in the [`src/config.ts`](#configuration) file, using one of the supported languages, which are stored in folders in the `locales` directory. Simply copy the name of the desired language folder and set it as the `locale` value. The bot will automatically load the corresponding language strings. By default, the bot uses English.

---

### Supported languages

- [x] English
- [x] Spanish
- [ ] French
- [ ] Italian
- [ ] German
- [ ] Portuguese

Feel free to add your language by following the instructions below!

---

### Add a new language (for developers)

To add a new language to the bot, follow these steps:

1. `Create a new folder`: in the `locales` directory with the name of the language you want to add, using the IETF BCP 47 format for the language code (e.g., `en_US` for English, United States). A list of available language codes can be found in [locales.json](./locales/locales.json)

2. `Add JSON files`: inside the new folder with every key-value pair, you can follow the structure of the existing languages or follow your own structure, but you have to make sure to include every key-value pair or else some parts may not work. It is recommended to copy the English language files and translate the values to your language.

3. `Set the locale`: in the [`src/config.ts`](#configuration) file to the name of the new language folder you created. This property will only accept keys included in the [locales.json](./locales/locales.json) file.

4. `Access literals`: These JSON files will be loaded into the global variable `globalThis.literals`. Each key is loaded as a result of concatenating the path of the JSON's structure with `.`. The type of the value is determined by the type of the value in the JSON file, and includes strings, numbers, arrays, and functions (for placeholders). Placeholders are represented by ordered numbers inside curly braces (e.g., `{0}`, `{1}`). If a value in the JSON file contains placeholders, it will be wrapped in a function that replaces the placeholders with the provided values when called.

For example, this JSON:

```json
{
  "poll": {
    "time": 50,
    "question": "What's your favorite food?",
    "answers": ["Pizza", "Salad", "Sushi"],
    "message": "{0} has started a poll"
  }
}
```

Will be accessed in the bot like this:

```typescript
globalThis.literals.poll.time; // 50
globalThis.literals.poll.question; // "What's your favorite food?"
globalThis.literals.poll.answers; // ["Pizza", "Salad", "Sushi"]

const message = globalThis.literals.poll.message; // function(message: string) { return `${message} has started a poll`; }
console.log(message('Dave')); // "Dave has started a poll"
```

Else, you can use the [`LanguageUtils`](src/utils/language-utils.ts) functions to retrieve literals from the selected language. This is preferred as it will handle the path concatenation for you and will return the correct type of the value, apart from throwing an error if the literal is not found or if the type is incorrect.

```typescript
import { fetchFunction, fetchString, fetchNumber, fetchArray } from 'utils/language-utils.js';

const time = fetchNumber('poll.time'); // 50
const question = fetchString('poll.question'); // "What's your favorite food?"
const answers = fetchArray('poll.answers'); // ["Pizza", "Salad", "Sushi"]

const message = fetchFunction('poll.message'); // function(message: string) { return `${message} has started a poll`; }
console.log(message('Dave')); // "Dave has started a poll"
```

As a recommendation, it is better to fetch the literals that will be used in a command/event at the beginning of the file and store them in a variable to avoid multiple calls to the `fetch` functions.

**IMPORTANT**: If you fail to see some literal in your language and it happens to be in US English, it means that the key is missing in your language files. You can add it by copying the key from the US English file and translating the value to your language.

---

## Fallback behavior

The bot is designed to handle errors and unexpected behavior gracefully. If an error occurs, the bot will log the error and send a message to the user indicating that an error occurred. The bot will continue to run and respond to commands and events, even if an error occurs.

## Troubleshooting

If you encounter any issues while running the bot, here are some common troubleshooting steps:

1. **Check the logs**: Review the logs for any error messages that can provide insight into the issue.
2. **Verify configuration**: Ensure that your configuration files are set up correctly and that all required variables are defined.
3. **Update dependencies**: Make sure all dependencies are up to date by running `npm update`.
4. **Consult documentation**: Refer to the documentation for any specific instructions related to the feature you are using.
5. **Search for solutions**: Look for similar issues in the project's issues.

## Known Issues

## Contributions

Feel free to contribute by submitting issues or pull requests! All contributions are welcome and appreciated.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
