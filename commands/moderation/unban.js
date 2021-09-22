const discord = require('discord.js');

const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const colors = require('../../files/colors.json');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noPermsBanBot = new discord.MessageEmbed()
    .setDescription("I do not have permission to ban members!")
    .setColor(colors.COLOR);
const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to ban members!")
    .setColor(colors.COLOR);
const noMember = new discord.MessageEmbed()
    .setDescription("You have to enter a user id to unban!")
    .setColor(colors.COLOR);
const noUserFound = new discord.MessageEmbed()
    .setDescription("Could not find that user!")
    .setColor(colors.COLOR);

module.exports = {
    name: "unban",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `unban` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanBot);
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanUser);

        const member = args[0];
        const memberid = args[0];
        const sender = message.author;

        if (!member) return message.channel.send(noMember);

        let userID = args[0]
        message.guild.fetchBans().then(bans => {
            if (bans.size == 0) return
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return message.channel.send(noUserFound)
            message.guild.members.unban(bUser.user)
            const unbannedUser = new discord.MessageEmbed()
                .setDescription(`Succesfully unbanned ${args[0]}.`)
                .setColor(colors.COLOR);
            message.channel.send(unbannedUser);
        })

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
        const logChannel = message.guild.channels.cache.get(settings.logChannelID);

        const user = message.mentions.users.first();
        if (settings.enableLog === "true") {
            if (!logChannel) {
                return;
            } else {
                const embed = new discord.MessageEmbed()
                    .setColor(colors.UNBAN_COLOR)
                    .setTitle('User Unban')
                    .addField('Username', user)
                    .addField('User ID', memberid)
                    .addField('Unbanned by', message.author)
                return logChannel.send(embed);
            };
        }
    }
}
