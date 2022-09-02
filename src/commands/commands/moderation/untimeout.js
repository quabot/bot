const { ApplicationCommandOptionType, Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');
const ms = require('ms');

module.exports = {
    name: "untimeout",
    description: "Remove a timeout from a user.",
    permission: PermissionFlagsBits.ModerateMembers,
    options: [
        {
            name: "user",
            description: "User to timeout.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "private",
            description: "Do you want this action to only be visible to you?",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;

        await interaction.deferReply({ ephemeral }).catch(() => null);

        const member = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");
        let didTimeout = true;

        if (!user) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter a user to remove a timeout from.")]
            }).catch(() => null);
        }

        if (user.id === interaction.user.id) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't remove a timeout from yourself!")]
            }).catch(() => null);
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot remove a timeout from a user with roles higher than your own.")]
            }).catch(() => null);
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch(() => null);
        }

        const channel = interaction.guild.channels.cache.get(modConfig.channelId);

        await member.timeout(1, `Timeout removed by ${interaction.user.tag}`).catch(err => {
            didTimeout = false;
            if (err.code === 50013) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("<:error:990996645913194517> Insufficient permissions")
                        .setDescription(`QuaBot does not have permission to remove a timeout from that user - try moving the QuaBot role above all others`)
                        .setColor(color)
                ], ephemeral
            }).catch((err => { }))
        });

        if (didTimeout !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `Your timeout was removed on **${interaction.guild.name}**
            **Removed by**: ${interaction.user}
            `)
                .setTitle("Your timeout was removed!")
                .setTimestamp()
            ]
        }).catch(() => null);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User Timeout Removed`)
                    .setDescription(`**User**: ${member}`)
                    .setColor(color)
                    .addFields(
                        { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: "\u200b", value: "\u200b", inline: true },
                    )
            ], ephemeral, fetchReply: true
        }).catch(() => null);

        if (channel) {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Member Timeout Removed")
                        .setDescription(`**User**: ${member}`)
                        .setColor(color)
                        .addFields(
                            { name: "Joined Server", value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: "Account Created", value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                            { name: "Removed By", value: `${interaction.user}`, inline: true },
                            { name: "Removed In", value: `${interaction.channel}`, inline: true },
                            { name: "\u200b", value: "\u200b", inline: true },
                        )
                        .setColor(color)
                ],
            }).catch(() => null);
        }
    }
}