const { EmbedBuilder } = require('discord.js')

/**
 * Utils for creating Discord embeds
 */
module.exports = {
    createEmbed,
    modifyEmbed,
    cloneEmbed,
    isValidEmbed
}

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
function createEmbed(embedContent, options = { propagate: true }) {
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
        if (!isValidEmbed(embed))
            throw new Error('embed is not valid')

    } catch (error) {
        if (options.propagate) throw new Error(`creating embed: ${error.message}`)
        else console.error(`Error: creating embed: ${error.message}`)
    }

    return embed
}

/**
 * Modify an existing Discord embed using the provided embedContent
 * 
 * @param {EmbedBuilder} embed - The existing Discord embed to be modified
 * @param {Object} embedContent - The content for the embed
 * @param {string} [embedContent.title - The title of the embed
 * @param {string} [embedContent.description - The description of the embed
 * @param {number} [embedContent.color] - The color of the embed represented as a hexadecimal number
 * @param {Array<{name:string, value:string, inline?:boolean}>} [embedContent.fields - The fields of the embed. Each field should have a name and a value, and can also have an inline property
 * @param {string} [embedContent.thumbnail - The thumbnail of the embed
 * @param {string} [embedContent.image - The image of the embed
 * @param {{text:string, iconURL? :string}} [embedContent.footer] - The footer of the embed. The footer should have a text property and can also have an iconURL property
 * @param {{name:string, iconURL?:string}} [embedContent.author] - The author of the embed. The author should have a name property and can also have an iconURL property
 * @param {string} [embedContent.url] - The URL of the embed
 * @param {boolean} [embedContent.setTimestamp] - Whether to set the timestamp of the embed
 * @param {Object} [options={}] - The options for the function
 * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the modification of the embed
 * @returns {EmbedBuilder} - The modified Discord embed
 * @throws {Error} - If the modified embed is empty
 * @note Make sure to provide at least one of the following properties: title, description, fields, image, thumbnail, author, or footer, otherwise an error will be thrown
 */
function modifyEmbed(embed, embedContent, options = { propagate: true }) {
    try {

        // Check if the given embed is valid
        if (!embed || !embed.data)
            throw new Error('given embed is not valid')

        // Set the properties of the embed
        if ('title' in embedContent)
            embedContent.title ? embed.setTitle(embedContent.title) : embed.data.title = ''

        if ('description' in embedContent)
            embedContent.description ? embed.setDescription(embedContent.description) : embed.data.description = ''

        if ('color' in embedContent)
            embed.setColor(embedContent.color)

        if ('thumbnail' in embedContent)
            embedContent.thumbnail ? embed.setThumbnail(embedContent.thumbnail) : embed.data.thumbnail = ''

        if ('image' in embedContent)
            embedContent.image ? embed.setImage(embedContent.image) : embed.data.image = ''

        if ('url' in embedContent)
            embedContent.url ? embed.setURL(embedContent.url) : embed.data.url = ''

        if ('footer' in embedContent)
            Object.keys(embedContent.footer).length ? embed.setFooter(embedContent.footer) : embed.data.footer = { text: '', iconURL: '' }

        if ('author' in embedContent && author.name)
            Object.keys(embedContent.author).length ? embed.setFooter(embedContent.author) : embed.data.author = { name: '', iconURL: '' }

        if ('setTimestamp' in embedContent)
            embedContent.setTimestamp ? embed.setTimestamp() : embed.setTimestamp(null)

        if ('fields' in embedContent)
            embedContent.fields.length ? fields.forEach(field => { if (field.name && field.value) embed.addFields(field) }) : embed.data.fields = []

        // Check if the embed is empty
        if (!isValidEmbed(embed))
            throw new Error('embed is not valid')

    } catch (error) {
        if (options.propagate) throw new Error(`modifying embed: ${error.message}`)
        else console.error(`Error: modifying embed: ${error.message}`)
    }

    return embed
}

/**
 * Clone an existing Discord embed
 * 
 * @param {EmbedBuilder} embed - The existing Discord embed to be cloned
 * @param {Object} [options={}] - The options for the function
 * @param {boolean} [options.propagate=true] - Whether to propagate any errors that occur during the cloning of the embed
 * @returns {EmbedBuilder} - The cloned Discord embed
 * @throws {Error} - If the cloned embed is empty
 */
function cloneEmbed(embed, options = { propagate: true }) {

    try {

        // Check if the given embed is valid
        if (!embed || !embed.data)
            throw new Error('given embed is not valid')

        // Clone the embed
        const clonedEmbed = embed.clone()

        // Check if the embed is empty
        if (!isValidEmbed(clonedEmbed))
            throw new Error('embed is empty')

        return clonedEmbed

    } catch (error) {
        if (options.propagate) throw new Error(`cloning embed: ${error.message}`)
        else console.error(`Error: cloning embed: ${error.message}`)
    }
}

/**
 * Checks if an existing Discord embed is valid
 * Valid embeds must have at least one of the following properties: title, description, fields, image, thumbnail, author, or footer
 * @param {EmbedBuilder} embed - The existing Discord embed to check
 * @returns {boolean} - Whether the embed is valid
 */
function isValidEmbed(embed) {
    if (!embed || !embed.data) return false

    return (embed.data.title ||
        embed.data.description ||
        embed.data.fields ||
        embed.data.image ||
        embed.data.thumbnail ||
        (embed.data.author && embed.data.author.name) ||
        (embed.data.footer && embed.data.footer.text)
    )
}

