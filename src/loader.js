const { Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

function loadEvents(folderPath, emitter, client) {
    folderPath = path.join(__dirname, folderPath);
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            loadEvents(filePath, emitter);

        } else {
            const event = require(filePath);
            const eventName = file.split('.js')[0];
            emitter.on(eventName, event.bind(null, client))
            console.log(`-> Loaded event: ${eventName}`)
        }
    });
}

module.exports = (client) => {
    // Load events
    loadEvents('../events/process', process, client);
    loadEvents('../events/client', client, client);

    client.commands = new Collection();
};

