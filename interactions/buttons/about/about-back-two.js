const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const { VERSION } = require('../../../structures/settings.json');

module.exports = {
    id: "about-back-two",
    /**
     * @param {Interaction} interaction 
     */
    async execute(interaction, client, color) {

        interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setAuthor({ name: `QuaBot v${VERSION}`, iconURL: `${client.user.avatarURL({ dynamic: true })}` })
                    .setThumbnail(`${client.user.avatarURL({ dynamic: true })}`)
                    .setFooter({ text: "Created by Joa_sss#0001" })
                    .setDescription(`Welcome to information center for **<:QuaBot:989618048010977412> [QuaBot](https://quabot.net)**! Here you can find loads of info about QuaBot and it's features. QuaBot uses the new slash commands, so the prefix to use it is \`/\`! We use interactions all throughout our commands and modules.
                    
                    QuaBot was designed and developed by [Joa_sss](https://joasss.xyz) and [foxl](https://foxl.design) and was written in Javascript with the [discord.js](https://discord.js.org) framework.
                    
                    It's very easy to get started with QuaBot, by simply typing a \`/\`! If you're still stuck somewhere, you can join our **[Support Server](https://discord.gg/HhPtvhPU2n)** and ask for help there. To view all commands use \`/help\`. Go to the next page for more information.
                    
                    **[Website](https://quabot.net)** | **[Support](https://discord.gg/HhPtvhPU2n)** | **[Invite](https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=995243562134409296)** | **[Dashboard](https://dashboard.quabot.net)**`)
            ], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setCustomId("about-back-all")
                            .setLabel("⏪"),
                        new ButtonBuilder()
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-back-two")
                            .setLabel("◀️"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-count")
                            .setDisabled(true)
                            .setLabel("1/4"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("about-forward-one")
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