const discord = require('discord.js');
const ms = require('ms');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const noValidChannel = new discord.MessageEmbed()
    .setDescription("Please enter a valid channel for the giveaway to be hosted in!")
    .setColor(colors.COLOR)
const noTime = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Please enter a time for the giveaway to last!")
const { errorMain, addedDatabase } = require('../../files/embeds');
const noWinners = new discord.MessageEmbed()
    .setDescription("Please enter an amount of winners!")
    .setColor(colors.COLOR)
const noPrize = new discord.MessageEmbed()
    .setTitle(":x: Please enter a prize to win!")
    .setColor(colors.COLOR)

module.exports = {
    name: "giveaway",
    description: "Host a giveaway.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "channel",
            description: "Channel for the giveaway",
            type: "CHANNEL",
            required: true,
        },
        {
            name: "duration",
            description: "Giveaway's duration",
            type: "STRING",
            required: true,
        },
        {
            name: "winners",
            description: "Amount of winners",
            type: "INTEGER",
            required: true,
        },
        {
            name: "prize",
            description: "Giveaway prize",
            type: "STRING",
            required: true,
        },
    ],
    async execute(client, interaction) {

        try {
            let giveawayChannel = interaction.options.getChannel('channel');
            if (!giveawayChannel) {
                return interaction.reply({ embeds: [noValidChannel] });
            }

            if (giveawayChannel.type !== "GUILD_TEXT") {
                return interaction.reply({ embeds: [noValidChannel] });
            }

            let giveawayDuration = interaction.options.getString('duration');
            if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
                return interaction.reply({ embeds: [noTime] });
            }

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
            const logChannel = interaction.guild.channels.cache.get(guildDatabase.logChannelID);

            let giveawayNumberWinners = interaction.options.getInteger('winners');
            if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
                return interaction.reply({ embeds: [noWinners] });
            }

            let giveawayPrize = interaction.options.getString('prize');
            if (!giveawayPrize) {
                return interaction.reply({ embeds: [noPrize] });
            }

            const duration = interaction.options.getString('duration');
            const winnerCount = interaction.options.getInteger('winners');
            const prize = interaction.options.getString('prize');

            client.giveawaysManager.start(giveawayChannel, {
                duration: ms(duration),
                winnerCount,
                prize,
                messages: {
                    giveaway: ":tada: **GIVEAWAY** :tada:",
                    giveawayEnded: ":tada: **GIVEAWAY ENDED** :tada:",
                    winMessage: "Congrats  {winners}! You won **{this.prize}**!",
                    drawing: "Ending: {timestamp}",
                    noWinner: "There was no winner! Not enough people responded.",
                }
            });

            interaction.reply(`The giveaway for \`${giveawayPrize}\` is starting in ${giveawayChannel}.`);

            if (guildDatabase.logEnabled === "false") {
                return;
            }

            if (guildDatabase.logEnabled === "true") {
                if (!logChannel) {
                    return;
                } else {
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.GIVEAWAY_COLOR)
                        .setTitle('Giveaway started')
                        .addField('Channel', `${giveawayChannel}`)
                        .addField('Prize', `${giveawayPrize}`)
                        .addField('Duration', `${giveawayDuration}`)
                        .addField('Winners', `${giveawayNumberWinners}`)
                    return logChannel.send({ embeds: [embed] });
                };
            }

        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
