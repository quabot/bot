const discord = require('discord.js');
const ms = require('ms');
const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions!")
    .setColor(colors.COLOR)
const errorEmbed = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const noValidChannel = new discord.MessageEmbed()
    .setDescription("Please enter a valid channel for the giveaway to be hosted in!")
    .setColor(colors.COLOR)
const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR)
const noTime = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Please enter a time for the giveaway to last!")
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noWinners = new discord.MessageEmbed()
    .setDescription("Please enter an amount of winners!")
    .setColor(colors.COLOR)
const noPrize = new discord.MessageEmbed()
    .setDescription("Please enter a prize to win!")
    .setColor(colors.COLOR)

module.exports = {
    name: "giveaway",
    description: "Create a server giveaway.",
    permission: "ADMINISTRATOR",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    options: [
        {
            name: "channel",
            description: "The channel id where the giveaway should be held.",
            type: "CHANNEL",
            required: true,
        },
        {
            name: "duration",
            description: "The duration for the giveaway to last.",
            type: "STRING",
            required: true,
        },
        {
            name: "winners",
            description: "The amount of winners for the giveaway.",
            type: "INTEGER",
            required: true,
        },
        {
            name: "prize",
            description: "The prize for the giveaway.",
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

            let giveawayDuration = interaction.options.getString('duration');
            if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
                return interaction.reply({ embeds: [noTime] });
            }

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

            let giveawayNumberWinners = interaction.options.getInteger('winners');
            if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
                return interaction.reply({ embeds: no[noWinners] });
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

            interaction.reply(`The giveaway for the \`${giveawayPrize}\` is starting in ${giveawayChannel}.`);

            if (settings.enableLog === "false") {
                return;
            }

            if (settings.enableLog === "true") {
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
