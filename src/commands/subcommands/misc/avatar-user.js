const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "user",
    command: "avatar",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const user = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setImage(`${user.displayAvatarURL({ size: 1024, forceStatic: false })}`)
                    .setDescription(`**Avatar of ${user}**`)
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}