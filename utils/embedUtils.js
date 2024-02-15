const { EmbedBuilder } = require('discord.js')

/**
 * Utils for creating Discord embeds
 */
module.exports = {

    /**
 * Creates a Discord embed using the provided embedContent.
 * 
 * @param {Object} embedContent - The content for the embed.
 * @param {string?} [embedContent.title] - The title of the embed.
 * @param {string?} [embedContent.description] - The description of the embed.
 * @param {number?} [embedContent.color=0x2c2d30] - The color of the embed represented as a hexadecimal number.
 * @param {Array<{name:string, value:string, inline?:boolean}>?} [embedContent.fields] - The fields of the embed. Each field should have a name and a value, and can also have an inline property.
 * @param {string?} [embedContent.thumbnail] - The thumbnail of the embed.
 * @param {string?} [embedContent.image] - The image of the embed.
 * @param {{text:string, iconURL? :string}?} [embedContent.footer] - The footer of the embed. The footer should have a text property and can also have an iconURL property.
 * @param {{name:string, iconURL?:string}?} [embedContent.author] - The author of the embed. The author should have a name property and can also have an iconURL property.
 * @param {string?} [embedContent.url] - The URL of the embed.
 * @param {boolean?} [embedContent.setTimestamp=false] - Whether to set the timestamp of the embed.
 * @returns {EmbedBuilder} - The created Discord embed.
 * @throws {Error} - If the created embed is empty.
 * 
 * @example
 * const embedContent = {
 *     title: 'Example Embed',
 *     description: 'This is an example embed created using createEmbed function.',
 *     color: 0xFF0000,
 *     fields: [
 *         { name: 'Field 1', value: 'Value 1', inline: true },
 *         { name: 'Field 2', value: 'Value 2', inline: true }
 *     ],
 *     footer: { text: 'Footer Text', iconURL: 'https://example.com/footer-icon.png' },
 *     author: { name: 'Author Name', iconURL: 'https://example.com/author-icon.png' },
 *     url: 'https://example.com/embed',
 *     setTimestamp: true
 * };
 * 
 * const embed = createEmbed(embedContent);
 * 
 * @note Make sure to provide at least one of the following properties: title, description, fields, image, thumbnail, author, or footer, otherwise an error will be thrown.
 */
    createEmbed: (embedContent) => {
        // Destructure the embedContent object
        const {
            title,
            description,
            color = 0x2c2d30,
            fields,
            thumbnail,
            image,
            footer,
            author,
            url,
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
            if (footer) embed.setFooter(footer)
            if (author) embed.setAuthor(author)
            if (setTimestamp) embed.setTimestamp()
            if (fields) embed.addFields(fields)

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
            throw new Error(`creating embed: ${error.message}`)
        }

        return embed
    }
}
