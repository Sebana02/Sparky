require('module-alias/register')
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
        GatewayIntentBits.GuildMembers,
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

require('@src/logger.js').config() //Change console stream to log file

require('@src/loader.js').config(client) //Load commands, languages and events


//Check if TOKEN environment variable is set
if (!process.env.TOKEN || process.env.TOKEN.trim() === '')
    return console.error('Error: TOKEN environment variable not found')

//Login to Discord
client.login(process.env.TOKEN)
    .catch(error => console.error(`Error: during loging: ${error.message}`))

