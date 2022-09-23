const { ApplicationCommandType, EmbedBuilder, ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Avatar")
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e) => { });;

        const user = interaction.targetUser;

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setImage(`${user.displayAvatarURL({ size: 1024, forceStatic: false })}`)
                    .setDescription(`**Avatar of ${user}**`)
                    .setTimestamp()
            ]
        }).catch((e) => { });

    }
}