const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

const { noAmount } = require('../../embeds/management');

module.exports = {
    name: "clear",
    description: "Clear a number of messages.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "amount",
            description: "Amount of messages",
            type: "INTEGER",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
            let amount = interaction.options.getInteger('amount');
            if (!amount) return interaction.reply({ embeds: [noAmount] }).catch(err => console.log("Error!"));
            if (amount <= 0) amount = 1;
            if (amount >= 201) amount = 200;

            interaction.channel.bulkDelete(amount).catch(err => { return interaction.channel.send({ ephemeral: true, content: "I cannot delete messages older then 14 days." }).catch(err => console.log("Error!")); });
            const clearedAmount = new MessageEmbed()
                .setDescription(`:white_check_mark: Succesfully cleared **${amount}** messages!`)
                .setColor(COLOR_MAIN)
            interaction.reply({ embeds: [clearedAmount] }).catch(err => console.log("Error!"));

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
                        transcriptChannelID: "none",
                        prefix: "!",
                    });
                    newGuild.save()
                        .catch(err => {
                            console.log(err);
                            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
                        });
                    return interaction.channel.send({ embeds: [added] }).catch(err => console.log("Error!"));
                }
            }).clone().catch(function (err) { console.log(err) });
            if (!guildDatabase) return;

            if (guildDatabase.logEnabled === "true") {
                const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);
                if (!logChannel) return;
                const embed = new MessageEmbed()
                    .setColor(`ORANGE`)
                    .setTitle('Messages Cleared')
                    .addField('Channel', `${interaction.channel}`)
                    .addField('Amount', `${amount}`)
                    .addField("User", `${interaction.user}`)
                logChannel.send({ embeds: [embed] }).catch(err => console.log("Error!"));
            } else {
                return;
            }
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: clear`)] }).catch(err => console.log("Error!"));
            return;
        }
    }
}