const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = {
    id: "about-forward-three",
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction, client, color) {

        interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: `QuaBot | Terms of Service`, iconURL: `${client.user.avatarURL({ dynamic: true })}` })
                    .setThumbnail(`${client.user.avatarURL({ dynamic: true })}`)
                    .setFooter({ text: "Created by Joa_sss#0001" })
                    .setDescription(`
                    Our Terms of Service constitute a legally binding agreement made between you and QuaBot, concerning your access to and use of the bot. You agree that by utilising the bot, you have read, understood, and agreed to be bound by all of our Terms of Service.

                    > **By using our bot you agree to those terms. If you do not agree with our Terms of Service then you are expressly prohibited from using the bot and you must discontinue use immediately.**

                    > **Read our privacy policy, by using the bot, you agree to the collection and use of information in accordance with our Privacy Policy.**

                    **Where can i find these Terms of Service an Privacy Policy?**
                    You can find the [Terms of Serivce here](https://quabot.net/tos) and the [Privacy Policy here](https://quabot.net/privacy   )`)
            ], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-all")
                            .setLabel("⏪"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-four")
                            .setLabel("◀️"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-count")
                            .setDisabled(true)
                            .setLabel("4/4"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-forward-three")
                            .setDisabled(true)
                            .setLabel("▶️"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setCustomId("about-forward-all")
                            .setLabel("⏩")
                    )
            ]
        }).catch((err => { }));
    }
}