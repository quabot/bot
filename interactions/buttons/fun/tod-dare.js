const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const dareOptions = require('../../../structures/files/dare.json');

module.exports = {
    id: "tod-dare",
    execute(interaction, client, color) {

        const dare = dareOptions[Math.floor(Math.random() * dareOptions.length)];

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL({ dynamic: true })}` })
                    .setDescription(`**${dare}**`)
                    .setFooter({ text: "Type: Dare" })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tod-truth')
                            .setLabel(`Truth`)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('tod-dare')
                            .setLabel(`Dare`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('tod-random')
                            .setLabel(`Random`)
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        }).catch(( err => { } ));
    }
}