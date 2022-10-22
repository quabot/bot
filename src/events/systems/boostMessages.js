const { Client, EmbedBuilder } = require('discord.js');
const { getBoostConfig, getBoostChannel } = require('../../structures/functions/config');
const { isValidHttpUrl, joinVariables } = require('../../structures/functions/strings');

module.exports = {
    event: 'guildMemberUpdate',
    name: 'boostMessages',
    once: false,
    /**
     * @param {Client} client
     */
    async execute(oldMember, newMember, client, color) {
        if (oldMember.premiumSinceTimestamp === null && newMember.premiumSinceTimestamp > 0) {
            if (!newMember.guild) return;

            const boostConfig = await getBoostConfig(client, member.guild.id);
            if (!boostConfig?.boostEnabled) return;

            const channel = await getBoostChannel(member.guild, boostConfig);
            if (!channel) return;

            if (boostConfig.boostEmbedBuilder) {
                const embed = new EmbedBuilder().setColor(color);

                if (boostConfig.boostEmbed.length === 0) return;

                if (boostConfig.boostEmbed[0].title)
                    embed.setTitle(await joinVariables(boostConfig.boostEmbed[0].title, member));
                if (boostConfig.boostEmbed[0].description)
                    embed.setDescription(await joinVariables(boostConfig.boostEmbed[0].description, member));
                if (boostConfig.boostEmbed[0].color && /^#([0-9A-F]{6}){1,2}$/i.test(boostConfig.boostEmbed[0].color))
                    embed.setColor(boostConfig.boostEmbed[0].color);
                if (boostConfig.boostEmbed[0].timestamp === true) embed.setTimestamp();
                if (
                    boostConfig.boostEmbed[0].image &&
                    isValidHttpUrl(await joinVariables(boostConfig.boostEmbed[0].image, member))
                )
                    embed.setImage(await joinVariables(boostConfig.boostEmbed[0].image, member));
                if (
                    boostConfig.boostEmbed[0].thumbnail &&
                    isValidHttpUrl(await joinVariables(boostConfig.boostEmbed[0].thumbnail, member))
                )
                    embed.setThumbnail(await joinVariables(boostConfig.boostEmbed[0].thumbnail, member));
                if (
                    boostConfig.boostEmbed[0].url &&
                    isValidHttpUrl(await joinVariables(boostConfig.boostEmbed[0].url, member))
                )
                    embed.setURL(await joinVariables(boostConfig.boostEmbed[0].url, member));

                if (boostConfig.boostEmbed[0].authorText) {
                    let icon = null;
                    let url = null;
                    if (isValidHttpUrl(boostConfig.boostEmbed[0].authorIcon))
                        icon = await joinVariables(boostConfig.boostEmbed[0].authorIcon, member);
                    if (isValidHttpUrl(boostConfig.boostEmbed[0].authorUrl))
                        url = await joinVariables(boostConfig.boostEmbed[0].authorUrl, member);
                    embed.setAuthor({
                        name: await joinVariables(boostConfig.boostEmbed[0].authorText, member),
                        iconURL: icon,
                        url: url,
                    });
                }

                if (boostConfig.boostEmbed[0].footerText) {
                    let icon = null;
                    if (isValidHttpUrl(boostConfig.boostEmbed[0].footerIcon))
                        icon = await joinVariables(boostConfig.boostEmbed[0].footerIcon, member);
                    embed.setFooter({
                        text: await joinVariables(boostConfig.boostEmbed[0].footerText, member),
                        iconURL: icon,
                    });
                }

                channel.send({ embeds: [embed] }).catch(e => {});
            } else {
                if (!boostConfig.boostMessage) return;

                channel.send({ content: `${await joinVariables(boostConfig.boostEmbed, member)}` }).catch(e => {});
            }
        }
    },
};
