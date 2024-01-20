module.exports = (client) => {
    console.log("Disconnecting bot at " + new Date().toLocaleString())
    client.destroy();
    process.exit();
}