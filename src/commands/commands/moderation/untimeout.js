const { Interaction, Client, EmbedBuilder, PermissionFlagsBits, MembershipScreeningFieldType, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');
const { getModerationConfig } = require('../../../structures/functions/config');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ModerateMembers)
        .setDescription('Remove a timeout from a user.')
        .addUserOption(option => option.setName("user").setDescription("User to untimeout.").setRequired(true))
        .addBooleanOption(option => option.setName("private").setDescription("Do you want the untimeout to be only visible to you?.").setRequired(false))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        const ephemeral = interaction.options.getBoolean("private") ? interaction.options.getBoolean("private") : false;

        await interaction.deferReply({ ephemeral }).catch((e => { }));

        const member = interaction.options.getMember("user");
        const user = interaction.options.getUser("user");
        let didTimeout = true;

        if (!user) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "Please enter a user to remove a timeout from.")]
            }).catch((e => { }));
        }

        if (user.id === interaction.user.id) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> What are you trying to do?**\nYou can't remove a timeout from yourself!")]
            }).catch((e => { }));
        }

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "**<:error:990996645913194517> Insufficient permissions**\nYou cannot remove a timeout from a user with roles higher than your own.")]
            }).catch((e => { }));
        }

        const modConfig = await getModerationConfig(client, interaction.guild.id);
        if (!modConfig) {
            didTimeout = false;
            return interaction.editReply({
                embeds: [await generateEmbed(color, "We just created a new config! Please run that command again.")]
            }).catch((e => { }));
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
            }).catch((e => { }))
        });

        if (didTimeout !== true) return;

        if (!ephemeral) member.send({
            embeds: [await generateEmbed(color, `Your timeout was removed on **${interaction.guild.name}**
            **Removed by**: ${interaction.user}
            `)
                .setTitle("Your timeout was removed!")
                .setTimestamp()
            ]
        }).catch((e => { }));

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
        }).catch((e => { }));

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
            }).catch((e => { }));
        }
    }
}