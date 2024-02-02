// Event when user presses CTRL+C (SIGINT)
module.exports = {
    event: "SIGINT",
    callback: async (client) => {
        console.log("Bot received SIGINT signal, disconnecting...")

        await client.destroy()
        process.exit(0)
    }
}
