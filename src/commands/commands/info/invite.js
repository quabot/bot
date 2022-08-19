const { Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
    name: "invite",
    description: "Add QuaBot to your own servers.",
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        interaction.editReply({
            embeds: [await generateEmbed(color, "Invite QuaBot **[here](https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=995243562134409296)**.")]
        }).catch((e => { }));
    }
}