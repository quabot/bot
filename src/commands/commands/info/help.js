const { Interaction, EmbedBuilder, Client, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { promisify } = require('util');
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = {
    name: "help",
    description: "Get a list of all the bot commands.",
    /**
     * @param {Interaction} interaction
     * @param {Client} client
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const infoList = (await PG(`${process.cwd().replace(/\\/g, "/")}/src/commands/commands/info/*.js`)).map((file) => {
            const item = require(file);
            return `**/${item.name}** - ${item.description}`
        }).join('\n');
        const infoEmbed = new EmbedBuilder()
            .setTitle(`Info Commands`)
            .setDescription(`Get QuaBot's ping, the membercount and much more.
            ${infoList}`)
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(color);

        const helpEmbeds = [infoEmbed];

        const helpComponents = [new ButtonBuilder()
            .setCustomId("previous-help")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("◀️"),
        new ButtonBuilder()
            .setCustomId("next-help")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("▶️")];

        const helpButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("previous-help")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("◀️"),
            new ButtonBuilder()
                .setCustomId("next-help")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("▶️")
        );


        let page = 0;

        const currentPage = await interaction.editReply({
            embeds: [helpEmbeds[page].setFooter({ text: `Page ${page + 1} / ${helpEmbeds.length}` })],
            components: [helpButtons],
            fetchReply: true,
        }).catch((e => { }));


        const filter = (i) =>
            i.customId === "previous-help" ||
            i.customId === "next-help";

        const collector = await currentPage.createMessageComponentCollector({
            filter,
            time: 40000,
        });


        collector.on("collect", async (i) => {
            switch (i.customId) {
                case "previous-about":
                    page = page > 0 ? --page : helpEmbeds.length - 1;
                    break;
                case "next-about":
                    page = page + 1 < helpEmbeds.length ? ++page : 0;
                    break;
            }
            await i.deferUpdate();
            await i.editReply({
                embeds: [helpEmbeds[page].setFooter({ text: `Page ${page + 1} / ${helpEmbeds.length}` })],
                components: [helpButtons],
            }).catch((e => { }));
            collector.resetTimer();
        });

        collector.on("end", (_, reason) => {
            if (reason !== "messageDelete") {
                const disabledRow = new ActionRowBuilder().addComponents(
                    helpComponents[0].setDisabled(true),
                    helpComponents[1].setDisabled(true)
                );
                currentPage.edit({
                    embeds: [helpEmbeds[page].setFooter({ text: `Page ${page + 1} / ${helpEmbeds.length}` })],
                    components: [disabledRow],
                }).catch((e => { }));
            }
        });
    }
}