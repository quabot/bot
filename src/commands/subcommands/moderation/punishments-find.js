const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    Message,
    ButtonStyle,
    Colors,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    name: 'find',
    command: 'punishments',
    async execute(client, interaction, color) {
        const ModActionSchema = require('../../../structures/schemas/ModActionSchema');

        const punishment = interaction.options.getString('punishment');
        const user = interaction.options.getUser('user');
        const staff = interaction.options.getUser('staff-member');

        let found = await ModActionSchema.find({
            guildId: interaction.guild.id,
        });
        console.log(staff, user, punishment);
        //* Worst code ever but it works - It get's the reactionroles!
        if (punishment && !user && !staff)
            found = await ModActionSchema.find({ guildId: interaction.guild.id, type: punishment });
        if (punishment && user && !staff)
            found = await ModActionSchema.find({ guildId: interaction.guild.id, type: punishment, userId: user.id });
        if (punishment && !user && staff)
            found = await ModActionSchema.find({
                guildId: interaction.guild.id,
                type: punishment,
                userExecuteId: staff.id,
            });

        if (user && !punishment && !staff)
            found = await ModActionSchema.find({ guildId: interaction.guild.id, userId: user.id });
        if (user && punishment && !staff)
            found = await ModActionSchema.find({ guildId: interaction.guild.id, userId: user.id, type: punishment });
        if (user && !punishment && staff)
            found = await ModActionSchema.find({
                guildId: interaction.guild.id,
                userId: user.id,
                userExecuteId: staff.id,
            });

        if (staff && !punishment && !user)
            found = await ModActionSchema.find({ guildId: interaction.guild.id, userExecuteId: staff.id });
        if (staff && punishment && !user)
            found = await ModActionSchema.find({
                guildId: interaction.guild.id,
                userExecuteId: staff.id,
                type: punishment,
            });
        if (staff && !punishment && user)
            found = await ModActionSchema.find({
                guildId: interaction.guild.id,
                userExecuteId: staff.id,
                userId: user.id,
            });

        if (staff && punishment && user)
            found = await ModActionSchema.find({
                guildId: interaction.guild.id,
                userExecuteId: staff.id,
                userId: user.id,
                type: punishment,
            });

        if (found.length === 0)
            return interaction
                .reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setDescription("Couldn't find any punishments that matched those criteria!"),
                    ],
                    ephemeral: true,
                })
                .catch(e => {});

        found.sort((a, b) => {
            return a.punishmentId - b.punishmentId;
        });

        const backId = 'backRR';
        const forwardId = 'forwardRR';
        const backButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Backward',
            emoji: '⬅️',
            customId: backId,
        });
        const forwardButton = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId,
        });

        await interaction.deferReply({ ephemeral: true });

        const makeEmbed = async start => {
            const current = found.slice(start, start + 3);

            return new EmbedBuilder({
                title: `Punishments ${start + 1}-${start + current.length}/${found.length}`,
                color: Colors.Green,
                fields: await Promise.all(
                    current.map(async item => ({
                        name: `ID: ${item.punishmentId} | \`${item.type}\``,
                        value: `Staff: <@${item.userExecuteId}> | User: <@${item.userId}> - Reason: ${item.reason}`,
                    }))
                ),
            });
        };

        const canFit = found.length <= 3;
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)],
            fetchReply: true,
            components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
        });
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0;
        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 3) : (currentIndex += 3);
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 3 < found.length ? [forwardButton] : []),
                        ],
                    }),
                ],
            });
        });
    },
};
