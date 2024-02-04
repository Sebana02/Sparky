const { EmbedBuilder } = require('discord.js')

module.exports = (color, title, description, footer) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter(footer)
}
