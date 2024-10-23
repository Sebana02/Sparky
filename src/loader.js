const { Client } = require('discord.js')
const path = require('path')
const { loadLanguages } = require('@src/loaders/languages-loader.js')
const { loadEvents } = require('@src/loaders/events-loader.js')
const { loadCommands } = require('@src/loaders/commands-loader.js')


/**
 * Module that loads languages, events and commands.
 */
module.exports = {
    /**
     * Loads languages, events and commands.
     * @param {Client} client - The Discord client.
     */
    config: (client) => {

        //Log start time
        logger.info("----Starting bot----")

        // Load languages
        loadLanguages(path.resolve(__dirname, '../languages'))

        // Load events
        loadEvents(path.resolve(__dirname, '../events'), client)

        // Load commands
        loadCommands(path.resolve(__dirname, '../commands'), client)
    }
}