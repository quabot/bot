const { Client, Events, GuildMember } = require('discord.js');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { getWelcomeConfig } = require('../../utils/configs/welcomeConfig');
const { CustomEmbed } = require('../../utils/constants/customEmbed');

module.exports = {
    event: Events.GuildMemberAdd,
    name: "welcomeDM",
    /**
     * @param {GuildMember} member
     * @param {Client} client 
     */
    async execute(member, client) {

        const config = await getWelcomeConfig(client, member.guild.id);
        const custom = await getServerConfig(client, member.guild.id);
        if (!config) return;
        if (!config.joinDM) return;


        const parseString = (text) =>
            text
                .replaceAll('{user}', `${member}`)
                .replaceAll('{username}', member.user.username ?? '')
                .replaceAll('{id}', `${member.user.id}`)
                .replaceAll('{tag}', member.user.tag ?? '')
                .replaceAll('{discriminator}', member.user.discriminator ?? '')
                .replaceAll('{avatar}', member.displayAvatarURL() ?? '')
                .replaceAll('{icon}', member.guild.iconURL() ?? '')
                .replaceAll('{server}', member.guild.name ?? '')
                .replaceAll('{members}', member.guild.memberCount ?? '')
                .replaceAll('{color}', `${custom.color ?? '#3a5a74'}`)

                
        if (config.joinDMType === 'embed') {
            const embed = new CustomEmbed(config.dm, parseString);
            await member.send({ embeds: [embed], content: parseString(config.dm.content) });
        } else {
            if (config.dm.content === '') return;
            await member.send({ content: parseString(config.dm.content) });
        }

    }
}