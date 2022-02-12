const { MessageEmbed } = require('discord.js')

const { COLOR_MAIN } = require('../../files/colors.json')
const { error, added } = require('../../embeds/general');
const { ticketDis, notATicket } = require('../../embeds/support');

const { close } = require('../../interactions/tickets');

module.exports = {
    name: "reopen",
    description: "Reopen a closed ticket.",
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
                        transcriptChannelID: "none"
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });

            if (guildDatabase.ticketEnabled === "false") return interaction.reply({ embeds: [ticketDis] }).catch(err => console.log("Error!"));

            let cId = interaction.channel.name;
            cId = cId.substring(7);

            const Ticket = require('../../schemas/TicketSchema')
            const TicketDB = await Ticket.findOne({
                guildId: interaction.guild.id,
                ticketId: cId,
                channelId: interaction.channel.id,
            }, (err, ticket) => {
                if (err) return;
                if (!ticket) return interaction.channel.send({ embeds: [notATicket] }).catch(err => console.log("err"))
            }).clone().catch(function (err) { console.log(err) })

            if (TicketDB === null) return;

            let openedName = guildDatabase.ticketCategory;
            if (openedName === undefined) openedName = 'Tickets';
            const category = interaction.guild.channels.cache.find(cat => cat.name === openedName);

            if (!category) {
                interaction.guild.channels.create(openedName, { type: "GUILD_CATEGORY" }).catch(err => console.log("Error!"));
                const embedTicketsCreate = new MessageEmbed()
                    .setColor(COLOR_MAIN)
                    .setTitle('Creating a category!')
                    .setDescription('The categegory for opened tickets does not exist. Creating one now...')
                    .setTimestamp()
                interaction.reply({ embeds: [embedTicketsCreate] }).catch(err => console.log("Error!"));
                return
            }

            interaction.channel.setParent(category).catch(err => console.log("Error!"));
            interaction.channel.setParent(category).catch(err => console.log("Error!"));
            let userFound = interaction.guild.members.cache.get(`${TicketDB.memberId}`);
            setTimeout(() => {
                interaction.channel.permissionOverwrites.edit(userFound, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                }).catch(err => console.log("Error!"));
            }, 1000);


            const embed = new MessageEmbed()
                .setTitle("Re-Opened Ticket!")
                .setDescription("Close it with the button below this message.")
                .setTimestamp()
                .setColor(COLOR_MAIN);
            interaction.reply({ embeds: [embed], components: [close] }).catch(err => console.log("Error!"));

            await TicketDB.updateOne({
                closed: false,
            });
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}