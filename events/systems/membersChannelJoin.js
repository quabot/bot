const { Channel, GuildMember } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Channel} channel
     * @param {GuildMember} member 
     */
    async execute(member, client) {

        const MemberChannel = require('../../structures/schemas/MembersChannelSchema');
        const memberChannelSettings = await MemberChannel.findOne({
            guildId: member.guild.id,
        }, (err, settings) => {
            if (err) console.log(err);
            if (!settings) {
                const newMemberChannel = new MemberChannel({
                    guildId: member.guild.id,
                    channelId: "none",
                    channelName: "Members: {members}",
                    channelEnabled: false
                });
                newMemberChannel.save();
            }
        }).clone().catch((err => { }));

        if (!memberChannelSettings) return;

        if (memberChannelSettings.channelEnabled === false) return;

        const channel = member.guild.channels.cache.get(memberChannelSettings.channelId);
        if (!channel) return;

        let name = `${memberChannelSettings.channelName}`;
        name = name.replaceAll("{members}", `${member.guild.memberCount}`);
        name = name.replaceAll("{guild}", `${member.guild.name}`);
        name = name.replaceAll("{channels}", `${member.guild.channels.cache}`);
        name = name.replaceAll("{bots}", `${member.guild.members.cache.filter(u => u.user.bot === true).size}`);
        name = name.replaceAll("{humans}", `${member.guild.members.cache.filter(u => u.user.bot === false).size}`);

        if (name.length > 100) name = name.slice(0, 100);

        channel.setName(name).catch((err => { }))

    }
}
