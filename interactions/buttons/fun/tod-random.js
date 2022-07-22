const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const truthOptions = require('../../../structures/files/truth.json');
const dareOptions = require('../../../structures/files/dare.json');

module.exports = {
    id: "tod-random",
    execute(interaction, client, color) {

        const dare = dareOptions[Math.floor(Math.random() * dareOptions.length)];
        const truth = truthOptions[Math.floor(Math.random() * truthOptions.length)];

        const rnd = Math.random();

        if (rnd < 0.5) {
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
        } else {
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
            }).catch((err => { }));
        }


    }
}