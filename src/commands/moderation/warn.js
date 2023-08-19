const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getModerationConfig } = require("../../utils/configs/moderationConfig");
const { getUser } = require("../../utils/configs/user");
const { Embed } = require("../../utils/constants/embed");
const Punishment = require('../../structures/schemas/Punishment');
const { randomUUID } = require('crypto');
const { CustomEmbed } = require("../../utils/constants/customEmbed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you wish to warn.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for warning the user.')
            .setRequired(true))
        .addBooleanOption(option => option
            .setName('private')
            .setDescription('Should the message be visible to you only?')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        const private = interaction.options.getBoolean('private') ?? false;

        await interaction.deferReply({ ephemeral: private });


        const config = await getModerationConfig(client, interaction.guildId);
        if (!config) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up moderation for first-time use! Please run the command again.')
            ]
        });


        const reason = interaction.options.getString('reason').slice(0, 800);
        const user = interaction.options.getMember('user');
        if (!user || !reason) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please fill out all the required fields.')
            ]
        });

        
        if (user === interaction.member) return interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('You cannot warn yourself.')
            ]
        });

        if (user.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('You cannot warn a user with roles higher than your own.')
            ]
        });


        const userDatabase = await getUser(interaction.guildId, user.id);
        if (!userDatabase) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('The user has been added to our database. Please run the command again.')
            ]
        });

        userDatabase.warns += 1;
        await userDatabase.save();


        const id = randomUUID();

        const NewPunishment = new Punishment({
            guildId: interaction.guildId,
            userId: user.id,

            channelId: interaction.channelId,
            moderatorId: interaction.user.id,
            time: new Date().getTime(),

            type: 'warn',
            id,
            reason,
            duration: 'none',
            active: false
        });
        await NewPunishment.save();

        interaction.editReply({
            embeds: [
                new Embed(color)
                    .setTitle('User Warned')
                    .setDescription(`**User:** ${user} (@${user.user.username})\n**Reason:** ${reason}`)
                    .addFields(
                        {
                            name: 'Joined Server',
                            value: `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`,
                            inline: true,
                        },
                        {
                            name: 'Account Created',
                            value: `<t:${parseInt(user.user.createdTimestamp / 1000)}:R>`,
                            inline: true,
                        }
                    )
                    .setFooter({ text: `ID: ${id}` })
            ]
        });

        if (config.warnDM) {

            const sentFrom = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sentFrom')
                    .setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
            );

            const parseString = (text) =>
                text
                    .replaceAll('{reason}', reason)
                    .replaceAll('{user}', `${user}`)
                    .replaceAll('{moderator}', interaction.user)
                    .replaceAll('{staff}', interaction.user)
                    .replaceAll('{server}', interaction.guild?.name ?? '')
                    .replaceAll('{color}', color)
                    .replaceAll('{id}', `${id}`)
                    .replaceAll('{joined}', `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`)
                    .replaceAll('{created}', `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`)
                    .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

            await user.send({
                embeds: [
                    new CustomEmbed(config.warnDMMessage, parseString)
                ],
                components: [sentFrom],
                content: parseString(config.warnDMMessage.content)
            }).catch(() => { });
        }

        if (config.channel) {
            const channel = interaction.guild.channels.fetch().get(config.channelId);
            if (!channel) return;

            await channel.send({
                embeds: [
                    new Embed(color)
                        .setTitle('Member Warned')
                        .addFields(
                            { name: 'User', value: `${user} (@${user.user.username})`, inline: true },
                            { name: 'Warned By', value: `${interaction.user}`, inline: true },
                            { name: 'Warned In', value: `${interaction.channel}`, inline: true },
                            { name: 'User Total Warns', value: `${userDatabase.warns}`, inline: true },
                            {
                                name: 'Joined Server',
                                value: `<t:${parseInt(user.joinedTimestamp / 1000)}:R>`,
                                inline: true,
                            },
                            {
                                name: 'Account Created',
                                value: `<t:${parseInt(user.user.createdTimestamp / 1000)}:R>`,
                                inline: true,
                            },
                            { name: 'Reason', value: `${reason}`, inline: false },
                        )
                ]
            })
        }
    }
}