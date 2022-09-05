const { Client, EmbedBuilder, Colors, GuildBan, GuildMember } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "guildMemberUpdate",
    name: "nickChange",
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     */
    async execute(oldMember, newMember, client, color) {

        if (!oldMember.guild) return;

        const logConfig = await getLogConfig(client, oldMember.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(oldMember.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.name)) return;
        if (oldMember.nickname === newMember.nickname) return;
        if (oldMember._roles.length !== newMember._roles.length) return;
        if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
        if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
        if (oldMember.avatar !== newMember.avatar) return;

        let oldNick = oldMember.nickname ? oldMember.nickname : "No nickname";
        let newNick = newMember.nickname ? newMember.nickname : "No nickname";

        const embed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setDescription(`**Nickname Changed**\n\`${oldNick}\` -> \`${newNick}\``)
            .setTimestamp();

        if (newMember.user.avatar) embed.setFooter({ text: `User: ${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL({ dynamic: true })}` });

        logChannel.send({
            embeds: [embed]
        }).catch((err => { }));
    }
}