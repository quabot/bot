const { Client, GuildMember } = require('discord.js');
const { getMembersConfig } = require('../../structures/functions/config');

module.exports = {
    event: 'guildMemberRemove',
    name: 'membersChannelLeave',
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {
        if (!member.guild) return;

        const membersConfig = await getMembersConfig(client, member.guild.id);
        if (!membersConfig) return;
        if (membersConfig.channelEnabled === false) return;

        const channel = member.guild.channels.cache.get(membersConfig.channelId);
        if (!channel) return;

        let name = `${membersConfig.channelName}`;
        name = name.replaceAll('{members}', `${member.guild.memberCount}`);
        name = name.replaceAll('{guild}', `${member.guild.name}`);
        name = name.replaceAll('{channels}', `${member.guild.channels.cache}`);
        name = name.replaceAll('{bots}', `${member.guild.members.cache.filter(u => u.user.bot === true).size}`);
        name = name.replaceAll('{humans}', `${member.guild.members.cache.filter(u => u.user.bot === false).size}`);

        if (name.length > 100) name = name.slice(0, 100);

        channel.setName(name).catch(e => {});
    },
};
