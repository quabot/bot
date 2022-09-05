const { Client, EmbedBuilder } = require("discord.js");
const { getLevelConfig } = require("../../../structures/functions/config");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    name: "view",
    command: "level",
    /**
     * @param {Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const user = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;

        await interaction.deferReply().catch(() => null);

        const levelConfig = await getLevelConfig(client, interaction.guildId);
        if (!levelConfig) return interaction.editReply({
            embeds: [await generateEmbed(color, "We just generated a new server config! Please run that command again.")]
        }).catch(() => null);
        if (levelConfig.levelEnabled === false) return interaction.editReply({
            embeds: [await generateEmbed(color, "Levels are disabled in this server.")]
        }).catch(() => null);

        const Level = require("../../../structures/schemas/LevelSchema");
        let levelDB = await Level.findOne({
            guildId: interaction.guildId,
            userId: user.id
        }).clone().catch(() => null);

        if (!levelDB) levelDB = {
            guildId: interaction.guildId,
            userId: user.id,
            xp: 0,
            level: 0,
        };

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${user.tag}'s rank`)
                    .setDescription(`${user} is level **${levelDB.level}** and has **${levelDB.xp}** xp.`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setColor(color)
                    .setTimestamp()
            ]
        }).catch(() => null);
    }
}