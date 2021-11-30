const discord = require('discord.js');
const colors = require('../../files/colors.json');

const { noOwner, ticketsDisabled } = require('../../files/embeds');

module.exports = {
    name: "add",
    description: "Add a user to your ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "user",
            description: "User to add",
            type: "USER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        const Guild = require('../../schemas/GuildSchema');
        const guildDatabase = await Guild.findOne({
            guildId: interaction.guild.id,
        }, (err, guild) => {
            if (err) console.error(err);
            if (!guild) {
                const newGuild = new Guild({
                    guildId: interaction.guild.id,
                    guildName: interaction.guild.name,
                    logChannelID: "none",
                    reportChannelID: "none",
                    suggestChannelID: "none",
                    welcomeChannelID: "none",
                    levelChannelID: "none",
                    pollChannelID: "none",
                    ticketCategory: "Tickets",
                    closedTicketCategory: "Tickets",
                    logEnabled: true,
                    musicEnabled: true,
                    levelEnabled: true,
                    reportEnabled: true,
                    suggestEnabled: true,
                    ticketEnabled: true,
                    welcomeEnabled: true,
                    pollsEnabled: true,
                    roleEnabled: true,
                    mainRole: "Member",
                    mutedRole: "Muted"
                });
                newGuild.save()
                    .catch(err => {
                        console.log(err);
                        interaction.channel.send({ embeds: [errorMain] });
                    });
                return interaction.channel.send({ embeds: [addedDatabase] });
            }
        });
        if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });


        if (!interaction.channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}` || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ embeds: [noOwner] });
        }

        const user = interaction.options.getUser('user');

        interaction.channel.permissionOverwrites.edit(user, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true
        });

        const embed = new discord.MessageEmbed()
            .setTitle(`:white_check_mark: Adding user...`)
            .setDescription(`Adding ${user} to your support ticket!`)
            .setTimestamp()
            .setColor(colors.COLOR)
        interaction.reply({ embeds: [embed] });

    }
}