const { Console } = require("console")
const fs = require("fs")


module.exports = () => {
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

    //Log start time
    console.log("------------------------------------------------------\n"
        + "Starting bot at " + new Date().toLocaleString())
}
