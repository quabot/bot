const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild');
const config = require('../../files/config.json');

const noUser = new discord.MessageEmbed()
    .setDescription("Please mention a user to mute!")
    .setColor(colors.COLOR);
const noPermsManageRoles = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage roles!")
    .setColor(colors.COLOR);
const noPermsBanUser = new discord.MessageEmbed()
    .setDescription("You do not have permission to mute members!")
    .setColor(colors.COLOR);
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)

module.exports = {
    name: "unmute",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `unmute` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send(noPermsManageRoles);
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(noPermsBanUser);

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

        let mutedRoleName = settings.mutedRoleName;
        let mainRoleName = settings.mainRoleName;

        const target = message.mentions.users.first();

        if(!args[0]) return message.channel.send(noUser);
        if(!target) return message.channel.send(noUser);

        let mainRole = message.guild.roles.cache.find(role => role.name === `${mainRoleName}`);
        let muteRole = message.guild.roles.cache.find(role => role.name === `${mutedRoleName}`);

        let memberTarget = message.guild.members.cache.get(target.id);

        memberTarget.roles.add(mainRole.id);
        memberTarget.roles.remove(muteRole.id);
        const mutedUser = new discord.MessageEmbed()
            .setDescription(`<@${memberTarget.user.id}> has been unmuted`)
            .setColor(colors.COLOR);
        message.channel.send(mutedUser);

        if (settings.enableLog === "true") {
            const logChannel = message.guild.channels.cache.get(settings.logChannelID);
            if (!logChannel) return;
            const embed = new discord.MessageEmbed()
                .setColor(colors.UNMUTE_COLOR)
                .setTitle('User Unmuted')
                .addField('Username', target)
                .addField('User ID', target.id)
                .addField('Unmuted by', message.author)
            logChannel.send(embed);
        } else {
            return;
        }
    }
}