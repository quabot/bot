const discord = require('discord.js');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const User = require('../../models/guild');

const noPermsBanBot = new discord.MessageEmbed()
    .setDescription("I do not have permission to ban members!")
    .setColor(colors.COLOR);
const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to ban members!")
    .setColor(colors.COLOR);
const noUserToBan = new discord.MessageEmbed()
    .setDescription("Please mention a user you want to ban!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const notBannable = new discord.MessageEmbed()
    .setDescription("You cannot ban this user!")
    .setColor(colors.COLOR)

module.exports = {
    name: "ban",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `ban` was used.");
        const member = message.mentions.members.first();
        let reason = "No reason specified.";

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanBot);
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanUser);

        if (!member) return message.channel.send(noUserToBan);
        if (args.length > 1) reason = args.slice(1).join(' ');
;
        const userBanned = new discord.MessageEmbed()
            .setTitle("User Banned")
            .setDescription(`${member} was banned.\n**Reason:** ${reason}`)
            .setColor(colors.COLOR)

        member.ban({ reason: reason });
        message.channel.send(userBanned);
        
        User.findOne({
            guildID: message.guild.id,
            userID: member.id,
        }, async (err, user) => {
            if(err) message.channel.send(errorMain);
            if(!User) {
                const newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    userID: member.id,
                    muteCount: 0,
                    warnCount: 0,
                    kickCount: 0,
                    banCount: 1
                });
                
                await newUser.save()
                    .catch(err => message.channel.send(errorMain));
            } else {
                User.updateOne({
                    banCount: User.banCount + 1
                })
                    .catch(err => message.channel.send(errorMain));
            };
        });

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send(errorMain);
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: "none",
                    enableLog: false,
                    enableSwearFilter: true,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send(errorMain));

                return message.channel.send(addedDatabase);
            }
        });

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;

            const embed = new discord.MessageEmbed()
                .setColor(colors.BAN_COLOR)
                .setTitle('User Banned')
                .addField('Username', member.user.username)
                .addField('User ID', member.id)
                .addField('Banned by', message.author)
                .addField('Reason', reason);
            logChannel.send(embed);
        } else {
            return;
        }

    }
}