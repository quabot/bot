const { Client, Events, GuildMember } = require('discord.js');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { getWelcomeConfig } = require('../../utils/configs/welcomeConfig');
const { CustomEmbed } = require('../../utils/constants/customEmbed');

module.exports = {
    event: Events.GuildMemberAdd,
    name: "welcomeMessage",
    /**
     * @param {GuildMember} member
     * @param {Client} client 
     */
    async execute(member, client) {

        const config = await getWelcomeConfig(client, member.guild.id);
        const custom = await getServerConfig(client, member.guild.id);
        if (!config) return;
        if (!config.joinEnabled) return;

        const channel = member.guild.channels.cache.get(config.joinChannel);
        if (!channel) return;

        const parseString = (text) =>
            text
                .replaceAll('{user}', `${member}`)
                .replaceAll('{id}', `${member.user.id}`)
                .replaceAll('{username}', member.user.username ?? '')
                .replaceAll('{tag}', member.user.tag ?? '')
                .replaceAll('{discriminator}', member.user.discriminator ?? '')
                .replaceAll('{avatar}', member.displayAvatarURL() ?? '')
                .replaceAll('{icon}', member.guild.iconURL() ?? '')
                .replaceAll('{server}', member.guild.name ?? '')
                .replaceAll('{members}', member.guild.memberCount ?? '')
                .replaceAll('{color}', `${custom.color ?? '#3a5a74'}`)

        if (config.joinType === 'embed') {
            const embed = new CustomEmbed(config.joinMessage, parseString);
            await channel.send({ embeds: [embed], content: parseString(config.joinMessage.content) });
        } else {
            if (config.joinMessage.content === '') return;
            await channel.send({ content: parseString(config.joinMessage.content) });
        }
    }
}