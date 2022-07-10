const { VERSION } = require('../../../structures/settings.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "about",
    description: "Learn more about QuaBot.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setAuthor({ name: `QuaBot v${VERSION}`, iconURL: `${client.user.avatarURL({ dynamic: true })}` })
                    .setDescription(`Welcome to ur mom. this is a beta.`)
            ]
        }).catch((err => { }));
    }
}