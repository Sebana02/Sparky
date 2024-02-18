const { EmbedBuilder, ActionRowBuilder, ChatInputCommandInteraction } = require("discord.js")

/**
 * Utils for handling interactions
 */
module.exports = {

    /**
     * Reply to an interaction
     * @param {ChatInputCommandInteraction} interaction - The interaction object
     * @param {Object} [options={}] - The options for the reply
     * @param {string} [options.content=''] - The content of the reply
     * @param {boolean} [options.ephemeral=false] - Whether the reply should be ephemeral (only visible to the user who triggered the interaction)
     * @param {Array<EmbedBuilder>} [options.embeds=[]] - The embeds to include in the reply
     * @param {Array<ActionRowBuilder>} [options.components=[]] - The components to include in the reply
     * @param {number} [options.deleteTime=-1] - The time in seconds after which the reply should be deleted
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the reply
     * @throws {Error} - If the interaction is not provided or if neither content nor embeds are provided
     * 
     * @example
     * await reply(interaction, { content: 'Hello, world!' })
     * 
     */
    reply: async (interaction, options = {}) => {

        const {
            content = '',
            ephemeral = false,
            embeds = [],
            components = [],
            deleteTime = -1,
            propagate = true
        } = options

        try {
            //Check if the interaction and options are provided
            if (!interaction)
                throw new Error('interaction not provided')

            if (content === '' && embeds.length === 0)
                throw new Error('content nor embeds not provided')

            //Reply to the interaction
            if (interaction.deferred || interaction.replied)
                await interaction.editReply({ content, ephemeral, embeds, components })
            else
                await interaction.reply({ content, ephemeral, embeds, components })

            //Delete the reply after deleteTime seconds
            if (deleteTime > 0) {
                await new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        await interaction.deleteReply().catch(error => reject(error))
                        resolve()
                    }, deleteTime * 1000)
                })
                    .catch(error => { throw new Error(`deleting reply: ${error.message}`) })
            }
        }
        catch (error) {
            if (propagate) throw new Error(`replying interaction: ${error.message}`)
            else console.error(`Error: replying interaction: ${error.message}`)
        }
    },

    /**
     * Defer a reply to an interaction
     * @param {Object} interaction - The interaction object
     * @param {Object} [options={}] - The options for deferring the reply
     * @param {boolean} [options.ephemeral=false] - Whether the deferred reply should be ephemeral
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the deferral
     * @throws {Error} - If the interaction is not provided
     * 
     * @example
     * 
     * await deferReply(interaction)
     */
    deferReply: async (interaction, options = {}) => {
        const {
            ephemeral = false,
            propagate = true
        } = options

        try {
            //Check if the interaction and options are provided
            if (!interaction)
                throw new Error('interaction not provided')

            //Deferr the interaction if it's not already deferred or replied
            if (!interaction.deferred && !interaction.replied)
                await interaction.deferReply({ ephemeral })

        }
        catch (error) {
            if (propagate) throw new Error(`deferring reply: ${error.message}`)
            else console.error(`Error: deferring reply: ${error.message}`)
        }

    },

    /**
     * Fetch the reply to an interaction
     * @param {Object} interaction - The interaction object
     * @param {Object} [options={}] - The options for fetching the reply
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the fetch
     * @returns {ChatInputCommandInteraction} - The fetched reply
     * @throws {Error} - If the interaction is not provided or if the interaction has not been replied to
     * @returns {Promise<ChatInputCommandInteraction>} - The fetched reply
     * 
     * @example
     * 
     * const reply = await fetchReply(interaction)
     */
    fetchReply: async (interaction, options = {}) => {
        const {
            propagate = true
        } = options

        try {
            //Check if the interaction and options are provided
            if (!interaction)
                throw new Error('interaction not provided')

            //Fetch the reply if the interaction is already replied to
            if (interaction.replied)
                return await interaction.fetchReply()

            throw new Error('interaction has not been replied to')
        }
        catch (error) {
            if (propagate) throw new Error(`fetching reply: ${error.message}`)
            else console.error(`Error: fetching reply: ${error.message}`)
        }
    },

    /**
     * Delete the reply to an interaction
     * @param {Object} interaction - The interaction object
     * @param {Object} [options={}] - The options for deleting the reply
     * @param {number} [options.deleteTime=-1] - The time in seconds after which the reply should be deleted
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the deletion
     * @throws {Error} - If the interaction is not provided
     * 
     * @example
     * 
     * await deleteReply(interaction)
     */
    deleteReply: async (interaction, options = {}) => {
        const {
            deleteTime = -1,
            propagate = true
        } = options

        try {
            //Check if the interaction and options are provided
            if (!interaction)
                throw new Error('interaction not provided')

            //Delete the reply after deleteTime seconds
            if (deleteTime > 0) {
                await new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        await interaction.deleteReply().catch(error => reject(error))
                        resolve()
                    }, deleteTime * 1000)
                })
                    .catch(error => { throw error })
            }
            else
                await interaction.deleteReply()
        }
        catch (error) {
            if (propagate) throw new Error(`deleting reply: ${error.message}`)
            else console.error(`Error: deleting reply: ${error.message}`)
        }
    },

    /**
     * Follow up on an interaction
     * @param {Object} interaction - The interaction object
     * @param {Object} [options={}] - The options for following up on the interaction
     * @param {string} [options.content=''] - The content of the follow-up message
     * @param {boolean} [options.ephemeral=false] - Whether the follow-up message should be ephemeral
     * @param {Array<EmbedBuilder>} [options.embeds=[]] - The embeds to include in the follow-up message
     * @param {Array<ActionRowBuilder>} [options.components=[]] - The components to include in the follow-up message
     * @param {number} [options.deleteTime=-1] - The time in seconds after which the follow-up message should be deleted
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the follow-up
     * @throws {Error} - If the interaction is not provided or if neither content nor embeds are provided
     * 
     * @example
     * 
     * await followUp(interaction, { content: 'Hello, world!' })
     */
    followUp: async (interaction, options = {}) => {
        const {
            content = '',
            ephemeral = false,
            embeds = [],
            components = [],
            deleteTime = -1,
            propagate = true
        } = options

        try {
            //Check if the interaction and options are provided
            if (!interaction)
                throw new Error('interaction not provided')

            if (content === '' && embeds.length === 0)
                throw new Error('content nor embeds not provided')

            //Follow up the interaction if it's already replied to, e.o.c. reply to the interaction
            if (interaction.replied)
                await interaction.followUp({ content, ephemeral, embeds, components })
            else
                await interaction.reply({ content, ephemeral, embeds, components })

            //Delete the reply after deleteTime seconds
            if (deleteTime > 0) {
                await new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        await interaction.deleteReply().catch(error => reject(error))
                        resolve()
                    }, deleteTime * 1000)
                })
                    .catch(error => { throw new Error(`deleting reply: ${error.message}`) })
            }
        }
        catch (error) {
            if (propagate) throw new Error(`following up interaction: ${error.message}`)
            else console.error(`Error: following up interaction: ${error.message}`)
        }
    }
}