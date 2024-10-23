const { Collection, Client } = require('discord.js')
const fs = require('fs')
const path = require('path')

/**
 * Module that loads commands
 */
module.exports = {
    /**
     * Loads commands from the specified folder path.
     * @param {string} folderPath - The path of the folder containing the commands.
     * @param {Client} client - The Discord client.
     */
    loadCommands: (folderPath, client) => {

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
