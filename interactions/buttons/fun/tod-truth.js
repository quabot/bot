const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const truthOptions = require('../../../structures/files/truth.json');

module.exports = {
    id: "tod-truth",
    execute(interaction, client, color) {

        const truth = truthOptions[Math.floor(Math.random() * truthOptions.length)];

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL({ dynamic: true })}` })
                    .setDescription(`**${truth}**`)
                    .setFooter({ text: "Type: Truth" })
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
        }).catch((err => { }));
    }
}