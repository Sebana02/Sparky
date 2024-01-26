const { Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

//Load events recursively from folderPath, and bind them to emitter
function loadEvents(folderPath, emitter, client) {
    if (!fs.existsSync(folderPath))
        return console.log(`-> Folder does not exist: ${folderPath}`)

    fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file)

        if (fs.statSync(filePath).isDirectory()) {
            loadEvents(filePath, emitter)
        } else {
            if (!file.endsWith('.js'))
                return console.log(`-> Skipping non-JS file event: ${file}`)

            const event = require(filePath)
            const eventName = event.event
            const eventCallback = event.callback

            if (!eventName || !eventCallback)
                return console.log(`-> Invalid event file: ${file}`)

            emitter.on(eventName, eventCallback.bind(null, client))
            console.log(`-> Loaded event: ${eventName}`)
        }
    })
}

//Load commands recursively from folderPath
function loadCommands(folderPath, client) {
    if (!fs.existsSync(folderPath))
        return console.log(`-> Folder does not exist: ${folderPath}`)

    fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file)

        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath, client)
        } else {
            if (!file.endsWith('.js'))
                return console.log(`-> Skipping non-JS file command: ${file}`)

            const command = require(filePath)
            const commandName = command.name
            const commandDescription = command.description
            const commandRun = command.run

            if (!commandName || !commandDescription || !commandRun)
                return console.log(`-> Invalid command file: ${file}`)

            client.commands.set(commandName.toLowerCase(), command)
            console.log(`-> Loaded comand: ${commandName}`)
        }
    })
}

module.exports = (client) => {
    // Load events
    console.log('-> Loading events...')
    loadEvents(path.join(__dirname, '../events/process'), process, client)
    loadEvents(path.join(__dirname, '../events/client'), client, client)

    console.log('-> Loading commands...')
    client.commands = new Collection()
    loadCommands(path.join(__dirname, '../commands'), client)
}

