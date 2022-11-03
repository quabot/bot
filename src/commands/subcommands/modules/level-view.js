const { Client, EmbedBuilder } = require('discord.js');
const { getLevelConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: 'view',
    command: 'level',
    /**
     * @param {Client} client
     * @param {import("discord.js").Interaction} interaction
     */
    async execute(client, interaction, color) {
        const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user;

        await interaction.deferReply().catch(e => {});

        const levelConfig = await getLevelConfig(client, interaction.guildId);
        if (!levelConfig)
            return interaction
                .editReply({
                    embeds: [
                        await generateEmbed(
                            color,
                            'We just generated a new server config! Please run that command again.'
                        ),
                    ],
                })
                .catch(e => {});
        if (levelConfig.levelEnabled === false)
            return interaction
                .editReply({
                    embeds: [await generateEmbed(color, 'Levels are disabled in this server.')],
                })
                .catch(e => {});

        const Level = require('../../../structures/schemas/LevelSchema');
        let levelDB = await Level.findOne({
            guildId: interaction.guildId,
            userId: user.id,
        })
            .clone()
            .catch(e => {});

        if (!levelDB)
            levelDB = {
                guildId: interaction.guildId,
                userId: user.id,
                xp: 0,
                level: 0,
            };

        const embeds = [];
        if (Math.random() > 0.5)
            embeds.push(
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(
                        'Tip: By [voting](https://top.gg/bot/995243562134409296) for QuaBot, you receive a **1.5x xp multiplier** for 12 hours!'
                    )
            );
        embeds.push(
            new EmbedBuilder()
                .setTitle(`${user.tag}'s rank`)
                .setDescription(
                    `${user} is level **${levelDB.level}** and has **${levelDB.xp}** xp. You need **${
                        (levelDB.level + 1) * 400 + 100
                    } xp** for the next level.`
                )
                .setFooter({ text: 'quabot.net', iconURL: 'https://images-ext-1.discordapp.net/external/Eb7UTgAZjRli_Q-Wi3T0ttLuzyuDP-2Hi78-rNcW2f8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/995243562134409296/b490d5cd8983d4f22f265c6548e53507.webp?width=663&height=663' })
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setColor(color)
                .setTimestamp()
        );

        interaction.editReply({ embeds }).catch(e => {});
    },
};
