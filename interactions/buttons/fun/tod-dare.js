const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const dareOptions = require('../../../structures/files/dare.json');

module.exports = {
    id: "tod-dare",
    execute(interaction, client, color) {

        const dare = dareOptions[Math.floor(Math.random() * dareOptions.length)];

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL({ dynamic: true })}` })
                    .setDescription(`**${dare}**`)
                    .setFooter({ text: "Type: Dare" })
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('tod-truth')
                            .setLabel(`Truth`)
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('tod-dare')
                            .setLabel(`Dare`)
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('tod-random')
                            .setLabel(`Random`)
                            .setStyle('PRIMARY')
                    )
            ]
        }).catch(( err => { } ));
    }
}