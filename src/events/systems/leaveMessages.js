const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const { getWelcomeConfig, getLeaveChannel } = require('../../structures/functions/config');
const { isValidHttpUrl, joinVariables } = require('../../structures/functions/strings');

module.exports = {
    event: 'guildMemberRemove',
    name: 'leaveMessages',
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {
        if (!member.guild) return;

        const welcomeConfig = await getWelcomeConfig(client, member.guild.id);
        if (!welcomeConfig) return;
        if (welcomeConfig.leaveEnabled === false) return;

        const channel = await getLeaveChannel(member.guild, welcomeConfig);
        if (!channel) return;

        if (welcomeConfig.leaveEmbedBuilder === true) {
            const embed = new EmbedBuilder().setColor(color);

            if (welcomeConfig.leaveEmbed.length === 0) return;

            if (welcomeConfig.leaveEmbed[0].title)
                embed.setTitle(await joinVariables(welcomeConfig.leaveEmbed[0].title, member));
            if (welcomeConfig.leaveEmbed[0].description)
                embed.setDescription(await joinVariables(welcomeConfig.leaveEmbed[0].description, member));
            if (welcomeConfig.leaveEmbed[0].color && /^#([0-9A-F]{6}){1,2}$/i.test(welcomeConfig.leaveEmbed[0].color))
                embed.setColor(welcomeConfig.leaveEmbed[0].color);
            if (welcomeConfig.leaveEmbed[0].timestamp === true) embed.setTimestamp();
            if (
                welcomeConfig.leaveEmbed[0].image &&
                isValidHttpUrl(await joinVariables(welcomeConfig.leaveEmbed[0].image, member))
            )
                embed.setImage(await joinVariables(welcomeConfig.leaveEmbed[0].image, member));
            if (
                welcomeConfig.leaveEmbed[0].thumbnail &&
                isValidHttpUrl(await joinVariables(welcomeConfig.leaveEmbed[0].thumbnail, member))
            )
                embed.setThumbnail(await joinVariables(welcomeConfig.leaveEmbed[0].thumbnail, member));
            if (
                welcomeConfig.leaveEmbed[0].url &&
                isValidHttpUrl(await joinVariables(welcomeConfig.leaveEmbed[0].url, member))
            )
                embed.setURL(await joinVariables(welcomeConfig.leaveEmbed[0].url, member));

            if (welcomeConfig.leaveEmbed[0].authorText) {
                let icon = null;
                let url = null;
                if (isValidHttpUrl(welcomeConfig.leaveEmbed[0].authorIcon))
                    icon = await joinVariables(welcomeConfig.leaveEmbed[0].authorIcon, member);
                if (isValidHttpUrl(welcomeConfig.leaveEmbed[0].authorUrl))
                    url = await joinVariables(welcomeConfig.leaveEmbed[0].authorUrl, member);
                embed.setAuthor({
                    name: await joinVariables(welcomeConfig.leaveEmbed[0].authorText, member),
                    iconURL: icon,
                    url: url,
                });
            }

            if (welcomeConfig.leaveEmbed[0].footerText) {
                let icon = null;
                if (isValidHttpUrl(welcomeConfig.leaveEmbed[0].footerIcon))
                    icon = await joinVariables(welcomeConfig.leaveEmbed[0].footerIcon, member);
                embed.setFooter({
                    text: await joinVariables(welcomeConfig.leaveEmbed[0].footerText, member),
                    iconURL: icon,
                });
            }

            channel.send({ embeds: [embed] }).catch(e => {});
        } else {
            if (!welcomeConfig.leaveMessage) return;

            channel.send({ content: `${await joinVariables(welcomeConfig.leaveMessage, member)}` }).catch(e => {});
        }
    },
};
