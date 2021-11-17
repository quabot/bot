const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const Guild = require('../../models/guild');

const { closeTicket } = require('../../files/interactions');

const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');

module.exports = {
    name: "ticket",
    description: "This command allows you to make a support ticket.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "topic",
            description: "Your topic on what your ticket is about.",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

        const settings = await Guild.findOne({
            guildID: interaction.guild.id
        }, (err, guild) => {
            if (err) interaction.reply({ embeds: [errorMain] });
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    logChannelID: none,
                    enableLog: true,
                    enableSwearFilter: false,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: "Muted",
                    mainRoleName: "Member",
                    reportEnabled: true,
                    reportChannelID: none,
                    suggestEnabled: true,
                    suggestChannelID: none,
                    ticketEnabled: true,
                    ticketChannelName: "Tickets",
                    closedTicketCategoryName: "Closed Tickets",
                    welcomeEnabled: true,
                    welcomeChannelID: none,
                    enableNSFWContent: false,
                });

                newGuild.save()
                    .catch(err => interaction.reply({ embeds: [errorMain] }));

                return interaction.reply({ embeds: [addedDatabase] });
            }
        });
        if (settings.ticketEnabled === "false") return interaction.reply({ embeds: [ticketsDisabled] });

        let ticketsCatName = settings.ticketChannelName;
        let CticketsCatName = settings.closedTicketCategoryName;

        const topic = interaction.options.getString('topic');

        if (ticketsCatName === "undefined") {
            let ticketsCatName = "Tickets";
        }

        if (CticketsCatName === "undefined") {
            let CticketsCatName = "Closed Tickets";
        }

        let category = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);
        let closedCategory = interaction.guild.channels.cache.find(cat => cat.name === CticketsCatName);
        if (category === undefined) {
            const embedTicketsCreate = new discord.MessageEmbed()
                .setColor(colors.TICKET_CREATED)
                .setTitle("Creating a category!")
                .setDescription("The tickets categegory does not exist. Creating one now...")
                .setTimestamp()
            interaction.reply({ embeds: [embedTicketsCreate] });
            interaction.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
            if (closedCategory === undefined) {
                const embedCTicketsCreate = new discord.MessageEmbed()
                    .setColor(colors.TICKET_CREATED)
                    .setTitle("Creating a category!")
                    .setDescription("The categegory for closed tickets does not exist. Creating one now...")
                    .setTimestamp()
                interaction.followUp({ embeds: [embedCTicketsCreate] });
                interaction.guild.channels.create(CticketsCatName, { type: "GUILD_CATEGORY" });
            }
            const succesCreate = new discord.MessageEmbed()
                    .setColor(colors.TICKET_CREATED)
                    .setTitle("Created category!")
                    .setDescription("Succesfully created the required category(ies), run the command again.")
                    .setTimestamp()
            return interaction.followUp({ embeds: [succesCreate] });
        }
        if (closedCategory === undefined) {
            const succesCreate = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle("Created category!")
                    .setDescription("Succesfully created the required category(ies), run the command again.")
                    .setTimestamp()
            const embedCTicketsCreate = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setTitle("Creating category!")
                    .setDescription("The categegory for closed tickets does not exist. Creating one now...")
                    .setTimestamp()
            interaction.reply({ embeds: [embedCTicketsCreate] });
            interaction.guild.channels.create(CticketsCatName, { type: "GUILD_CATEGORY" });
            return interaction.channel.send({ embeds: [succesCreate] });
        }

        let ticketChannel = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`);

        if (ticketChannel === undefined) {

            interaction.guild.channels.create(`${interaction.user.username}-${interaction.user.discriminator}`, { parent: category, topic: `Creator: ${interaction.user.username}#${interaction.user.discriminator} - Topic: ${topic}` }).then(ch => {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.TICKET_CREATED)
                    .setTitle("Created your ticket :white_check_mark:")
                    .setDescription("You can find it here: <#" + ch + ">")
                    .addField("Topic", `${topic}`)
                    .setTimestamp()
                    interaction.reply({ embeds: [embed] })
            });

            setTimeout(() => {
                let ticketChannel2 = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`);
                ticketChannel2.permissionOverwrites.edit(interaction.user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                });
                const createdSucces = new discord.MessageEmbed()
                    .setColor(colors.TICKET_CREATED)
                    .setTitle("Ticket Created!")
                    .setDescription(`Welcome to your ticket, ${interaction.user}!\nPlease wait here, staff will be with you shortly.`)
                    .addField(`Creator`, `${interaction.user}`)
                    .addField(`Topic`, `${topic}`)
                    .setTimestamp()
                    .setFooter(`Made a mistake? Close this ticket using the buttons below this message.`)
                ticketChannel2.send({ embeds: [createdSucces], components: [closeTicket] });
                ticketChannel2.send(`${interaction.user}`).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 200);
                });
            }, 1000);

        } else {
            interaction.reply("You already have a ticket! You can find it here: <#" + ticketChannel + ">! If this ticket is closed, reopen it using /reopen <#" + ticketChannel + ">, or by clicking the button.");
            return
        }
    }
}