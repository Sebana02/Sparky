/**
 * Utility function to reply to a Discord interaction.
 * If the interaction is already replied to, it will edit the reply.
 * If the interaction is deferred, it will reply to the interaction.
 * If the interaction is undefined, or no options are provided, it will throw an error.
 * If no content or embeds are provided, it will throw an error.
 * @param {Interaction} interaction - The Discord interaction object.
 * @param {Object} options - Options for the reply.
 * @param {String} options.content - The content of the reply.
 * @param {Boolean} [options.ephemeral=false] - Whether the reply should be ephemeral (visible only to the user who triggered the interaction).
 * @param {Array} [options.embeds=[]] - An array of embed objects to include in the reply.
 * @param {Array} [options.components=[]] - An array of component objects to include in the reply.
 * @param {Number} [options.deleteTime=-1] - Optional time (in seconds) after which to delete the reply. If not specified, the reply will not be deleted.
 * @param {Boolean} [propagate=false] - Whether to propagate the exception if the reply fails
 */
module.exports = async (interaction, options, propagate = true) => {

    try {
        //
        if (!interaction || !options)
            throw 'interaction or options not provided.'

        const {
            content,
            ephemeral = false,
            embeds = [],
            components = [],
            deleteTime = -1
        } = options

        if (!content && embeds.length === 0)
            throw 'content or embeds not provided.'

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
                .catch(error => { throw error })
        }
    }
    catch (error) {
        if (propagate) throw error
        else console.error(`Error: replying interaction: ${error}`)
    }

}