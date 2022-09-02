const { Client, ChannelType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, Colors } = require("discord.js");
const Reaction = require('../../../structures/schemas/ReactionRoleSchema');

module.exports = {
    name: "list",
    command: "reactionroles",
    /**
     * @param {Client} client 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {


        // DISCLAIMER: This is old code from QuaBot v3.1, it works, but if you're going to update it, rewrite it.

    

        await interaction.deferReply({ ephemeral: true }).catch(() => null);

        const ReactionRole = require('../../../structures/schemas/ReactionRoleSchema');

        const msg_id = interaction.options.getString("message_id");
        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");

        let found = await ReactionRole.find({
            guildId: interaction.guild.id,
        });

        //* Worst code ever but it works - It get's the reactionroles!
        if (msg_id && !role && !channel) found = await ReactionRole.find({ guildId: interaction.guild.id, messageId: msg_id });
        if (msg_id && role && !channel) found = await ReactionRole.find({ guildId: interaction.guild.id, messageId: msg_id, roleId: role.id });
        if (msg_id && !role && channel) found = await ReactionRole.find({ guildId: interaction.guild.id, messageId: msg_id, channelId: channel.id });

        if (role && !msg_id && !channel) found = await ReactionRole.find({ guildId: interaction.guild.id, roleId: role.id });
        if (role && msg_id && !channel) found = await ReactionRole.find({ guildId: interaction.guild.id, roleId: role.id, messageId: msg_id });
        if (role && !msg_id && channel) found = await ReactionRole.find({ guildId: interaction.guild.id, roleId: role.id, channelId: channel.id });

        if (channel && !msg_id && !role) found = await ReactionRole.find({ guildId: interaction.guild.id, channelId: channel.id });
        if (channel && msg_id && !role) found = await ReactionRole.find({ guildId: interaction.guild.id, channelId: channel.id, messageId: msg_id });
        if (channel && !msg_id && role) found = await ReactionRole.find({ guildId: interaction.guild.id, channelId: channel.id, roleId: role.id });

        if (role && msg_id && channel) found = await ReactionRole.find({ guildId: interaction.guild.id, roleId: role.id, messageId: msg_id, channelId: channel.id });

        if (found.length === 0) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription("Couldn't find any reactionroles that matched those criteria! Make sure you've got them [configured](https://dashboard.quabot.net).")
            ], ephemeral: true
        }).catch((err => { }));

        const backId = 'backRR'
        const forwardId = 'forwardRR'
        const backButton = new ButtonBuilder({
            style: 'SECONDARY',
            label: 'Back',
            emoji: '⬅️',
            customId: backId
        });
        const forwardButton = new ButtonBuilder({
            style: 'SECONDARY',
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId
        });

        const makeEmbed = async start => {
            const current = found.slice(start, start + 3);

            return new EmbedBuilder({
                title: `Reactionroles ${start + 1}-${start + current.length}/${found.length
                    }`,
                color: Colors.Green,
                fields: await Promise.all(
                    current.map(async (item) => ({
                        name: `${item.emoji} - \`${item.type}\``,
                        value: `Role: <@&${item.roleId}> - [Message](https://discord.com/channels/${interaction.guild.id}/${item.channelId}/${item.messageId})`
                    }))
                )
            });
        }

        const canFit = found.length <= 3
        const msg = await interaction.editReply({
            embeds: [await makeEmbed(0)], fetchReply: true,
            components: canFit
                ? []
                : [new ActionRowBuilder({ components: [forwardButton] })]
        })
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0
        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 3) : (currentIndex += 3)
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new ActionRowBuilder({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 3 < found.length ? [forwardButton] : [])
                        ]
                    })
                ]
            });
        });
    }
}