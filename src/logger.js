const { Console } = require("console")
const fs = require("fs")

/**
 * Module that changes console stream to log file
 */
module.exports = {
    /**
     * Change console stream to log file
     */
    config: () => {

        //Check if LOG_FILE environment variable is set
        if (!process.env.LOG_FILE || process.env.LOG_FILE.trim() === '') {
            console.error("Error: LOG_FILE environment variable not found")
        }
        else {

            try {
                //Create stream to log file
                const stream = fs.createWriteStream(process.env.LOG_FILE, {
                    flags: 'a',
                    autoClose: true
                })

                //Change console stream to log file
                console = new Console({
                    stdout: stream,
                    stderr: stream,
                })

            } catch (error) { //If error occurs, log error message but continue
                console.error(`Error: setting up logger: ${error.message}`)
            }
        }

        //Log start time
        console.log("------------------------------------------------------\n"
            + "Starting bot at " + new Date().toLocaleString())
    }
}
