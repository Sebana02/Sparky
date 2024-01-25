// Event when user presses CTRL+C (SIGINT)
module.exports = {
    event: "SIGINT",
    callback: (client) => {
        console.log("Bot received SIGINT\n Disconnecting at " + new Date().toLocaleString())

        client.destroy();

        setTimeout(() => {
            console.log("Bot disconnected successfully.");
            process.exit(0);
        }, 1000);
    }
};
