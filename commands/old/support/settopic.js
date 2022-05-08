const { MessageEmbed } = require('discord.js')

const { COLOR_MAIN } = require('../../files/colors.json')
const { error, added } = require('../../embeds/general');
const { ticketDis, notATicket } = require('../../embeds/support');

module.exports = {
    name: "settopic",
    description: "Change a ticket topic.",
    options: [
        {
            name: "new-topic",
            type: "STRING",
            description: "The new ticket topic.",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
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
                        pollID: 0,
                        pollChannelID: "none",
                        ticketCategory: "Tickets",
                        closedTicketCategory: "Tickets",
                        logEnabled: true,
                        musicEnabled: true,
                        levelEnabled: false,
                        reportEnabled: true,
                        suggestEnabled: true,
                        ticketEnabled: true,
                        welcomeEnabled: true,
                        pollsEnabled: true,
                        roleEnabled: true,
                        mainRole: "Member",
                        mutedRole: "Muted",
                        joinMessage: "Welcome {user} to **{guild-name}**!",
                        leaveMessage: "Goodbye {user}!",
                        swearEnabled: false,
                        levelCard: false,
                        levelEmbed: true,
                        levelMessage: "{user} just leveled up to level **{level}**!",
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log(err));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log(err));

            let cId = interaction.channel.name;
            cId = cId.substring(7);

            const Ticket = require('../../schemas/TicketSchema')
            const TicketDB = await Ticket.findOne({
                guildId: interaction.guild.id,
                ticketId: cId,
                channelId: interaction.channel.id,
            }, (err, ticket) => {
                if (err) return;
                if (!ticket) return interaction.channel.send({ embeds: [notATicket] }).catch(err => console.log(err));
            }).clone().catch(function (err) { console.log(err) });

            if (TicketDB === null) return;

            await TicketDB.updateOne({
                topic: `${interaction.options.getString("new-topic")}`,
            });

            const newTopic = new MessageEmbed()
                .setTitle("Topic changed")
                .setColor(COLOR_MAIN)
                
                .setDescription(`New ticket topic: **${interaction.options.getString("new-topic")}**!`)
            interaction.reply({ embeds: [newTopic] }).catch(err => console.log(err));
            
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}