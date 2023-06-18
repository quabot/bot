const { Client, ButtonInteraction, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors } = require("discord.js");
const { CustomEmbed } = require("../../../utils/constants/customEmbed");
const { Embed } = require("../../../utils/constants/embed");
const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswer');
const Application = require('../../../structures/schemas/Application');
const { getSuggestConfig } = require('../../../utils/configs/suggestConfig')

module.exports = {
    name: 'application-accept',
    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.message.embeds[0].footer.text;
        const answer = await ApplicationAnswer.findOne({
            guildId: interaction.guildId,
            response_uuid: id
        });
        if (!answer) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find the application answer.')
            ]
        });

        if (answer.state !== 'pending') return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('The application has already been approved/denied.')
            ]
        });

        const form = await Application.findOne({
            guildId: interaction.guildId,
            id: answer.id,
        });
        if (!form) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find the application.')
            ]
        });

        let allowed = true;
        if (form.submissions_managers.length !== 0) {
            allowed = false;
            form.submissions_managers.forEach((manager) => {
                if (interaction.member._roles.includes(manager)) allowed = true;
            });
        }
        if (!allowed) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('You don\'t have the required roles to approve this application.')
            ]
        });

        answer.state = 'approved';
        await answer.save();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`Successfully approved the application.`)
            ]
        });

        const member = interaction.guild.members.cache.get(answer.userId);
        if (form.add_roles) {
            form.add_roles.forEach(async (role) => {
                const roleToAdd = interaction.guild.roles.cache.get(role);
                if (roleToAdd) member.roles.add(roleToAdd);
            });
        }

        if (form.remove_roles) {
            form.remove_roles.forEach(async (role) => {
                const roleToAdd = interaction.guild.roles.cache.get(role);
                if (roleToAdd) member.roles.remove(roleToAdd);
            });
        }

        await interaction.message.edit({
            components: []
        });
    },
};