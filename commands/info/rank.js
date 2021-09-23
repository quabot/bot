const discord = require('discord.js');
const colors = require('../../files/colors.json');
const Guild = require('../../models/guild')
const Levels = require('discord.js-leveling');

const { errorMain, LBNoXP, LBDisabled, addedDatabase } = require('../../files/embeds');


module.exports = {
    name: "rank",
    aliases: ["level"],
    async execute(client, message, args) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        
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
                    enableLevel: true
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain]}));

                return message.channel.send({ embeds: [addedDatabase]});
            }
        });
        if (settings.enableLevel === "false") return message.channel.send({ embeds: [LBDisabled]});
        const target = message.mentions.users.first() || message.author;
        const user = await Levels.fetch(target.id, message.guild.id);
        if (!user) return message.channel.send({ embeds: [LBNoXP]});

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`${target.tag}'s rank:`)
            .addField("Level", `${user.level}`)
            .addField("XP", `${user.xp}`)
        message.channel.send({ embeds: [embed]});

    }
}