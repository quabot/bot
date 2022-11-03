const { Client, EmbedBuilder } = require('discord.js');
const { getLevelConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: 'leaderboard',
    command: 'level',
    /**
     * @param {Client} client
     * @param {import("discord.js").Interaction} interaction
     */
    async execute(client, interaction, color) {
        const sortBy = interaction.options.getString('sortby');

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
        let levelDB = await Level.find({
            guildId: interaction.guildId,
        })
            .clone()
            .catch(e => {});

        if (levelDB.length === 0)
            levelDB = [
                {
                    guildId: interaction.guildId,
                    userId: interaction.user.id,
                    xp: 0,
                    level: 0,
                },
            ];

        const members = await interaction.guild.members.fetch();

        function compareLevel(a, b) {
            return b.level - a.level;
        }
        function compareXp(a, b) {
            return b.xp - a.xp;
        }
        levelDB.sort(compareXp);
        if (sortBy === 'level')
            levelDB = levelDB
                .sort(compareLevel)
                .filter(({ userId }) => members.some(member => member.user.id === userId));
        levelDB = levelDB.slice(0, 10);

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${interaction.guild.name}'s ${sortBy} leaderboard`)
                        .setDescription(
                            `${levelDB
                                .map(
                                    (i, index) => `${index + 1}. Level: **${i.level}** Xp: **${i.xp}** - <@${i.userId}>`
                                )
                                .join('\n')}`
                        )
                        .setColor(color)
                        .setFooter({ text: 'quabot.net', iconURL: 'https://images-ext-1.discordapp.net/external/Eb7UTgAZjRli_Q-Wi3T0ttLuzyuDP-2Hi78-rNcW2f8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/995243562134409296/b490d5cd8983d4f22f265c6548e53507.webp?width=663&height=663' })
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
