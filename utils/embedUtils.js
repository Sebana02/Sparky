const { EmbedBuilder } = require('discord.js')

/**
 * Utils for creating Discord embeds
 */
module.exports = {

    /**
     * Creates a Discord embed using the provided embedContent
     * 
     * @param {Object} embedContent - The content for the embed
     * @param {string} [embedContent.title=''] - The title of the embed
     * @param {string} [embedContent.description=''] - The description of the embed
     * @param {number} [embedContent.color=0x2c2d30] - The color of the embed represented as a hexadecimal number
     * @param {Array<{name:string, value:string, inline?:boolean}>} [embedContent.fields=[]] - The fields of the embed. Each field should have a name and a value, and can also have an inline property
     * @param {string} [embedContent.thumbnail=''] - The thumbnail of the embed
     * @param {string} [embedContent.image=''] - The image of the embed
     * @param {{text:string, iconURL? :string}} [embedContent.footer={text:''}] - The footer of the embed. The footer should have a text property and can also have an iconURL property
     * @param {{name:string, iconURL?:string}} [embedContent.author={name:''}] - The author of the embed. The author should have a name property and can also have an iconURL property
     * @param {string} [embedContent.url] - The URL of the embed
     * @param {boolean} [embedContent.setTimestamp=false] - Whether to set the timestamp of the embed
     * @param {Object} [options={}] - The options for the function
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the creation of the embed
     * @returns {EmbedBuilder} - The created Discord embed
     * @throws {Error} - If the created embed is empty
     * @note Make sure to provide at least one of the following properties: title, description, fields, image, thumbnail, author, or footer, otherwise an error will be thrown
     */
    createEmbed: (embedContent, options = { propagate: true }) => {
        // Destructure the embedContent object
        const {
            title = '',
            description = '',
            color = 0x2c2d30,
            fields = [],
            thumbnail = '',
            image = '',
            footer = { text: '' },
            author = { name: '' },
            url = '',
            setTimestamp = false
        } = embedContent

        const embed = new EmbedBuilder()

        try {

            // Set the properties of the embed
            if (title) embed.setTitle(title)
            if (description) embed.setDescription(description)
            if (color) embed.setColor(color)
            if (thumbnail) embed.setThumbnail(thumbnail)
            if (image) embed.setImage(image)
            if (url) embed.setURL(url)
            if (footer && footer.text) embed.setFooter(footer)
            if (author && author.name) embed.setAuthor(author)
            if (setTimestamp) embed.setTimestamp()
            if (fields) fields.forEach(field => { if (field.name && field.value) embed.addFields(field) })

            // Check if the embed is empty
            if (!(embed.data.title ||
                embed.data.description ||
                embed.data.fields ||
                embed.data.image ||
                embed.data.thumbnail ||
                embed.data.author ||
                embed.data.footer
            )) {
                throw new Error('embed is empty')
            }

        } catch (error) {
            if (options.propagate) throw new Error(`creating embed: ${error.message}`)
            else console.error(`Error: creating embed: ${error.message}`)
        }

        return embed
    },

    /**
     * Modify an existing Discord embed using the provided embedContent
     * 
     * @param {EmbedBuilder} embed - The existing Discord embed to be modified
     * @param {Object} embedContent - The content for the embed
     * @param {string} [embedContent.title=''] - The title of the embed
     * @param {string} [embedContent.description=''] - The description of the embed
     * @param {number} [embedContent.color=0x2c2d30] - The color of the embed represented as a hexadecimal number
     * @param {Array<{name:string, value:string, inline?:boolean}>} [embedContent.fields=[]] - The fields of the embed. Each field should have a name and a value, and can also have an inline property
     * @param {string} [embedContent.thumbnail=''] - The thumbnail of the embed
     * @param {string} [embedContent.image=''] - The image of the embed
     * @param {{text:string, iconURL? :string}} [embedContent.footer={text:''}] - The footer of the embed. The footer should have a text property and can also have an iconURL property
     * @param {{name:string, iconURL?:string}} [embedContent.author={name:''}] - The author of the embed. The author should have a name property and can also have an iconURL property
     * @param {string} [embedContent.url] - The URL of the embed
     * @param {boolean} [embedContent.setTimestamp=false] - Whether to set the timestamp of the embed
     * @param {Object} [options={}] - The options for the function
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the modification of the embed
     * @returns {EmbedBuilder} - The modified Discord embed
     * @throws {Error} - If the modified embed is empty
     * @note Make sure to provide at least one of the following properties: title, description, fields, image, thumbnail, author, or footer, otherwise an error will be thrown
     */
    modifyEmbed: (embed, embedContent, options = { propagate: true }) => {
        // Destructure the embedContent object
        const {
            title = '',
            description = '',
            color = null,
            fields = [],
            thumbnail = '',
            image = '',
            footer = { text: '' },
            author = { name: '' },
            url = '',
            setTimestamp = false
        } = embedContent

        try {

            // Set the properties of the embed
            if (title) embed.setTitle(title)
            if (description) embed.setDescription(description)
            if (color) embed.setColor(color)
            if (thumbnail) embed.setThumbnail(thumbnail)
            if (image) embed.setImage(image)
            if (url) embed.setURL(url)
            if (footer && footer.text) embed.setFooter(footer)
            if (author && author.name) embed.setAuthor(author)
            if (setTimestamp) embed.setTimestamp()
            else embed.setTimestamp(null)
            if (fields) fields.forEach(field => { if (field.name && field.value) embed.addFields(field) })

            // Check if the embed is empty
            if (!(embed.data.title ||
                embed.data.description ||
                embed.data.fields ||
                embed.data.image ||
                embed.data.thumbnail ||
                embed.data.author ||
                embed.data.footer
            )) {
                throw new Error('embed is empty')
            }

        } catch (error) {
            if (options.propagate) throw new Error(`modifying embed: ${error.message}`)
            else console.error(`Error: modifying embed: ${error.message}`)
        }

        return embed
    },

    /**
     * Clone an existing Discord embed
     * 
     * @param {EmbedBuilder} embed - The existing Discord embed to be cloned
     * @param {Object} [options={}] - The options for the function
     * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the cloning of the embed
     * @returns {EmbedBuilder} - The cloned Discord embed
     * @throws {Error} - If the cloned embed is empty
     */
    cloneEmbed: (embed, options = { propagate: true }) => {

        try {

            // Clone the embed
            const clonedEmbed = embed.clone()

            // Check if the cloned embed is empty
            if (!(clonedEmbed.data.title ||
                clonedEmbed.data.description ||
                clonedEmbed.data.fields ||
                clonedEmbed.data.image ||
                clonedEmbed.data.thumbnail ||
                clonedEmbed.data.author ||
                clonedEmbed.data.footer
            )) {
                throw new Error('embed is empty')
            }

        } catch (error) {
            if (options.propagate) throw new Error(`cloning embed: ${error.message}`)
            else console.error(`Error: cloning embed: ${error.message}`)
        }

        return clonedEmbed
    }
}
