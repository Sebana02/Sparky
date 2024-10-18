require('module-alias/register') // Register module-alias to use @ instead of relative paths

const { Client, GatewayIntentBits, Partials } = require('discord.js')
const { Player } = require('discord-player')
const { YoutubeiExtractor } = require("discord-player-youtubei")

const client = new Client({ // client setup
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
    ],
    disableMentions: 'everyone',
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
    ]
})

const player = new Player(client) // player setup
player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor') // load default extractors, except youtube
player.extractors.register(YoutubeiExtractor, {}) // load youtube support

require('dotenv').config() // load .env variables

global.logger = require('@src/logger.js') // load logger

require('@src/loader.js').config(client) // load commands, languages and events



//Check if TOKEN environment variable is set
if (!process.env.TOKEN || process.env.TOKEN.trim() === '') {
    logger.error('TOKEN environment variable not found')
    process.exit(1)
}

//Login to Discord
client.login(process.env.TOKEN)
    .catch(error => logger.error(`During loging: ${error.message}`))

