const { ApplicationCommandType, EmbedBuilder, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("kick")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        interaction.reply("Kick")

    }
}