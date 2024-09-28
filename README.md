# Sparky

> This Discord bot is designed to be an easy and customizable solution for your servers. Ideal for groups of friends, the bot offers a variety of fun and useful commands that enhance chat experience and community interaction.

## Table of Contents

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
  - [License](#license)

## Features

- **Music Control**: Sparky provides full music functionality including play, pause, skip, queue management, volume adjustment, and looping. It supports various music platforms like YouTube, Spotify, and SoundCloud.
- **Moderation Commands**: Sparky helps keep your server under control with commands for banning, kicking, muting, and managing channels. You can also create and manage roles easily.
- **Fun Commands**: Add fun to your server with meme GIFs, cat and dog images, virtual hugs, slaps, and other interactive commands that make the chat experience more lively.
- **Game Commands**: Engage users with built-in games like hangman, rock-paper-scissors (RPS), and tic-tac-toe. Users can challenge each other and compete in these fun, light-hearted games.
- **Utility Commands**: Sparky includes useful tools like polls for gathering opinions, reminders for scheduling tasks, and a ping command to check latency.
- **Information Commands**: Get quick insights such as bot uptime or perform Wikipedia searches right from the chat.
- **Configurable Settings**: With the `.env` file, you can customize the bot’s behavior, including token configuration, activity status, DJ role permissions, and more.
- **Slash Command Support**: Sparky exclusively uses modern Discord slash commands, making the bot intuitive to use and easy to interact with.
- **Multi-language Support (Coming Soon)**: Currently supports Spanish, with plans to support additional languages in the future.

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

   - `@discord-player/extractor`: Library for music command extraction.
   - `discord-player`: Main library for handling music commands.
   - `discord-player-youtubei`: Extractor specifically for YouTube music.
   - `discord.js`: Wrapper for interacting with the Discord API.
   - `dotenv`: Library for loading environment variables from a `.env` file.
   - `mediaplex`: Encoder for Opus packets used in voice channels.
   - `module-alias`: Allows setting up module path aliases, aiding in code organization and intellisense.

   ```bash
   npm install @discord-player/extractor discord-player discord-player-youtubei discord.js dotenv mediaplex module-alias
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

8. The bot should now be running and connected to your Discord server!

## Configuration

### `.env file`

The bot has the following configurations through the `.env` file:

- `TOKEN`: The Discord authentication token. Required for the bot to connect to Discord.
- `LOG_FILE`: The file where logs will be stored. It is optional and logs will be displayed in the console in any case.
- `GUILD_ID`: The ID of the server where the bot will be used. If not specified, the bot will register commands globally, which can take up to an hour to be available.
- `PLAYING_ACTIVITY`: The activity status of the bot. If left empty, the bot will not display any activity status.
- `TENOR_API_KEY`: The API key for the Tenor GIF API. Required for GIF commands, you can get one [here](https://tenor.com/developer/keysignup).
- `DJ_ROLE`: The role that will have DJ permissions. If specified, only users with this role will be able to control the music bot.

A template `.env` file is provided in the repository as [`template.env`](templates/template.env).

### `Create a new command`

Any new command must be created in the `commands` folder as it is the path where the bot will look for commands. Inside the folder, any substructure can be followed, as the bot will search for commands recursively, although it is recommended to create a folder for each category of commands.

`Commands` must be `.js` files and must export an object with the following properties:

- `name`: The name of the command. This is the name that will be used to call the command.
- `description`: A brief description of what the command does.
- `permissions` **(optional)**: Permissions required to use the command. If not specified, the command can be used by anyone.
- `voiceChannel` **(optional)**: A boolean indicating if the command can only be used by users connected to a voice channel.
- `options` **(optional)**: An array of options for the command.
- `run (client,inter) => { }`: The function that will be executed when the command is called. It receives the `client` object and the `interaction` object as parameters.

A template command is provided in the repository as [`command.js`](templates/command.js), which have more details about the command structure and can be used as a base for new commands.

### `Create a new event`

Any event must be placed in the `events` folder, specifically in the emmiter's folder it belongs to. The bot will look for events and will automatically register them.

`Events` must be `.js` files and must export an object with the following parameters:

- `name`: The name of the event. This name must correspond to any of the list of events provided by the emitter it belongs to.
- `callback (client, args) => { }`: The function that will be executed when the event is emitted. It receives the `client` object and any `other parameters` that the event emits. (Look at the emitter's documentation to know which parameters are emitted.)

A template event is provided in the repository as [`event.js`](templates/event.js), which have more details about the event structure and can be used as a base for new events.

## Commands

The bot can be invoked using Discord's slash commands. Sparky offers a variety of commands that can be used to interact with the bot and enhance the chat experience. The commands are divided into categories based on their functionality:

### `Fun commands`

These commands are designed to add fun and entertainment to the chat experience. They include GIFs, memes, and interactive actions like hugs, pokes, and slaps.

| Command             | Description                                           | Example                          | Category | File                                        |
| ------------------- | ----------------------------------------------------- | -------------------------------- | -------- | ------------------------------------------- |
| `/callate <user>`   | Sends a GIF telling the mentioned `user` to shut up.  | `/callate @Dave`                 | GIFs     | [`callate.js`](commands/fun/gif/callate.js) |
| `/cat`              | Sends a random cat GIF                                | `/cat`                           | GIFs     | [`cat.js`](commands/fun/gif/cat.js)         |
| `/dog`              | Sends a random dog GIF                                | `/dog`                           | GIFs     | [`dog.js`](commands/fun/gif/dog.js)         |
| `/gif <category>`   | Sends a random GIF based on the specified `category`. | `/gif weird`                     | GIFs     | [`gif.js`](commands/fun/gif/gif.js)         |
| `/hug <user>`       | Sends a GIF giving a hug to a specified `user`.       | `/hug @Dave`                     | GIFs     | [`hug.js`](commands/fun/gif/hug.js)         |
| `/meme`             | Sends a random meme GIF.                              | `/meme`                          | GIFs     | [`meme.js`](commands/fun/gif/meme.js)       |
| `/poke <user>`      | Sends a GIF poking a specified `user`.                | `/poke @Dave`                    | GIFs     | [`poke.js`](commands/fun/gif/poke.js)       |
| `/slap <user>`      | Sends a GIF slapping a specified `user`.              | `/slap @Dave`                    | GIFs     | [`slap.js`](commands/fun/gif/slap.js)       |
| `/8ball <question>` | Answers a `question` with a random 8-ball response.   | `/8ball Will I win the lottery?` | None     | [`8ball.js`](commands/fun/8ball.js)         |
| `/coinflip`         | Flips a coin and returns heads or tails.              | `/coinflip`                      | None     | [`coinflip.js`](commands/fun/coinflip.js)   |

### `Game commands`

These commands are designed to engage users with fun and interactive games. Users can play hangman, rock-paper-scissors, and tic-tac-toe among other games.

| Command                 | Description                                                                                                                                                      | Example                           | Category | File                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------- | -------------------------------------------- |
| `/hangman <gamemode>`   | Starts a game of hangman. If `random` gamemode is selected, bot will choose the word. If `custom` gamemode is selected, one of the players will choose the word. | `/hangman random`                 | None     | [`hangman.js`](commands/game/hangman.js)     |
| `/rps <opponent>`       | Plays a game of rock-paper-scissors against the specified `opponent`.                                                                                            | `/rps @Dave`                      | None     | [`rps.js`](commands/game/rps.js)             |
| `/tictactoe <opponent>` | Starts a game of tic-tac-toe with a specified `opponent`.                                                                                                        | `/tictactoe @Dave`                | None     | [`tictactoe.js`](commands/game/tictactoe.js) |
| `/trivia <playlist>`    | Starts a game of musical trivia with your `playlist` songs.                                                                                                      | `/trivia your_playlist_link_here` | None     | [`trivia.js`](commands/game/trivia.js)       |

### `Information Commands`

These commands provide quick insights and information to users, including the bot's uptime and Wikipedia searches.

| Command               | Description                                  | Example               | Category | File                                                  |
| --------------------- | -------------------------------------------- | --------------------- | -------- | ----------------------------------------------------- |
| `/uptime`             | Displays the bot's uptime                    | `/uptime`             | None     | [`uptime.js`](commands/information/uptime.js)         |
| `/wikiSearch <query>` | Searches Wikipedia for the specified `query` | `/wikiSearch Discord` | None     | [`wikiSearch.js`](commands/information/wikiSearch.js) |

### `Moderation Commands`

These commands help maintain order and control in the server by providing tools for managing users, roles, and channels.

| Command                               | Description                                                                                                                                                                                                           | Example                            | Category | File                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | ------------------------------------------------------------------ |
| `/hideChannel [channel]`              | Hides the specified `channel` from view for users, making it inaccessible until unhidden. If no channel is specified, it hides the channel where the command is used. It can be used both on text and voice channels. | `/hideChannel general`             | Channel  | [`hideChannel.js`](commands/moderation/channel/hideChannel.js)     |
| `/showChannel [channel]`              | Unhides the specified `channel`, making it visible again to users who have access. If no channel is specified, it unhides the channel where the command is used. It can be used both on text and voice channels.      | `/showChannel general`             | Channel  | [`showChannel.js`](commands/moderation/channel/showChannel.js)     |
| `/muteChannel [channel]`              | Mutes the specified `channel`, preventing users from sending messages in that channel. If no channel is specified, it mutes the channel where the command is used. It can be used both on text and voice channels.    | `/muteChannel general`             | Channel  | [`muteChannel.js`](commands/moderation/channel/muteChannel.js)     |
| `/unmuteChannel [channel]`            | Unmutes the specified `channel`, allowing users to send messages once more. If no channel is specified, it unmutes the channel where the command is used. It can be used both on text and voice channels.             | `/unmuteChannel general`           | Channel  | [`unmuteChannel.js`](commands/moderation/channel/unmuteChannel.js) |
| `/purge [amount]`                     | Deletes a specified `amount` of messages in the channel, helping to clean up chat clutter.                                                                                                                            | `/purge 10`                        | Channel  | [`purge.js`](commands/moderation/channel/purge.js)                 |
| `/createRole <roleName> [color]`      | Creates a new role with the specified `roleName` and, optionally, a `color` in hexadecimal format (#abc123)                                                                                                           | `/createRole Admin #FFFFFF`        | Role     | [`createRole.js`](commands/moderation/role/createRole.js)          |
| `/ban <user>`                         | Bans a specified `user` from the server, preventing them from joining or interacting with the server.                                                                                                                 | `/ban @Dave`                       | User     | [`ban.js`](commands/moderation/user/ban.js)                        |
| `/unban <user>`                       | Unbans a specified `user` from the server, allowing them to rejoin and interact with the community.                                                                                                                   | `/unban @Dave`                     | User     | [`unban.js`](commands/moderation/user/unban.js)                    |
| `/bannedList`                         | Displays a list of banned users, providing insight into who is currently banned from the server.                                                                                                                      | `/bannedList`                      | User     | [`bannedList.js`](commands/moderation/user/bannedList.js)          |
| `/kick <user>`                        | Kicks a specified `user` from the server, temporarily removing them from the community.                                                                                                                               | `/kick @Dave`                      | User     | [`kick.js`](commands/moderation/user/kick.js)                      |
| `/mute <user>`                        | Mutes a specified `user` in the server, preventing them from speaking in voice channels or sending messages in text channels.                                                                                         | `/mute @Dave`                      | User     | [`mute.js`](commands/moderation/user/mute.js)                      |
| `/unmute <user>`                      | Unmutes a specified `user`, allowing them to speak in voice channels and send messages again.                                                                                                                         | `/unmute @Dave`                    | User     | [`unmute.js`](commands/moderation/user/unmute.js)                  |
| `/mutedList`                          | Displays a list of muted users, showing who is currently unable to send messages or speak.                                                                                                                            | `/mutedList`                       | User     | [`mutedList.js`](commands/moderation/user/mutedList.js)            |
| `/setNickname <user> <nickname>`      | Sets a `nickname` for a specified `user`, allowing for personalized identification within the server.                                                                                                                 | `/setNickname @Dave IamNotDave`    | User     | [`setNickname.js`](commands/moderation/user/setNickname.js)        |
| `/resetNickname <user>`               | Resets the nickname for a specified `user` to their original username, removing any custom nickname they had.                                                                                                         | `/resetNickname @Dave`             | User     | [`resetNickname.js`](commands/moderation/user/resetNickname.js)    |
| `/timeout <user> <reason> <duration>` | Times out a specified `user` for a `reason`, for `duration` minutes, preventing them from sending messages or speaking during that time.                                                                              | `/timeout @Dave 10`                | User     | [`timeout.js`](commands/moderation/user/timeout.js)                |
| `/warn <user> <reason>`               | Issues a warning to a specified `user`, providing a `reason` for the warning to maintain accountability.                                                                                                              | `/warn @Dave Too many infractions` | User     | [`warn.js`](commands/moderation/user/warn.js)                      |

### `Music Commands`

These commands are designed to control the music player and queue. Users can play, pause, skip, and manage the music queue with these commands.

| Command             | Description                                                                                                                                                     | Example              | Category | File                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------- | ------------------------------------------------------- |
| `/back`             | Plays the previous song in the queue.                                                                                                                           | `/back`              | Playback | [`back.js`](commands/music/playback/back.js)            |
| `/clear`            | Clears the music queue.                                                                                                                                         | `/clear`             | Queue    | [`clear.js`](commands/music/queue/clear.js)             |
| `/loop <mode>`      | Loops the current song or queue. `Mode` can be `song`, `queue`,`autoplay` or `off`.                                                                             | `/loop song`         | Playback | [`loop.js`](commands/music/playback/loop.js)            |
| `/lyrics`           | Fetches and displays the lyrics of the currently playing song.                                                                                                  | `/lyrics`            | Insight  | [`lyrics.js`](commands/music/insight/lyrics.js)         |
| `/nowplaying`       | Displays information about the currently playing song and the queue.                                                                                            | `/nowplaying`        | Insight  | [`nowplaying.js`](commands/music/insight/nowplaying.js) |
| `/pause`            | Pauses the currently playing song.                                                                                                                              | `/pause`             | Playback | [`pause.js`](commands/music/playback/pause.js)          |
| `/play <query>`     | Plays a song or playlist from YouTube or a supported URL, including Spotify, Souncloud and other sources. `Query` can be a URL, a song's name or even an author | `/play greedy`       | Playback | [`play.js`](commands/music/playback/play.js)            |
| `/playnext <query>` | Adds a song to the queue to play after the current song.                                                                                                        | `/playnext Paramore` | Playback | [`playnext.js`](commands/music/playback/playnext.js)    |
| `/queue`            | Shows the current music queue.                                                                                                                                  | `/queue`             | Queue    | [`queue.js`](commands/music/queue/queue.js)             |
| `/resume`           | Resumes a paused song.                                                                                                                                          | `/resume`            | Playback | [`resume.js`](commands/music/playback/resume.js)        |
| `/save`             | Saves the currently playing song to your DMs                                                                                                                    | `/save`              | Insight  | [`save.js`](commands/music/insight/save.js)             |
| `/shuffle`          | Shuffles the songs in the current queue.                                                                                                                        | `/shuffle`           | Queue    | [`shuffle.js`](commands/music/queue/shuffle.js)         |
| `/skip`             | Skips the current song.                                                                                                                                         | `/skip`              | Playback | [`skip.js`](commands/music/playback/skip.js)            |
| `/stop`             | Stops the music and clears the queue.                                                                                                                           | `/stop`              | Playback | [`stop.js`](commands/music/playback/stop.js)            |
| `/volume <level>`   | Adjusts the volume of the music player to the specified `level` (0-100).                                                                                        | `/volume 50`         | Playback | [`volume.js`](commands/music/playback/volume.js)        |

### `Utility Commands`

These commands provide useful tools for managing polls, reminders, and checking the bot's response time.

| Command                                      | Description                                                                                | Example                                              | Category | File                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------- | -------- | ------------------------------------------------- |
| `/disconnect`                                | Disconnects the bot from the voice channel.                                                | `/disconnect`                                        | None     | [`disconnect.js`](commands/utility/disconnect.js) |
| `/ping`                                      | Checks the bot's response time and latency.                                                | `/ping`                                              | None     | [`ping.js`](commands/utility/ping.js)             |
| `/poll <question> <possible answers> <time>` | Creates a poll with the specified `question` for users to vote on during specified `time`. | `/poll What's your favorite food? Pizza,Salad,Sushi` | None     | [`poll.js`](commands/utility/poll.js)             |
| `/remind <time> <reminder>`                  | Sets a `reminder` for the specified `time` duration.                                       | `/remind 10m I am a reminder`                        | None     | [`remind.js`](commands/utility/remind.js)         |

## Events

The bot has a series of callbacks that are executed when certain events occur. These events are located in the `events` folder and are divided into emitters. Each emitter has a series of events that can be listened to. The bot will automatically register these events when the bot starts. The events are divided into the following emitters:

### `Client`

These events are emitted by the Discord client and are related to the bot's connection and status.

| Event               | Description                                                | File                                                         |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| `ready`             | Emitted when the bot is ready to start receiving commands. | [`ready.js`](events/client/ready.js)                         |
| `interactionCreate` | Emitted when an interaction is created.                    | [`interactionCreate.js`](events/client/interactionCreate.js) |
| `guildMemberAdd`    | Emitted when a new member joins the server.                | [`guildMemberAdd.js`](events/client/guildMemberAdd.js)       |

### `Music`

These events are emitted by the music player and are related to the music player's status and actions.

| Event          | Description                                    | File                                              |
| -------------- | ---------------------------------------------- | ------------------------------------------------- |
| `emptyQueue`   | Emitted when the queue is empty.               | [`emptyQueue.js`](events/music/emptyQueue.js)     |
| `emptyChannel` | Emitted when the bot leaves the voice channel. | [`emptyChannel.js`](events/music/emptyChannel.js) |
| `error`        | Emitted when an error occurs.                  | [`error.js`](events/music/error.js)               |
| `playerError`  | Emitted when an error occurs in the player.    | [`playerError.js`](events/music/playerError.js)   |
| `playerStart`  | Emitted when the player starts playing a song. | [`playerStart.js`](events/music/playerStart.js)   |

### `Process`

These events are emitted by the process and are related to the node process status.

| Event                | Description                                         | File                                                            |
| -------------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| `exit`               | Emitted when the process is about to exit.          | [`exit.js`](events/process/exit.js)                             |
| `SIGINT`             | Emitted when the process receives a SIGINT signal.  | [`SIGINT.js`](events/process/SIGINT.js)                         |
| `unhandledRejection` | Emitted when an unhandled promise rejection occurs. | [`unhandledRejection.js`](events/process/unhandledRejection.js) |

## Utils

In the `utils` folder, you can find a series of utility classes that can be used throughout the bot. These functions are designed to help with common tasks and can be used in any part of the bot:

| Utility               | Description                                                 | File                                                     |
| --------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| `CommandErrorHandler` | Wrapper class to handle errors in commands.                 | [`commandErrorHandler.js`](utils/commandErrorHandler.js) |
| `EmbedMusicPresets`   | Functions to create embeds specifically for music commands. | [`embedMusicPresets.js`](utils/embedMusicPresets.js)     |
| `EmbedUtils`          | Functions to create and manage embeds for various purposes. | [`embedUtils.js`](utils/embedUtils.js)                   |
| `EventErrorHandler`   | Wrapper class to handle errors occurring in events.         | [`eventErrorHandler.js`](utils/eventErrorHandler.js)     |
| `GifUtils`            | Utility class to retrieve and send GIFs.                    | [`gifUtils.js`](utils/gifUtils.js)                       |
| `InteractionUtils`    | Wrapper class to simplify interaction management.           | [`interactionUtils.js`](utils/interactionUtils.js)       |
| `Permissions`         | Utility class to check and manage user permissions.         | [`permissions.js`](utils/permissions.js)                 |

## Supported languages

Currently, the bot only supports Spanish, but more languages will be added in the future:

- [x] Spanish
- [ ] English

You can always modify the bot to support your language.

## TODO

### `Laguages`

- [ ] Make architecture to support multiple languages
- [ ] Add English support

### `General`

- [ ] Improve error printing -> Make Error classes
- [ ] Delete ansi escape codes from logs
- [ ] Add help command

### `IAs`

- [ ] RPS
- [ ] TicTacToe

### `Embeds`

- [ ] Embeds in moderation commands

### `Moderation commands`

- [ ] Addrole command
- [ ] Removerole command
- [ ] Deleterole command
- [ ] Show permissions command
- [ ] Show roles of a user command
- [ ] Bannedlist and mutedlist need to include option to show all and show reason
- [ ] Create channel command
- [ ] Delete channel command

### `Security`

- [ ] Add a way to avoid users using commands in certain channels
- [ ] More checks regarding who can receive certain commands

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
