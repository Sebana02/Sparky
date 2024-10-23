const { Client } = require('discord.js')
const fs = require('fs')
const path = require('path')
const { useMainPlayer } = require('discord-player')
const { eventErrorHandler } = require('@utils/error-handler/event-error-handler')

/**
 * Module that loads events
 */
module.exports = {
    /**
     * Loads events from the specified folder path and binds them to the emitter.
     * @param {string} folderPath - The path of the folder containing the events.
     * @param {object} emitter - The event emitter to bind the events to.
     * @param {Client} client - The Discord client.
     */
    loadEvents: (folderPath, client) => {

        // Log the loading of events
        logger.info('Loading events...')

        // Events folders
        const eventsFolders = [
            { folder: 'process', emitter: process },
            { folder: 'client', emitter: client },
            { folder: 'music', emitter: useMainPlayer().events }
        ]

        // Initialize the counter of loaded events
        let loadedEvents = 0

        eventsFolders.forEach(({ folder, emitter }) => {

            // Check if the folder exists
            const eventFolderPath = path.resolve(folderPath, `./${folder}`)
            if (!fs.existsSync(eventFolderPath))
                return logger.error(`Could not load events: ${eventFolderPath} does not exist`)

            // Load events
            loadedEvents += loadEventsRec(eventFolderPath, emitter, client)
        })

        // Log the number of loaded events
        logger.info(`Loaded ${loadedEvents} events`)
    }
}

/**
 * Loads events recursively from the specified folder path and binds them to the emitter.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {object} emitter - The event emitter to bind the events to.
 * @param {Client} client - The Discord client.
 * @returns {number} The number of loaded events.
 */
function loadEventsRec(folderPath, emitter, client) {

    // Initialize the counter of loaded events
    let loadedEvents = 0

    // Load events recursively
    fs.readdirSync(folderPath).forEach((file) => {

        try {
            // Resolve the file path
            const filePath = path.resolve(folderPath, file)

            // Check if the file is a directory, apply recursion
            if (fs.statSync(filePath).isDirectory()) {
                loadedEvents += loadEventsRec(filePath, emitter, client)
            }
            else {
                // Only load JavaScript files
                if (!file.endsWith('.js'))
                    return logger.warn(`Skipping non-JavaScript file: ${file}`)

                // Check if the event file is valid
                const event = require(filePath)
                const eventName = event.event
                const eventCallback = event.callback

                if (!eventName || !eventCallback)
                    throw new Error(`Invalid event file: missing event or callback`)

                // Bind the event to the emitter, using the eventErrorHandler
                emitter.on(eventName, (...args) => eventErrorHandler(eventName, eventCallback, client, ...args))

                // Increment the number of loaded events
                loadedEvents++
            }
        } catch (error) {
            logger.error(`Could not load event ${file}:`, error.message)
        }
    })

    // Return the number of loaded events
    return loadedEvents
}