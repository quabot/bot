const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = {
    id: "about-forward-two",
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction, client, color) {

        interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: `QuaBot | Voting`, iconURL: `${client.user.avatarURL({ dynamic: true })}` })
                    .setThumbnail(`${client.user.avatarURL({ dynamic: true })}`)
                    .setFooter({ text: "Created by Joa_sss#0001" })
                    .setDescription(`By voting for QuaBot you're helping us __a lot__.  When you vote with the links below you're getting us more users.

                    **Why should you vote?**
                    It helps us a lot! Show us support without paying money, and it takes just a few seconds. You also get the following benefits:
                    • You get listed in the QuaBot support server.
                    • More perks Coming Soon

                    **How can i vote?**
                    • Go to the sites below.
                    • Click the "Vote" button.
                    • You will have to login.
                    • It's as simple as that! Enjoy you're perks.
                    
                    **Vote Links:**
                    🔗[Top.gg](https://example.com) | 🔗[Top.gg](https://example.com) | 🔗[Top.gg](https://example.com)`)
            ], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-all")
                            .setLabel("⏪"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-three")
                            .setLabel("◀️"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-count")
                            .setDisabled(true)
                            .setLabel("3/4"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-forward-three")
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