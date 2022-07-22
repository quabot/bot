const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    name: "leaderboard",
    command: "level",
    async execute(client, interaction, color) {

        let text = '';
        const sortBy = interaction.options.getString("type");

        const LevelConfig = require('../../../structures/schemas/LevelConfigSchema');
        const LevelConfigDatabase = await LevelConfig.findOne({
            guildId: interaction.guild.id,
        }, (err, config) => {
            if (err) console.log(err);
            if (!config) {
                const newLevelConfig = new LevelConfig({
                    guildId: interaction.guild.id,
                    levelEnabled: true,
                    levelUpChannel: "none",
                    levelUpMessage: "{user} is now level **{level}** with **{xp}** xp!",
                    levelUpEmbed: true,
                    levelExcludedChannels: [],
                    levelExcludedRoles: [],
                    levelCard: false,
                    levelRewards: [],
                });
                newLevelConfig.save();
            }
        }).clone().catch((err => { }));

        if (!LevelConfigDatabase) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("We just created a new record! Please run that command again.")
            ], ephemeral: true
        }).catch((err => { }));

        if (LevelConfigDatabase.levelEnabled === false) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Levels are disabled in this server. Enable them on [our dashboard](https://dashboard.quabot.net)")
            ], ephemeral: true
        }).catch((err => { }));

        const Level = require('../../../structures/schemas/LevelSchema');
        const results = await Level.find({
            guildId: interaction.guild.id,
        }).sort({ sortBy: -1 }).limit(15);

        if (!results) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("There are no users with XP in this server!")
            ], ephemeral: true
        }).catch((err => { }));


        for (let counter = 0; counter < results.length; ++counter) {
            const { userId, xp, level = 0 } = results[counter];
            text += `**#${counter + 1}** <@${userId}> - Level: \`${level}\` - XP: \`${xp}\`\n`;
        }

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${interaction.guild.name}'s ${sortBy} Leaderboard`)
                    .setColor(color)
                    .setDescription(text)]
        }).catch((err => { }));

    }
}
