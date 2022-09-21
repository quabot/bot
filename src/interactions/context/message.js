const { ApplicationCommandType, ContextMenuCommandInteraction } = require("discord.js");

module.exports = {
    name: "msg",
    type: ApplicationCommandType.Message,
    /**
     * @param {ContextMenuCommandInteraction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.editReply("Message context command test");

    }
}