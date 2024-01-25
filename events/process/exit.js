// Event when the bot is exiting
module.exports = {
    event: "exit",
    callback: (client) => {
        console.log("Disconnecting bot at " + new Date().toLocaleString())

        client.destroy()
    }
};
