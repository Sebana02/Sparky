const { Collection, Client } = require('discord.js')
const fs = require('fs')
const path = require('path')
const { useMainPlayer } = require('discord-player')
const { eventErrorHandler } = require('@utils/eventErrorHandler')

/**
 * Loads events recursively from the specified folder path and binds them to the emitter.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {object} emitter - The event emitter to bind the events to.
 * @param {Client} client - The Discord client.
 */
function loadEvents(folderPath, emitter, client) {
    if (!fs.existsSync(folderPath))
        return console.error(`-> Error: Folder does not exist: ${folderPath}`)

    fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.resolve(folderPath, file)

        if (fs.statSync(filePath).isDirectory()) {
            loadEvents(filePath, emitter, client)
        }
        else {
            if (!file.endsWith('.js'))
                return console.log(`-> Skipping non-JS file event: ${file}`)

            const event = require(filePath)
            const eventName = event.event
            const eventCallback = event.callback

            if (!eventName || !eventCallback)
                return console.error(`-> Error: Invalid event file: ${file}`)

            emitter.on(eventName, (...args) => eventErrorHandler(eventName, eventCallback, client, ...args))
            console.log(`-> Loaded event: ${eventName}`)
        }
    })
}

/**
 * Loads commands recursively from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 * @param {Client} client - The Discord client.
 */
function loadCommands(folderPath, client) {
    if (!fs.existsSync(folderPath))
        return console.error(`-> Error: Folder does not exist: ${folderPath}`)

    fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.resolve(folderPath, file)

        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath, client)
        }
        else {
            if (!file.endsWith('.js'))
                return console.log(`-> Skipping non-JS file command: ${file}`)

            const command = require(filePath)
            const commandName = command.name
            const commandDescription = command.description
            const commandRun = command.run

            if (!commandName || !commandDescription || !commandRun)
                return console.error(`-> Error: Invalid command file: ${file}`)

            client.commands.set(commandName.toLowerCase(), command)
            console.log(`-> Loaded command: ${commandName}`)
        }
    })
}

/**
 * Module that loads events and commands.
 */
module.exports = {
    /**
     * Loads events and commands.
     * @param {Client} client - The Discord client.
     */
    config: (client) => {
        try {
            // Load events
            console.log('-> Loading events...')
            loadEvents(path.resolve(__dirname, '../events/process'), process, client)
            loadEvents(path.resolve(__dirname, '../events/client'), client, client)
            loadEvents(path.resolve(__dirname, '../events/music'), useMainPlayer().events, client)


            // Load commands
            console.log('-> Loading commands...')
            client.commands = new Collection()
            loadCommands(path.resolve(__dirname, '../commands'), client)
        }
        catch (error) {
            console.error(`Error: loading events and commands: ${error}`)
        }
    }
}
