const discord = require('discord.js');
const mongoose = require('mongoose');

const config = require('../../../files/config.json')
const Guild = require('../../../models/guild');
const colors = require('../../../files/colors.json');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions.")
    .setColor(colors.COLOR)
const errorEmbed = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const msgIDorPize = new discord.MessageEmbed()
    .setDescription("Please enter the message ID or prize!")
    .setColor(colors.COLOR)
    const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

    module.exports = {
        name: "end",
        description: "When you use thins command correctly you will force-end a running giveaway.",
        permission: "ADMINISTRATOR",
        /**
         * @param {Client} client 
         * @param {CommandInteraction} interaction
         */
        options: [
            {
                name: "giveawayid",
                description: "The message id of the giveaway to cancel. (or the prize)",
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
                        logChannelID: "none",
                        enableLog: true,
                        enableSwearFilter: false,
                        enableMusic: true,
                        enableLevel: true,
                        mutedRoleName: "Muted",
                        mainRoleName: "Member",
                        reportEnabled: true,
                        reportChannelID: "none",
                        suggestEnabled: true,
                        suggestChannelID: "none",
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
        const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);

        const id = interaction.options.getString('giveawayid');
        if (!id) {
            return interaction.reply({ embeds: [msgIDorPize]});
        }

        let giveaway =
            client.giveawaysManager.giveaways.find((g) => g.prize === id) ||
            client.giveawaysManager.giveaways.find((g) => g.messageID === id);

        if (!giveaway) {
            const cantFind = new discord.MessageEmbed()
                .setDescription(`I cannot find giveaway: **${id}**`)
                .setColor(colors.COLOR)
            return interaction.reply({ embeds: [cantFind]});
        }
        client.giveawaysManager.edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
        })
            .then(() => {
                const alreadyEnded1 = new discord.MessageEmbed()
                        .setDescription(`Giveaway will end in less than **${client.giveawaysManager.options.updateCountdownEvery / 1000}** seconds.`)
                        .setColor(colors.COLOR)
                    interaction.reply({ embeds: [alreadyEnded1]});
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} has already ended.`)) {

                    const alreadyEnded = new discord.MessageEmbed()
                        .setTitle(":x: Ended already!")
                        .setDescription(`This giveaway has ended already.`)
                        .setColor(colors.COLOR)
                    interaction.reply({ embeds: [alreadyEnded]});

                } else {
                    console.error(e);
                    interaction.followUp({ embeds: [errorEmbed]});
                }
            });

        if (settings.enableLog === "false") {
            return;
        }

        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(colors.END_COLOR)
                    .setTitle('Giveaway Force Ended')
                    .addField('Giveaway', `${id}`)
                return logChannel.send({ embeds: [embed]});
            };
        }
    }
}