const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    name: "view",
    command: "level",
    async execute(client, interaction, color) {

        const user = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;

        const Level = require('../../../structures/schemas/LevelSchema');
        let LevelDatabase = await Level.findOne({
            guildId: interaction.guild.id,
            userId: user.id
        }, (err, config) => {
            if (err) console.log(err);
            if (!config) {
                const newLevel = new Level({
                    guildId: interaction.guild.id,
                    userId: user.id,
                    xp: 0,
                    level: 0,
                    role: 'none',
                });
                newLevel.save();
            }
        }).clone().catch((err => { }));

        if (!LevelDatabase) LevelDatabase = {
            guildId: interaction.guild.id,
            userId: user.id,
            xp: 0,
            level: 0
        };

        const xp = LevelDatabase.xp ? LevelDatabase.xp : 0;
        const level = LevelDatabase.level ? LevelDatabase.level : 0;

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

        if (LevelConfigDatabase.levelCard === true) {
            const rankCard = new canvacord.Rank()
                .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
                .setCurrentXP(xp)
                .setRequiredXP(level * 400 + 100)
                .setProgressBar(color, 'COLOR', true)
                .setUsername(user.username)
                .setLevel(level)
                .setDiscriminator(user.discriminator)
                .setRank(1, 'none', false)
            rankCard.build().then(data => {
                const attactment = new AttachmentBuilder(data, 'levelcard.png')
                interaction.reply({ files: [attactment] }).catch((err => { }));
            });
        } else {
            let levelUpMsg = `{user} is level **{level}** with **{xp}** xp!`;
            levelUpMsg = levelUpMsg.replaceAll("{user}", `${user}`)
            levelUpMsg = levelUpMsg.replaceAll("{username}", `${user.username}`)
            levelUpMsg = levelUpMsg.replaceAll("{tag}", `${user.tag}`)
            levelUpMsg = levelUpMsg.replaceAll("{discriminator}", `${user.discriminator}`)
            levelUpMsg = levelUpMsg.replaceAll("{guild}", `${interaction.guild.name}`)
            levelUpMsg = levelUpMsg.replaceAll("{xp}", `${xp}`)
            levelUpMsg = levelUpMsg.replaceAll("{level}", `${level}`)

            if (LevelConfigDatabase.levelUpEmbed === true) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle(`${user.username}'s level`)
                            .setThumbnail(user.avatarURL())
                            .setDescription(levelUpMsg)
                            .setTimestamp()
                    ]
                }).catch((err => { }));
            } else {
                interaction.reply({ content: `${levelUpMsg}` }).catch((err => { }));
            }
        }
    }
}
