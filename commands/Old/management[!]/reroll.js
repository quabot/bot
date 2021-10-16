const discord = require('discord.js');
const config = require('../../files/config.json')
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');

const noPermsAdminUser = new discord.MessageEmbed()
    .setDescription("You do not have administrator permissions!")
    .setColor(colors.COLOR);
const errorEmbed = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR);
const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR);
const noValPrize = new discord.MessageEmbed()
    .setDescription("Please enter either a valid prize or message id!")
    .setColor(colors.COLOR);
const noGivFound = new discord.MessageEmbed()
    .setDescription("I cannot find that giveaway!")
    .setColor(colors.COLOR);
const sucRerolled = new discord.MessageEmbed()
    .setDescription("Giveaway rerolled!")
    .setColor(colors.COLOR);
const notEndedYet = new discord.MessageEmbed()
    .setDescription("That giveaway has not ended yet!")
    .setColor(colors.COLOR);
    const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "reroll",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `reroll` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send({ embeds: [noPermsMsg]});
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send({ embeds: [noPermsAdminUser]});


        if (!args[0]) return message.channel.send({ embeds: [noValPrize]});

        let giveaway =
            client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
            client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) {
            return message.channel.send({ embeds: [noGivFound]});
        }

        client.giveawaysManager.reroll(giveaway.messageID)
            .then(() => {
                message.channel.send({ embeds: [sucRerolled]});
            })
            .catch((e) => {
                const notEndedYetMsgID = new discord.MessageEmbed()
                    .setDescription(`Giveaway with message ID ${giveaway.messageID} has not ended.`)
                    .setColor(colors.COLOR);
                if (e.startsWith(notEndedYetMsgID)) {
                    message.channel.send({ embeds: [notEndedYet]});
                } else {
                    console.error(e);
                    message.channel.send({ embeds: [errorEmbed]});
                }
            });

            const settings = await Guild.findOne({
                guildID: message.guild.id
            }, (err, guild) => {
                if (err) message.channel.send({ embeds: [errorMain]});
                if (!guild) {
                    const newGuild = new Guild({
                        _id: mongoose.Types.ObjectID(),
                        guildID: message.guild.id,
                        guildName: message.guild.name,
                        prefix: config.PREFIX,
                        logChannelID: none,
                        enableLog: false,
                        enableSwearFilter: true,
                        enableMusic: true,
                        enableLevel: true,
                        mutedRoleName: none,
                        mainRoleName: none
                    });
    
                    newGuild.save()
                        .catch(err => message.channel.send({ embeds: [errorMain]}));
    
                    return message.channel.send({ embeds: [addedDatabase]});
                }
            });
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);

            if (settings.enableLog === "false") {
                return;
            }
    
            if (settings.enableLog === "true") {
                if (!logChannel) {
                    return;
                } else {
                    const embed = new discord.MessageEmbed()
                        .setColor(colors.GIVEAWAY_COLOR)
                        .setTitle('Giveaway rerolled')
                        .addField('Giveaway', giveaway)
                    return logChannel.send({ embeds: [embed]});
                };
            }
    }
}