const { EmbedBuilder } = require('discord.js')


module.exports = (embedInformation) => {
    const {
        title = null,
        description = null,
        color = 0x2c2d30,
        fields = [],
        thumbnail = null,
        image = null,
        footer = {},
        author = {},
        url = null,
        setTimestamp = false
    } = embedInformation

    if (!title && !description)
        throw 'title and description not provided'

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)


    if (thumbnail)
        embed.setThumbnail(thumbnail)

    if (image)
        embed.setImage(image)

    if (url)
        embed.setURL(url)

    if (footer && footer.text)
        embed.setFooter(footer)

    if (author && author.name)
        embed.setAuthor(author)

    if (setTimestamp)
        embed.setTimestamp()

    if (fields && fields.length > 0)
        fields.forEach(field => {
            embed.addFields({
                name: field.name, value: field.value, inline: field.inline || false
            })
        })

    return embed
}
