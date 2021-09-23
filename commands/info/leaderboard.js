const discord = require('discord.js');
const Levels = require('discord.js-leveling');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');
const { LBNoXP, LBDisabled, addedDatabase, errorMain } = require('../../files/embeds');

module.exports = {
    name: "leaderboard",
    aliases: ["top", "leveltop", "lb"],
    async execute(client, message, args) {        
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return message.delete({ timeout: 5000 });
        
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
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send({ embeds: [errorMain]}));

                return message.channel.send({ embeds: [addedDatabase]});
            }
        });
        if (settings.enableLevel === "false") return message.channel.send({ embeds: [LBDisabled]});

        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
        if (rawLeaderboard.length < 1) return reply({ embeds: [LBNoXP]});
        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true); // We process the leaderboard.
        const lb = leaderboard.map(e => `${e.position}. **${e.username}#${e.discriminator}** | Level: \`${e.level}\` | \`XP: ${e.xp.toLocaleString()}\``); // We map the outputs.

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle("Leaderboard")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(`\n${lb.join("\n\n")}`)
        message.channel.send({ embeds: [embed]});
    }
}