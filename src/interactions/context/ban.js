const { ApplicationCommandType, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("ban")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        interaction.reply("Ban")

    }
}