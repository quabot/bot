const discord = require('discord.js');
const mongoose = require('mongoose');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription(":x: You do not have administrator permissions.")
    .setColor(colors.COLOR)
const noPermsMsg = new discord.MessageEmbed()
    .setDescription(":x: I do not have permission to manage messages!")
    .setColor(colors.COLOR)
const noAmountMsg = new discord.MessageEmbed()
    .setDescription(":question: Please enter an amount of messages to be cleared!")
    .setColor(colors.COLOR)
const msg200Max = new discord.MessageEmbed()
    .setDescription(":1234: Please enter a number between 0-200!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription(":x: I cannot delete messages older than 14 days!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription(":white_check_mark: This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "clear",
    description: "By using this command you will be able to clear an amount of messages.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "amount",
            description: "The amount of messages to clear.",
            type: "INTEGER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        let amount = interaction.options.getInteger('amount');
        console.log(amount)
        if (!amount) return interaction.reply({ embeds: [noAmountMsg] });
        if (amount <= 0) amount = 1;
        if (amount >= 201) amount = 200;

        interaction.channel.bulkDelete(amount).catch(err => interaction.channel.send({ embeds: [errorMain] })).then(msg => { setTimeout(() => msg.delete(), 6000) });
        const clearedAmount = new discord.MessageEmbed()
            .setDescription(`:white_check_mark: Succesfully cleared **${amount}** messages!`)
            .setColor(colors.COLOR)
            interaction.reply({ embeds: [clearedAmount] });

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
                    .catch(err => interaction.followUp({ embeds: [errorMain] }));
        
                return interaction.followUp({ embeds: [addedDatabase] });
            }
        });

        if (settings.enableLog === "true") {
            const logChannel = interaction.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;
            const embed = new discord.MessageEmbed()
                .setColor(colors.CLEAR_COLOR)
                .setTitle('Messages Cleared')
                .addField('Channel', `${interaction.channel}`)
                .addField('Amount', `${amount}`)
            logChannel.send({ embeds: [embed] });
        } else {
            return;
        }
    }
}