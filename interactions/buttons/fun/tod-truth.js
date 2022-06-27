const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const truthOptions = require('../../../structures/files/truth.json');

module.exports = {
    id: "tod-truth",
    execute(interaction, client, color) {

        const truth = truthOptions[Math.floor(Math.random() * truthOptions.length)];

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL({ dynamic: true })}` })
                    .setDescription(`**${truth}**`)
                    .setFooter({ text: "Type: Truth" })
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
        }).catch((err => { }));
    }
}