const discord = require('discord.js');

const colors = require('../../files/colors.json');
const config = require('../../files/config.json');
const Guild = require('../../models/guild');

const { errorMain, addedDatabase, ticketsDisabled } = require('../../files/embeds');




// topics, closed category








module.exports = {
    name: "ticket",
    description: "This command allows you to make a support ticket. (If enabled by the guild)",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
     options: [
        {
            name: "topic",
            description: "Your topic on what your ticket is about.",
            type: "STRING",
            required: false,
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

        const topic = interaction.options.getString('topic');

        if (ticketsCatName === "undefined") {
            let ticketsCatName = "Tickets";
        }

        let category = interaction.guild.channels.cache.find(cat => cat.name === ticketsCatName);
        if (category === undefined) {
            interaction.reply("That category does not exist, creating one now...");
            interaction.guild.channels.create(ticketsCatName, { type: "GUILD_CATEGORY" });
            return interaction.followUp(":white_check_mark: Succes! Please run the command again to create your ticket.")
        }

        let ticketChannel = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`);

        if (ticketChannel === undefined) {
            interaction.reply("Creating your ticket now...");
            interaction.guild.channels.create(`${interaction.user.username}-${interaction.user.discriminator}`, { parent: category });
            interaction.channel.send(`:white_check_mark: Succesfully created your ticket!`);
            setTimeout(() => {
                let ticketChannel2 = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`);
                ticketChannel2.permissionOverwrites.edit(interaction.user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true
                });
                ticketChannel2.send(`Hello <@${interaction.user.id}>! please wait here, staff will be with you shortly.`);
            }, 1000);
        } else {
            interaction.reply("You already have a ticket! You can find it here: <#" + ticketChannel + ">");
            ticketChannel.send("<@" + interaction.user.id + ">, here is your ticket!").then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);;
            })
            return
        }
    }
}