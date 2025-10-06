# TODO

## Important

- [ ] Modify locale placeholders to be more user-friendly (e.g. {user} instead of {0}) (loaders/languages-loader.ts)

## General

- [ ] Add more personalization options to the bot (src/config.ts)

- [ ] Create error classes to handle errors better

- [ ] Add an alternative to tenor for gifs (e.g. giphy)

- [ ] Create and connect to local database
  - [ ] Leveling system (xp, levels, ranks, etc.)

- [ ] Sharding the bot (not needed atp)

## Music

- [x] While YoutubeI package is being fixed, quick workaround done (bot.ts) -> songs wont play

## Embeds

- [ ] Improve visuals of embeds

- [ ] Is all of this really necessary?
  - [ ] Change direct imports of embed presets to use embedFromTemplate function
  - [ ] Only use embedTemplates when necessary (remove unnecessary ones)
  - [ ] Make embeds fully customizable using templates

## Commands

- [ ] Combine similar commands into subcommands (e.g., ban/unban, mute/unmute, kick/warn)

- [ ] Moderation
  - [ ] Roles
    - [ ] Add role to user
    - [ ] Remove role from user
    - [ ] Create role
    - [ ] Delete role
    - [ ] Show permissions of a role
    - [ ] Show roles of a user
  - [ ] Channels
    - [ ] Create channel
    - [ ] Delete channel
    - [ ] Modify channel permissions
  - [ ] Add pagination to user/banned-list and user/muted-list commands

- [ ] Info
  - [ ] Weather info
  - [ ] Ask chatGPT info

- [ ] Utility
  - [ ] Create and send embed message

- [ ] Game
  - [ ] RPS IA
  - [ ] TicTacToe IA

## Security

- [ ] More checks regarding who can receive certain commands (e.g., ban, kick, mute, warn, role management, etc.)
