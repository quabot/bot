const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const { getWelcomeConfig, getWelcomeChannel, getVerifyConfig } = require('../../structures/functions/config');
const { isValidHttpUrl, joinVariables } = require('../../structures/functions/strings');

module.exports = {
    event: 'guildMemberAdd',
    name: 'joinMessages',
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {
        if (!member.guild) return;

        const welcomeConfig = await getWelcomeConfig(client, member.guild.id);
        if (!welcomeConfig) return;
        if (welcomeConfig.joinEnabled === false) return;

        const channel = await getWelcomeChannel(member.guild, welcomeConfig);
        if (!channel) return;

        const verifyConfig = await getVerifyConfig(client, member.guild.id);
        if (!verifyConfig) return;
        if (verifyConfig.verifyEnabled === true && verifyConfig.verifyMessage && welcomeConfig.waitVerify) return;

        if (welcomeConfig.joinEmbedBuilder === true) {
            const embed = new EmbedBuilder().setColor(color);

            if (welcomeConfig.joinEmbed.length === 0) return;

            if (welcomeConfig.joinEmbed[0].title)
                embed.setTitle(await joinVariables(welcomeConfig.joinEmbed[0].title, member));
            if (welcomeConfig.joinEmbed[0].description)
                embed.setDescription(await joinVariables(welcomeConfig.joinEmbed[0].description, member));
            if (welcomeConfig.joinEmbed[0].color && /^#([0-9A-F]{6}){1,2}$/i.test(welcomeConfig.joinEmbed[0].color))
                embed.setColor(welcomeConfig.joinEmbed[0].color);
            if (welcomeConfig.joinEmbed[0].timestamp === true) embed.setTimestamp();
            if (
                welcomeConfig.joinEmbed[0].image &&
                isValidHttpUrl(await joinVariables(welcomeConfig.joinEmbed[0].image, member))
            )
                embed.setImage(await joinVariables(welcomeConfig.joinEmbed[0].image, member));
            if (
                welcomeConfig.joinEmbed[0].thumbnail &&
                isValidHttpUrl(await joinVariables(welcomeConfig.joinEmbed[0].thumbnail, member))
            )
                embed.setThumbnail(await joinVariables(welcomeConfig.joinEmbed[0].thumbnail, member));
            if (
                welcomeConfig.joinEmbed[0].url &&
                isValidHttpUrl(await joinVariables(welcomeConfig.joinEmbed[0].url, member))
            )
                embed.setURL(await joinVariables(welcomeConfig.joinEmbed[0].url, member));

            if (welcomeConfig.joinEmbed[0].authorText) {
                let icon = null;
                let url = null;
                if (isValidHttpUrl(welcomeConfig.joinEmbed[0].authorIcon))
                    icon = await joinVariables(welcomeConfig.joinEmbed[0].authorIcon, member);
                if (isValidHttpUrl(welcomeConfig.joinEmbed[0].authorUrl))
                    url = await joinVariables(welcomeConfig.joinEmbed[0].authorUrl, member);
                embed.setAuthor({
                    name: await joinVariables(welcomeConfig.joinEmbed[0].authorText, member),
                    iconURL: icon,
                    url: url,
                });
            }

            if (welcomeConfig.joinEmbed[0].footerText) {
                let icon = null;
                if (isValidHttpUrl(welcomeConfig.joinEmbed[0].footerIcon))
                    icon = await joinVariables(welcomeConfig.joinEmbed[0].footerIcon, member);
                embed.setFooter({
                    text: await joinVariables(welcomeConfig.joinEmbed[0].footerText, member),
                    iconURL: icon,
                });
            }

            channel.send({ embeds: [embed] }).catch(e => {});
        } else {
            if (!welcomeConfig.joinMessage) return;

            channel.send({ content: `${await joinVariables(welcomeConfig.joinEmbed, member)}` }).catch(e => {});
        }
    },
};
