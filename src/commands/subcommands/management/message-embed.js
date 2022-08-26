const { Interaction, EmbedBuilder, Client, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { VERSION } = require('../../../structures/config.json');
const os = require('os');
const { checkChannel } = require('../../../structures/functions/channel');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "embed",
    command: "message",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const channel = interaction.options.getChannel("channel");
        if (await checkChannel(channel.type) === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Please enter a channel where the bot can send messages.")]
        }).catch((e => { }));

        const buttons1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed-color")
                    .setLabel("Set Color")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-title")
                    .setLabel("Set Title")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-url")
                    .setLabel("Set Url")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-author")
                    .setLabel("Set Author")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-description")
                    .setLabel("Set Description")
                    .setStyle(ButtonStyle.Primary),
            )

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed-thumnail")
                    .setLabel("Set Thumbnail")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-image")
                    .setLabel("Set Image")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-footer")
                    .setLabel("Set Footer")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-addfield")
                    .setLabel("Add Field")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed-removefield")
                    .setLabel("Remove Field")
                    .setStyle(ButtonStyle.Danger),
            )

        const buttons3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed-send")
                    .setLabel("Send Message")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("embed-cancel")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger),
            )

        interaction.editReply({
            embeds: [await generateEmbed(color, `Click the buttons below this message to set components of the embed.\nThe message will be sent to ${channel}.`).setFooter({ text: "Changes can be viewed in the embed below." }),
            new EmbedBuilder()
                .setDescription("\u200b")
                .setColor(color)
            ], components: [buttons1, buttons2, buttons3]
        }).catch((e => { }));
    }
}