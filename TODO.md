# TODO

## Important

- [ ] game-embeds.ts and moderation-embeds.ts need to be refactored to use embedFromTemplate function (embeds/)
- [ ] Modify locale placeholders to be more user-friendly (e.g. {user} instead of {0}) (loaders/languages-loader.ts)
- [ ] Check and fix references

## General

- [ ] Add more personalization options to the bot (src/config.ts)

- [ ] Create error classes to handle errors better

- [ ] Add an alternative to tenor for gifs (e.g. giphy)

- [ ] Create and connect to local database
  - [ ] Leveling system (xp, levels, ranks, etc.)

- [ ] Sharding the bot (not needed atp)

## Music

- [x] While YoutubeI package is being fixed, quick workaround done (bot.ts) -> songs wont play
- [ ] Maybe add posibility to play next a playlist or an album (play-next command)
- [ ] In trivia, add missing songs (number).
- [ ] In trivia, substract 1 point if the user answers wrong (currently only adds points if the answer is correct)
- [ ] In trivia, add gamemode where every user can answer in a limited time (e.g. 30 seconds) and every player that answers correctly gets points, but only the first one gets more points (e.g. 10 points for the first one, 5 for the second one, and 2 for the rest)

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
