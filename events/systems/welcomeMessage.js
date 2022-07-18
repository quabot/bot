const { EmbedBuilder, Interaction } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {

        const JoinLeaveConfig = require('../../structures/schemas/JoinLeaveConfigSchema');
        const joinLeaveSettings = await JoinLeaveConfig.findOne({
            guildId: member.guild.id,
        }, (err, settings) => {
            if (err) console.log(err);
            if (!settings) {
                const newJoinLeaveConfig = new JoinLeaveConfig({
                    guildId: member.guild.id,
                    joinEnabled: true,
                    leaveEnabled: true,
                    EmbedBuilder: true,
                    joinColor: "GREEN",
                    leaveColor: "RED",
                    joinMessage: "Welcome {user} to **{guild}**!",
                    joinEmbedTitle: "Member Joined!",
                    leaveEmbedTitle: "Member Left!",
                    joinEmbedTitleEnabled: true,
                    leaveEmbedTitleEnabled: true,
                    joinEmbedAuthor: true,
                    leaveEmbedAuthor: true,
                    joinEmbedAuthorText: "{user} just joined!",
                    leaveEmbedAuthorText: "{user} left!",
                    joinEmbedAuthorIcon: "{user}",
                    leaveEmbedAuthorIcon: "{user}",
                    joinEmbedFooter: false,
                    leaveEmbedFooter: false,
                    joinEmbedFooterText: "None",
                    leaveEmbedFooterText: "None",
                    joinEmbedFooterIcon: "None",
                    leaveEmbedFooterIcon: "None",
                    leaveMessage: "Goodbye **{user}**!",
                    joinChannel: "none",
                    leaveChannel: "none",
                    joinRole: "none",
                    joinRoleEnabled: true,
                    joinRoleCooldown: 0,
                    joinDM: false,
                    joinDMContent: "Welcome to {guild}! Check out the rules in #rules.",
                    joinDMEmbed: true,
                    joinDMColor: "GREEN",
                    joinDMEmbedTitle: "Welcome {tag}!",
                    joinDMEmbedTitleEnabled: false,
                });
                newJoinLeaveConfig.save();
            }
        }).clone().catch((err => { }));

        if (!joinLeaveSettings) return;

        //* Safety Checks
        if (joinLeaveSettings.joinEnabled === false) return;

        const joinChannel = member.guild.channels.cache.get(`${joinLeaveSettings.joinChannel}`);
        if (!joinChannel) return;

        //* Send the message
        let joinMessage = joinLeaveSettings.joinMessage;
        joinMessage = joinMessage.replaceAll("{user}", member);
        joinMessage = joinMessage.replaceAll("{tag}", member.user.tag);
        joinMessage = joinMessage.replaceAll("{username}", member.user.username);
        joinMessage = joinMessage.replaceAll("{discriminator}", member.user.discriminator);
        joinMessage = joinMessage.replaceAll("{guild}", member.guild.name);
        joinMessage = joinMessage.replaceAll("{members}", member.guild.memberCount);

        if (joinLeaveSettings.EmbedBuilder === true) {

            //* Define the messages and fix the variables
            let authorMsg = joinLeaveSettings.joinEmbedAuthorText ? joinLeaveSettings.joinEmbedAuthorText : "";
            authorMsg = authorMsg.replaceAll("{guild}", member.guild.name);
            authorMsg = authorMsg.replaceAll("{user}", member.user.tag);
            authorMsg = authorMsg.replaceAll("{username}", member.user.username);
            authorMsg = authorMsg.replaceAll("{members}", member.guild.memberCount);
            authorMsg = authorMsg.replaceAll("{tag}", member.user.tag);
            authorMsg = authorMsg.replaceAll("{discriminator}", member.user.discriminator);

            let authorUrl = joinLeaveSettings.joinEmbedAuthorIcon ? joinLeaveSettings.joinEmbedAuthorIcon : "None";
            authorUrl = authorUrl.replaceAll("{user}", member.user.avatarURL());
            authorUrl = authorUrl.replaceAll("{guild}", member.guild.iconURL());

            let footerMsg = joinLeaveSettings.joinEmbedFooterText ? joinLeaveSettings.joinEmbedFooterText : "";
            footerMsg = footerMsg.replaceAll("{guild}", member.guild.name);
            footerMsg = footerMsg.replaceAll("{user}", member.user.tag);
            footerMsg = footerMsg.replaceAll("{members}", member.guild.memberCount);
            footerMsg = footerMsg.replaceAll("{tag}", member.user.tag);
            footerMsg = footerMsg.replaceAll("{username}", member.user.username);
            footerMsg = footerMsg.replaceAll("{discriminator}", member.user.discriminator);

            let footerUrl = joinLeaveSettings.joinEmbedFooterIcon ? joinLeaveSettings.joinEmbedFooterIcon : "None";
            footerUrl = footerUrl.replaceAll("{user}", member.user.avatarURL());
            footerUrl = footerUrl.replaceAll("{guild}", member.guild.iconURL());

            let joinTitle = joinLeaveSettings.joinEmbedTitle ? joinLeaveSettings.joinEmbedTitle : "";
            joinTitle = joinTitle.replaceAll("{user}", member.user.tag);
            joinTitle = joinTitle.replaceAll("{tag}", member.user.tag);
            joinTitle = joinTitle.replaceAll("{username}", member.user.username);
            joinTitle = joinTitle.replaceAll("{discriminator}", member.user.discriminator);
            joinTitle = joinTitle.replaceAll("{guild}", member.guild.name);
            joinTitle = joinTitle.replaceAll("{members}", member.guild.memberCount);

            const embed = new EmbedBuilder()
                .setDescription(joinMessage)
                .setColor(joinLeaveSettings.joinColor)
                .setTimestamp();

            if (joinLeaveSettings.joinEmbedTitleEnabled) embed.setTitle(`${joinTitle}`);

            if (joinLeaveSettings.joinEmbedAuthor) embed.setAuthor({ name: `${authorMsg}`, iconURL: authorUrl === "None" ? null : authorUrl });

            if (joinLeaveSettings.joinEmbedFooter) embed.setFooter({ text: `${footerMsg}`, iconURL: footerUrl === "None" ? null : footerUrl });

            joinChannel.send({ embeds: [embed] }).catch((err => { }));

        } else {
            joinChannel.send({ content: joinMessage }).catch((err => { }));
        }
    }
}