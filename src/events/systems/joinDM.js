const { Client, GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getWelcomeConfig } = require('../../structures/functions/config');
const { isValidHttpUrl, joinVariables } = require('../../structures/functions/strings');

module.exports = {
    event: "guildMemberAdd",
    name: "joinDM",
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member, client, color) {

        if (!member.guild) return;

        const welcomeConfig = await getWelcomeConfig(client, member.guild.id);
        if (!welcomeConfig) return;
        if (welcomeConfig.joinDM === false) return;

        const sentBtn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("sent-from-server")
                    .setDisabled(true)
                    .setLabel(`Sent from server: ${member.guild.name}`.slice(0, 79))
                    .setStyle(ButtonStyle.Primary)
            );


        if (welcomeConfig.joinDMEmbedBuilder === true) {
            const embed = new EmbedBuilder().setColor(color);

            if (welcomeConfig.joinDMEmbed.length === 0) return;
            
            if (welcomeConfig.joinDMEmbed[0].title) embed.setTitle(await joinVariables(welcomeConfig.joinDMEmbed[0].title, member));
            if (welcomeConfig.joinDMEmbed[0].description) embed.setDescription(await joinVariables(welcomeConfig.joinDMEmbed[0].description, member));
            if (welcomeConfig.joinDMEmbed[0].color && /^#([0-9A-F]{6}){1,2}$/i.test(welcomeConfig.joinDMEmbed[0].color)) embed.setColor(welcomeConfig.joinDMEmbed[0].color);
            if (welcomeConfig.joinDMEmbed[0].timestamp === true) embed.setTimestamp();
            if (welcomeConfig.joinDMEmbed[0].image && isValidHttpUrl(await joinVariables(welcomeConfig.joinDMEmbed[0].image, member))) embed.setImage(await joinVariables(welcomeConfig.joinDMEmbed[0].image, member));
            if (welcomeConfig.joinDMEmbed[0].thumbnail && isValidHttpUrl(await joinVariables(welcomeConfig.joinDMEmbed[0].thumbnail, member))) embed.setThumbnail(await joinVariables(welcomeConfig.joinDMEmbed[0].thumbnail, member));
            if (welcomeConfig.joinDMEmbed[0].url && isValidHttpUrl(await joinVariables(welcomeConfig.joinDMEmbed[0].url, member))) embed.setURL(await joinVariables(welcomeConfig.joinDMEmbed[0].url, member));
            
            if (welcomeConfig.joinDMEmbed[0].authorText) {
                let icon = null;
                let url = null;
                if (isValidHttpUrl(welcomeConfig.joinDMEmbed[0].authorIcon)) icon = await joinVariables(welcomeConfig.joinDMEmbed[0].authorIcon, member);
                if (isValidHttpUrl(welcomeConfig.joinDMEmbed[0].authorUrl)) url = await joinVariables(welcomeConfig.joinDMEmbed[0].authorUrl, member);
                embed.setAuthor({ name: await joinVariables(welcomeConfig.joinDMEmbed[0].authorText, member), iconURL: icon, url: url });
            }

            if (welcomeConfig.joinDMEmbed[0].footerText) {
                let icon = null;
                if (isValidHttpUrl(welcomeConfig.joinDMEmbed[0].footerIcon)) icon = await joinVariables(welcomeConfig.joinDMEmbed[0].footerIcon, member);
                embed.setFooter({ text: await joinVariables(welcomeConfig.joinDMEmbed[0].footerText, member), iconURL: icon });
            }
            
            member.send({ embeds: [embed], components: [sentBtn] }).catch(() => null);
        } else {
            if (!welcomeConfig.joinDMMessage) return;

            member.send({ content:`${await joinVariables(welcomeConfig.joinDMMessage, member)}`, components: [sentBtn] }).catch(() => null);
        }
    }
}