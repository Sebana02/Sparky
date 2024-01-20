const { Client, GatewayIntentBits, Partials } = require('discord.js')

const client = new Client({ //Client configutation
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

require('dotenv').config() // load .env variables

require('./src/logger.js')() //Change console stream to log file

require('./src/loader.js')(client) //Load commands and events

//client.login(process.env.TOKEN) //Login to Discord

