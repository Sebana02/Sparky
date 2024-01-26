// Event when the bot is exiting
module.exports = {
    event: "exit",
    callback: (client, code) => {
        console.log(`Disconnecting bot at ${new Date().toLocaleString()} with code ${code}`)
    }
}
