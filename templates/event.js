/**
 * Event template
 * 
 * To use this template, copy the content of this file in its corresponding event folder
 * i.e if the event is a client event, copy it in the events/client folder,
 * if the event is a music event, copy it in the events/music folder,
 * if the event is a process event, copy it in the events/process folder
 * 
 * Note that "event" value must correspond to a valid event name of the corresponding emitter (check documentation for event names)
 * i.e if the event is a client event, check the discord.js documentation for client events,
 * if the event is a music event, check the discord-player documentation for music events,
 * if the event is a process event, check the node.js documentation for process events
 */

module.exports = {
    /**
     * Event name
     */
    event: 'yourEventName',

    /**
     * Callback function for handling the event
     * @param {Client} client - The Discord client object
     * @param {Object} args - The arguments passed to the event
     * @returns {Promise<void>}
     */
    callback: async (client, args) => {

        // Your code here
    }
}