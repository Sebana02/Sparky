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
     * 
     * You can combine permissions using bitwise OR (|)
     * 
     * Example: PermissionsBitField.Flags.ADMINISTRATOR | PermissionsBitField.Flags.BAN_MEMBERS
     * 
     * You can skip this property if the command does not require permissions
     * 
     * You can find them in: https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
     * Or use the permissions object in the utils folder in file permissions.js
     */
    permissions: PermissionsBitField.Flags.ADMINISTRATOR,

    /**
     * Command requires user to be in a voice channel
     * 
     * You can skip this property if the command does not require the user to be in a voice channel
     */
    voiceChannel: true,

    /**
     * Command options
     * 
     * You can skip this property if the command does not have options
     * 
     * Options are objects with the following properties:
     * - name: The name of the option
     * - description: The description of the option
     * - type: The type of the option (ApplicationCommandOptionType)
     * - required: Whether the option is required or not
     * 
     * You can add more properties depending on the option type
     * 
     * You can add more options by adding more objects to the array
     * 
     * You can check full option fields in the discord.js documentation
     */
    options: [
        {
            name: 'nombre de la opción',
            description: 'descripción de la opción',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    /**
     * Command run function
     * @param {Client} client - The Discord client object
     * @param {Interaction} inter - The interaction object related to the command
     * @returns {Promise<void>} - A promise that resolves when the command is finished, if not needed, remove async
     */
    run: async (client, inter) => {

        // Your code here
    }
}