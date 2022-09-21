const { ApplicationCommandType, ContextMenuCommandInteraction, EmbedBuilder, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("warn")
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.channel.messages.fetch({ message: interaction.targetId })
            .then(async message => {

                interaction.reply("Warn");

            }).catch(async e => {
                console.log(e)
                await interaction.editReply({
                    ephemeral: true, embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription("An internal error occurred.")
                    ]
                }).catch((e => { }));
                return;
            });

    }
}