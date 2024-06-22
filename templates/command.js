/**
 * Command template
 * 
 * To use this template, copy the content of this file and paste it in a new file inside the commands folder
 * You can create your own folder structure inside the commands folder to organize your commands
 */

module.exports = {
    /**
     * Command name
     */
    name: 'yourCommandName',

    /**
     * Command description
     */
    description: 'Your command description',

    /**
     * Command permissions -> Needed permissions to run the command
     * Use PermissionsBitField.Flags to set the permissions
     * 
     * Example: PermissionsBitField.Flags.ADMINISTRATOR
     */
    permissions: PermissionsBitField.Flags.ADMINISTRATOR,

    /**
     * Command run function
     * @param {Client} client - The Discord client object
     * @param {Object} inter - The interaction object related to the command
     * @returns {Promise<void>} - A promise that resolves when the command is finished, if not needed, remove async
     */
    run: async (client, inter) => {

        // Your code here
    }
}