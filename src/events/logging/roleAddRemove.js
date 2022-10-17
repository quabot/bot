const { Client, EmbedBuilder, Colors, GuildBan, GuildMember } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: 'guildMemberUpdate',
    name: 'roleAddRemove',
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

        if (oldMember.nickname !== newMember.nickname) return;
        if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
        if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
        if (oldMember.avatar !== newMember.avatar) return;

        let word;
        if (oldMember._roles.length > newMember._roles.length) word = 'Removed';
        if (oldMember._roles.length < newMember._roles.length) word = 'Given';

        let role;
        if (oldMember._roles < newMember._roles)
            role = `<@&${newMember._roles.filter(n => !oldMember._roles.includes(n)).join('>\n<@&')}>`;
        if (oldMember._roles > newMember._roles)
            role = `<@&${oldMember._roles.filter(n => !newMember._roles.includes(n)).join('>\n<@&')}>`;

        if (role === '<@&>') return;

        const embed = new EmbedBuilder()
            .setDescription(`**Roles ${word}**\n${role}`)
            .setColor(Colors.Yellow)
            .setTimestamp();

        embed.setFooter({
            text: `User: ${newMember.user.tag}`,
            iconURL: newMember.user.avatar ? `${newMember.user.avatarURL({ dynamic: true })}` : null,
        });

        logChannel
            .send({
                embeds: [embed],
            })
            .catch(e => {});
    },
};
