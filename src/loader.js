const { Collection, Client } = require('discord.js')
const fs = require('fs')
const path = require('path')
const { useMainPlayer } = require('discord-player')
const { eventErrorHandler } = require('@utils/eventErrorHandler')


/**
 * Loads the specified language file
 * @param {string} category - The category to load.
 * @param {string} language - The language to load.
 * @returns {object|null} The language file or null if the file does not exist.
 **/
function loadLanguageFile(category, language) {

    // Check if the category file exists in the specified language
    const langPath = path.resolve(__dirname, `../languages/${language}/${category}.json`)
    if (!fs.existsSync(langPath))
        return console.error(`-> Error: Language file required: ${langPath}`)

    // Load the language file
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
        return console.error(`-> Error: Language folder does not exist: ${langPath}`)


    // Load language files
    const languageObject = {
        commands: loadLanguageFile('commands', language),
        events: loadLanguageFile('events', language),
        utils: loadLanguageFile('utils', language)
    }

    // Check if the language files were loaded
    if (!languageObject.commands || !languageObject.events || !languageObject.utils)
        return console.error(`-> Error: missing language files in ${language}`)

    // Log the loaded language and return the language object
    console.log(`-> Loaded language: ${language}`)
    return languageObject
}

/**
 * Loads languages from the specified folder path.
 * @param {string} folderPath - The path of the folder containing the languages.
 */
function loadLanguages(folderPath) {
    if (!fs.existsSync(folderPath))
        return console.error(`-> Error: Folder does not exist: ${folderPath}`)


    // Default language, en, is used if the LANG environment variable is not set
    const defaultLanguage = 'en'
    const language = process.env.LANGUAGE || defaultLanguage

    // Load default language 
    process.defaultLanguage = loadLanguage(defaultLanguage)
    process.language = process.defaultLanguage

    // Load language if it is not the default one
    // If it does not exist, the default language is used
    if (language !== defaultLanguage)
        process.language = loadLanguage(language) || process.defaultLanguage

}

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

            let invalidMessage = `-> Error: Invalid command file: ${file}: `

            const commandName = command.name
            if (!commandName)
                return console.error(invalidMessage + `no command name`)
            else if (commandName !== commandName.toLowerCase() || commandName.includes(' '))
                return console.error(invalidMessage + `command name must be lowercase and cannot contain spaces`)

            const commandDescription = command.description
            if (!commandDescription)
                return console.error(invalidMessage + `no command description`)

            const commandRun = command.run
            if (!commandRun || typeof commandRun !== 'function')
                return console.error(invalidMessage + `no command 'run' function`)

            if (command.options) {
                for (const option of command.options) {
                    if (!option.name)
                        return console.error(invalidMessage + `option is missing a name`)

                    if (option.name !== option.name.toLowerCase() || option.name.includes(' '))
                        return console.error(invalidMessage + `option name "${option.name}" must be lowercase and cannot contain spaces`)

                    if (!option.description)
                        return console.error(invalidMessage + `option "${option.name}" is missing a description`)

                    if (option.type === undefined)
                        return console.error(invalidMessage + `option "${option.name}" is missing a type`)

                    if (option.choices) {
                        for (const choice of option.choices) {
                            if (!choice.name)
                                return console.error(invalidMessage + `choice is missing a name for option "${option.name}"`)

                            if (choice.value === undefined)
                                return console.error(invalidMessage + `choice for option "${option.name}" is missing a value`)
                        }
                    }
                }


            }

            client.commands.set(commandName, command)
            console.log(`-> Loaded command: ${commandName}`)
        }
    })
}

/**
 * Module that loads languages, events and commands.
 */
module.exports = {
    /**
     * Loads languages, events and commands.
     * @param {Client} client - The Discord client.
     */
    config: (client) => {

        try {
            // Load languages
            console.log('-> Loading languages...')
            loadLanguages(path.resolve(__dirname, '../languages'))
        } catch (error) {
            console.error(`Error: loading languages: ${error}`)
        }

        try {
            // Load events
            console.log('-> Loading events...')
            loadEvents(path.resolve(__dirname, '../events/process'), process, client)
            loadEvents(path.resolve(__dirname, '../events/client'), client, client)
            loadEvents(path.resolve(__dirname, '../events/music'), useMainPlayer().events, client)
        } catch (error) {
            console.error(`Error: loading events: ${error}`)
        }

        try {
            // Load commands
            console.log('-> Loading commands...')
            client.commands = new Collection()
            loadCommands(path.resolve(__dirname, '../commands'), client)
        } catch (error) {
            console.error(`Error: loading commands: ${error}`)
        }
    }
}
