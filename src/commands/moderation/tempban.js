const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { getModerationConfig } = require("../../utils/configs/moderationConfig");
const { getUser } = require("../../utils/configs/user");
const { Embed } = require("../../utils/constants/embed");
const Punishment = require('../../structures/schemas/Punishment');
const { randomUUID } = require('crypto');
const { CustomEmbed } = require("../../utils/constants/customEmbed");
const ms = require('ms');
const { tempUnban } = require("../../utils/functions/unban");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Temporarily ban a user.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you wish to tempban.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('duration')
            .setDescription('How long should the user be banned.')
            .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('delete_messages')
                .setDescription('How many of their recent messages to delete.')
                .setRequired(true)
                .addChoices(
                    { name: "Don't delete any", value: 0 },
                    { name: 'Previous hour', value: 3600 },
                    { name: 'Previous 6 hours', value: 21600 },
                    { name: 'Previous 12 hours', value: 43200 },
                    { name: 'Previous 24 hours', value: 86400 },
                    { name: 'Previous 3 days', value: 259200 },
                    { name: 'Previous 7 days', value: 604800 }
                )
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for banning the user.')
            .setRequired(false))
        .addBooleanOption(option => option
            .setName('private')
            .setDescription('Should the message be visible to you only?')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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


        const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
        const duration = interaction.options.getString('duration').slice(0, 800);
        const member = interaction.options.getMember('user');
        const seconds = interaction.options.getInteger('delete_messages');
        if (!member || !reason || !duration || seconds === undefined) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please fill out all the required fields')
            ]
        });

        if (!ms(duration)) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter a valid duration. This could be "1d" for 1 day, "1w" for 1 week or "1hour" for 1 hour.')
            ]
        });


        if (member === interaction.member) return interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('You cannot ban yourself.')
            ]
        });

        if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('You cannot ban a user with roles higher than your own.')
            ]
        });


        const userDatabase = await getUser(interaction.guildId, member.id);
        if (!userDatabase) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('The user has been added to our database. Please run the command again.')
            ]
        });


        let ban = true;
        await member.ban({ reason, deleteMessageSeconds: seconds }).catch(async e => {
            ban = false;

            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Failed to ban the user.`)
                ]
            });
        });

        if (!ban) return;

        userDatabase.tempbans += 1;
        await userDatabase.save();


        const id = randomUUID();

        const NewPunishment = new Punishment({
            guildId: interaction.guildId,
            userId: member.id,

            channelId: interaction.channelId,
            moderatorId: interaction.user.id,
            time: new Date().getTime(),

            type: 'tempban',
            id,
            reason,
            duration,
            active: true
        });
        await NewPunishment.save();


        setTimeout(async () => {
            await tempUnban(client, NewPunishment);
        }, ms(duration));


        interaction.editReply({
            embeds: [
                new Embed(color)
                    .setTitle('User Temporarily Banned')
                    .setDescription(`**User:** ${member} (@${member.user.tag})\n**Reason:** ${reason}`)
                    .addFields(
                        {
                            name: 'Joined Server',
                            value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                            inline: true,
                        },
                        {
                            name: 'Account Created',
                            value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
                            inline: true,
                        }
                    )
                    .setFooter({ text: `ID: ${id}` })
            ]
        });

        if (config.tempbanDM) {
            const parseString = (text) =>
                text
                    .replaceAll('{reason}', reason)
                    .replaceAll('{user}', `${member}`)
                    .replaceAll('{moderator}', interaction.user)
                    .replaceAll('{duration}', duration)
                    .replaceAll('{staff}', interaction.user)
                    .replaceAll('{server}', interaction.guild?.name ?? '')
                    .replaceAll('{color}', color)
                    .replaceAll('{id}', `${id}`)
                    .replaceAll('{joined}', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
                    .replaceAll('{created}', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
                    .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

            await member.send({
                embeds: [
                    new CustomEmbed(config.tempbanDMMessage, parseString)
                ],
                content: parseString(config.tempbanDMMessage.content)
            }).catch(() => { });
        }

        if (config.channel) {
            const channel = interaction.guild.channels.cache.get(config.channelId);
            if (!channel) return;

            await channel.send({
                embeds: [
                    new Embed(color)
                        .setTitle('Member Temporarily Banned')
                        .addFields(
                            { name: 'User', value: `${member} (@${member.user.tag})`, inline: true },
                            { name: 'Banned By', value: `${interaction.user}`, inline: true },
                            { name: 'Banned In', value: `${interaction.channel}`, inline: true },
                            { name: 'User Total Tempbans', value: `${userDatabase.tempbans}`, inline: true },
                            {
                                name: 'Joined Server',
                                value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
                                inline: true,
                            },
                            {
                                name: 'Account Created',
                                value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
                                inline: true,
                            },
                            { name: 'Reason', value: `${reason}`, inline: false },
                        )
                ]
            });
        }
    }
}