const { Console } = require("console")
const fs = require("fs")

/**
 * Module that changes console stream to log file
 */
module.exports = {
    /**
     * Change console stream to log file. This in an optional feature.
     */
    config: () => {

        //Check if LOG_FILE environment variable is set
        if (!process.env.LOG_FILE || process.env.LOG_FILE.trim() === '') {
            console.error("Error: LOG_FILE environment variable not found")
        }
        else {

            try {
                //Create stream to log file
                const logStream = fs.createWriteStream(process.env.LOG_FILE, { flags: 'a', autoClose: true })

                //Create new console object
                const logConsole = new Console({ stdout: logStream, stderr: logStream, })

                //Redirect original console
                const originalLog = console.log
                const originalError = console.error

                //Override console.log and console.error
                console.log = (...args) => {
                    originalLog(...args)
                    logConsole.log(...args)
                }

                console.error = (...args) => {
                    originalError(...args)
                    logConsole.error(...args)
                }

            } catch (error) { //If error occurs, log error message but continue
                console.error(`Error: setting up logger: ${error.message}`)
            }
        }

        //Log start time
        console.log("------------------------------------------------------\n"
            + "Starting bot at " + new Date().toLocaleString())
    }
}
