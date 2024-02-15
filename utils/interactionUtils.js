/**
 * Utils for handling interactions
 */
module.exports = {
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

        }
        catch (error) {
            if (propagate) throw new Error(`fetching reply: ${error.message}`)
            else console.error(`Error: fetching reply: ${error.message}`)
        }
    },
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