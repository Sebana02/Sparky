const { Collection, Client } = require('discord.js')
const fs = require('fs')
const path = require('path')
const { useMainPlayer } = require('discord-player')
const { eventErrorHandler } = require('@utils/error-handler/event-error-handler')


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

/**
 * Loads the specified language file from the specified language
 * @param {String} category - The category of the language file.
 * @param {String} language - The language to load.
 * @returns {Object|null} The language file or null if the file does not exist.
 */
function loadLanguageFile(category, language) {

    // Check if the category file exists in the specified language
    const langPath = path.resolve(__dirname, `../languages/${language}/${category}.json`)

    // Return null if the language file does not exist
    if (!fs.existsSync(langPath))
        return logger.warn(`Missing language file ${langPath}: some translations may not be available`)

    // Return the parsed language file
    return JSON.parse(fs.readFileSync(langPath))
}

/**
 * Loads the specified language
 * @param {string} language - The language to load.
 * @returns {object|null} The language file or null if the language is not configured correctly.
 **/
function loadLanguage(language) {

    // Check if the language folder exists
    const langPath = path.resolve(__dirname, `../languages/${language}`)
    if (!fs.existsSync(langPath))
        return logger.error(`Language folder does not exist: ${langPath}`)


    // Load language files
    const languageObject = {
        commands: loadLanguageFile('commands', language),
        events: loadLanguageFile('events', language),
        utils: loadLanguageFile('utils', language)
    }

    // Check if the language files were loaded
    if (!languageObject.commands && !languageObject.events && !languageObject.utils)
        return logger.error(`Could not load language ${language}: missing language files`)

    // Log the loaded language 
    logger.info(`Loaded language: ${language}`)

    // Return the language object
    return languageObject
}
/**
 * Loads languages from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the languages.
 */
function loadLanguages(folderPath) {

    // Log the loading of languages
    logger.info('Loading languages...')

    // Check if the folder exists
    if (!fs.existsSync(folderPath))
        return logger.error(`Could not load languages: ${folderPath} does not exist`)

    // Default language, en, is used if the LANG environment variable is not set
    const defaultLanguage = 'en'
    const language = process.env.LANGUAGE || defaultLanguage


    //Load default language
    const defaultLangObj = loadLanguage(defaultLanguage)

    // If selected language is default, load to process.language
    if (language === defaultLanguage) {
        process.language = defaultLangObj
    }
    else {
        // Load selected language
        process.language = loadLanguage(language)

        // If it does not exist, asign default, else asign default to process.defaultLanguage
        if (!process.language)
            process.language = defaultLangObj
        else
            process.defaultLanguage = defaultLangObj
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
/**
 * Loads events from the specified folder path and binds them to the emitter.
 * @param {string} folderPath - The path of the folder containing the events.
 * @param {object} emitter - The event emitter to bind the events to.
 * @param {Client} client - The Discord client.
 */
function loadEvents(folderPath, client) {

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

/**
 * Validates command options.
 * @param {Array} options - The command options to validate.
 * @throws Will throw an error if validation fails.
 */
function validateOptions(options) {
    options.forEach(option => {
        if (!option.name) throw new Error(`Any option is missing a name`)
        if (option.name !== option.name.toLowerCase() || option.name.includes(' '))
            throw new Error(`Option name "${option.name}" must be lowercase and cannot contain spaces`)
        if (!option.description) throw new Error(`Option "${option.name}" is missing a description`)
        if (option.type === undefined) throw new Error(`Option "${option.name}" is missing a type`)

        if (option.choices) {
            option.choices.forEach(choice => {
                if (!choice.name) throw new Error(`Choice is missing a name for option "${option.name}"`)
                if (choice.value === undefined) throw new Error(`Choice for option "${option.name}" is missing a value`)
            })
        }
    })
}

/**
 * Loads commands recursively from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 * @param {Client} client - The Discord client.
 */
function loadCommandsRec(folderPath, client) {

    // Load commands recursively
    fs.readdirSync(folderPath).forEach((file) => {

        try {
            // Resolve the file path
            const filePath = path.resolve(folderPath, file)

            // Check if the file is a directory, apply recursion
            if (fs.statSync(filePath).isDirectory()) {
                loadCommandsRec(filePath, client)
            }
            else {
                // Only load JavaScript files
                if (!file.endsWith('.js'))
                    return logger.warn(`Skipping non-JavaScript file: ${file}`)

                // Check if the command file is valid
                const command = require(filePath)

                const commandName = command.name
                if (!commandName)
                    throw new Error(`missing command name`)
                else if (commandName !== commandName.toLowerCase() || commandName.includes(' '))
                    throw new Error(`Command name must be lowercase and cannot contain spaces`)

                const commandDescription = command.description
                if (!commandDescription)
                    throw new Error(`Missing command description`)

                const commandRun = command.run
                if (!commandRun || typeof commandRun !== 'function')
                    throw new Error(`Missing command 'run' function`)

                if (command.options)
                    validateOptions(command.options)

                // Set the command in the client
                client.commands.set(commandName, command)
            }
        } catch (error) {
            logger.error(`Could not load command ${file}:`, error.message)
        }
    })
}

/**
 * Loads commands from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the commands.
 * @param {Client} client - The Discord client.
 */
function loadCommands(folderPath, client) {

    // Log the loading of commands
    logger.info('Loading commands...')

    // Initialize the collection of commands
    client.commands = new Collection()

    // Check if the folder exists
    if (!fs.existsSync(folderPath))
        return logger.error(`Could not load commands: ${folderPath} does not exist`)

    // Load commands
    loadCommandsRec(folderPath, client)

    // Log the number of loaded commands
    logger.info(`Loaded ${client.commands.size} commands`)
}

