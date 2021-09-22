const discord = require('discord.js');

const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const User = require('../../models/guild');

const noPermsKickBot = new discord.MessageEmbed()
    .setDescription("I do not have permission to kick members!")
    .setColor(colors.COLOR)
const noPermsKickUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to kick members!")
    .setColor(colors.COLOR)
const noUsertoKick = new discord.MessageEmbed()
    .setDescription("Please mention a user you want to kick!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "kick",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `kick` was used.");
        const member = message.mentions.members.first();
        let reason = "No reason specified.";

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("KICK_MEMBERS")) return message.channel.send(noPermsKickBot);
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(noPermsKickUser);

        if (!member) return message.channel.send(noUsertoKick);
        if (args.length > 1) reason = args.slice(1).join(' ');

        const userBanned = new discord.MessageEmbed()
            .setTitle("User Banned")
            .setDescription(`${member} was kicked.\n**Reason:** ${reason}`)
            .setColor(colors.KICK_COLOR)

        member.kick(reason);
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
                    kickCount: 1,
                    banCount: 0
                });
                
                await newUser.save()
                    .catch(err => message.channel.send(errorMain));
            } else {
                User.updateOne({
                    kickCount: User.kickCount + 1
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
                    logChannelID: none,
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
                .setColor(colors.KICK_COLOR)
                .setTitle('User Kicked')
                .addField('Username', member.user.username)
                .addField('User ID', member.id)
                .addField('Kicked by', message.author)
                .addField('Reason', reason);
            logChannel.send(embed);
        } else {
            return;
        }

    }
}