const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = {
    id: "about-forward-one",
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction, client, color) {

        interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: `QuaBot | Dashboard`, iconURL: `${client.user.avatarURL({ dynamic: true })}` })
                    .setThumbnail(`${client.user.avatarURL({ dynamic: true })}`)
                    .setFooter({ text: "Created by Joa_sss#0001" })
                    .setDescription(`In order to make it easier for the end-user to use QuaBot, we created an online dashboard. On our dashboard you can configure every setting to your liking.
                    
                    **What does it offer?**
                    > - Server Insights: Member Lists, Server statistics in graphs & Dashboard Action Logs.\n> - Module configuration: Tickets, Welcome, Suggestions & Polls and loads more to configure QuaBot.\n> - Command toggles: toggle commands or an entire command group.\n\nClick **[here](https://dashboard.quabot.net)** for our dashboard.`)
            ], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-all")
                            .setLabel("⏪"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-two")
                            .setLabel("◀️"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-count")
                            .setDisabled(true)
                            .setLabel("2/4"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-forward-two")
                            .setLabel("▶️"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-forward-all")
                            .setLabel("⏩")
                    )
            ]
        }).catch((err => { }));
    }
}