# TODO

## Important

- [ ] Modify locale placeholders to be more user-friendly (e.g. {user} instead of {0}) (loaders/languages-loader.ts)

## General

- [ ] Add more personalization options to the bot (src/config.ts)

- [ ] Implement subcommands when possible (e.g. mute/unmute -> mute)

- [ ] Create error classes to handle errors better

- [ ] Add an alternative to tenor for gifs (e.g. giphy)

- [ ] Create and connect to local database
  - [ ] Leveling system (xp, levels, ranks, etc.)

- [ ] Sharding the bot (not needed atp)

## Music

- [x] While YoutubeI package is being fixed, quick workaround done (bot.ts)
  - [ ] Solve issues with the music commands
    - [ ] YoutubeI Package
      - [ ] Impossible to bridge some songs sp->yt
      - [ ] Songs are found but won't start

- [ ] Add guide to locally use ffmpeg -> HAS TO BE ON PATH VARIABLE IF NO PATH IS SPECIFIED IN .ENV
  - [ ] .env FFMPEG_PATH entry not working?

- [ ] Some songs are being repeated on trivia

## IAs

- [ ] RPS
- [ ] TicTacToe

## Embeds

- [ ] Change direct imports of embed presets to use embedFromTemplate function
- [ ] Only use embedTemplates when necessary (remove unnecessary ones)
- [ ] Improve visuals and embeds
- [ ] Make embeds fully customizable using templates

## Commands

- [ ] add-role command
- [ ] remove-role command
- [ ] create-role command
- [ ] delete-role command
- [ ] show-permissions command
- [ ] show-roles (of a user) command
- [ ] create-channel command
- [ ] delete-channel command

- [ ] Add pagination to bannedlist and mutedlist commands

- [ ] Weather command

- [ ] Add options info to the help command

- [ ] Create and send embed message

## Security

- [ ] More checks regarding who can receive certain commands
