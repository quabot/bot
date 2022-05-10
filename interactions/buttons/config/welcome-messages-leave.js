const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    id: "welcome_messages_leave",
    async execute(interaction, client, color) {

        const Guild = require('../../../structures/schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    punishmentChannelID: "none",
                    pollID: 0,
                    logEnabled: true,
                    levelEnabled: false,
                    welcomeEmbed: true,
                    pollEnabled: true,
                    suggestEnabled: true,
                    welcomeEnabled: true,
                    leaveEnabled: true,
                    roleEnabled: false,
                    mainRole: "Member",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    leaveMessage: "Goodbye {user}!",
                    swearEnabled: false,
                    levelCard: false,
                    levelEmbed: true,
                    levelMessage: "{user} just leveled up to level **{level}**!",
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [new MessageEmbed().setDescription("There was an error with the database.").setColor(color)] }).catch(err => console.log(err));
                    });
            }
        }).clone().catch(function (err) { console.log(err) });

        if (!guildDatabase) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(color)
                    .setDescription(`Added this server to the database, please run that command again.`)
            ]
        }).catch((err => { }));

        const msg = await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Click** the button below this message to enter the new leave message.\n**Valid Variables:**\n{guild} - Server's name.\n{user} - Mention's the user.\n{username} - User's username.\n{discriminator} - User's discriminator.\n{members} - Server's membercount.`)
                    .setColor(color)
            ], ephemeral: true, fetchReply: true, components: [
                new MessageActionRow({
                    components: [
                        new MessageButton({
                            style: 'PRIMARY',
                            label: 'Enter',
                            customId: "welcome_messages_leave_modal"
                        }),
                    ]
                })
            ]
        });

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === interaction.user.id });

        collector.on('collect', async interaction => {
            if (interaction.customId === "welcome_messages_leave_modal") {

                const setLeave = new Modal()
                    .setCustomId('welcome-message-leave')
                    .setTitle('Set the new leave message')
                    .addComponents(
                        new TextInputComponent()
                            .setCustomId('message')
                            .setLabel('Enter your leave message')
                            .setStyle('LONG')
                            .setMinLength(1)
                            .setMaxLength(400)
                            .setPlaceholder('Valid Variables:\n{guild} - {user} - {username} - {discriminator} - {members}')
                            .setRequired(true)
                    );

                showModal(setLeave, {
                    client: client,
                    interaction: interaction
                });

            }
        });
    }
}