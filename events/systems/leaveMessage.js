const { MessageEmbed, Interaction } = require('discord.js');
const { getColor } = require('../../structures/files/contants');

module.exports = {
    name: "guildMemberRemove",
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
                    messageEmbed: true,
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
        if (joinLeaveSettings.leaveEnabled === false) return;

        const leaveChannel = member.guild.channels.cache.get(`${joinLeaveSettings.leaveChannel}`);
        if (!leaveChannel) return;

        //* Send the message
        let leaveMessage = joinLeaveSettings.leaveMessage;
        leaveMessage = leaveMessage.replaceAll("{user}", member);
        leaveMessage = leaveMessage.replaceAll("{tag}", member.user.tag);
        leaveMessage = leaveMessage.replaceAll("{username}", member.user.username);
        leaveMessage = leaveMessage.replaceAll("{discriminator}", member.user.discriminator);
        leaveMessage = leaveMessage.replaceAll("{guild}", member.guild.name);
        leaveMessage = leaveMessage.replaceAll("{members}", member.guild.memberCount);

        if (joinLeaveSettings.messageEmbed === true) {

            //* Define the messages and fix the variables
            let authorMsg = joinLeaveSettings.leaveEmbedAuthorText ? joinLeaveSettings.leaveEmbedAuthorText : "";
            authorMsg = authorMsg.replaceAll("{guild}", member.guild.name);
            authorMsg = authorMsg.replaceAll("{user}", member.user.tag);
            authorMsg = authorMsg.replaceAll("{username}", member.user.username);
            authorMsg = authorMsg.replaceAll("{members}", member.guild.memberCount);
            authorMsg = authorMsg.replaceAll("{tag}", member.user.tag);
            authorMsg = authorMsg.replaceAll("{discriminator}", member.user.discriminator);

            let authorUrl = joinLeaveSettings.leaveEmbedAuthorIcon ? joinLeaveSettings.leaveEmbedAuthorIcon : "None";
            authorUrl = authorUrl.replaceAll("{user}", member.user.avatarURL());
            authorUrl = authorUrl.replaceAll("{guild}", member.guild.iconURL());

            let footerMsg = joinLeaveSettings.leaveEmbedFooterText ? joinLeaveSettings.leaveEmbedFooterText : "";
            footerMsg = footerMsg.replaceAll("{guild}", member.guild.name);
            footerMsg = footerMsg.replaceAll("{user}", member.user.tag);
            footerMsg = footerMsg.replaceAll("{members}", member.guild.memberCount);
            footerMsg = footerMsg.replaceAll("{tag}", member.user.tag);
            footerMsg = footerMsg.replaceAll("{username}", member.user.username);
            footerMsg = footerMsg.replaceAll("{discriminator}", member.user.discriminator);

            let footerUrl = joinLeaveSettings.leaveEmbedFooterIcon ? joinLeaveSettings.leaveEmbedFooterIcon : "None";
            footerUrl = footerUrl.replaceAll("{user}", member.user.avatarURL());
            footerUrl = footerUrl.replaceAll("{guild}", member.guild.iconURL());

            let leaveTitle = joinLeaveSettings.leaveEmbedTitle ? joinLeaveSettings.leaveEmbedTitle : "";
            leaveTitle = leaveTitle.replaceAll("{user}", member.user.tag);
            leaveTitle = leaveTitle.replaceAll("{tag}", member.user.tag);
            leaveTitle = leaveTitle.replaceAll("{username}", member.user.username);
            leaveTitle = leaveTitle.replaceAll("{discriminator}", member.user.discriminator);
            leaveTitle = leaveTitle.replaceAll("{guild}", member.guild.name);
            leaveTitle = leaveTitle.replaceAll("{members}", member.guild.memberCount);

            const embed = new MessageEmbed()
                .setDescription(leaveMessage)
                .setColor(joinLeaveSettings.leaveColor)
                .setTimestamp();

            if (joinLeaveSettings.leaveEmbedTitleEnabled) embed.setTitle(`${leaveTitle}`);

            if (joinLeaveSettings.leaveEmbedAuthor) embed.setAuthor({ name: `${authorMsg}`, iconURL: authorUrl === "None" ? null : authorUrl });

            if (joinLeaveSettings.leaveEmbedFooter) embed.setFooter({ text: `${footerMsg}`, iconURL: footerUrl === "None" ? null : footerUrl });

            leaveChannel.send({ embeds: [embed] }).catch((err => { }));

        } else {
            leaveChannel.send({ content: leaveMessage }).catch((err => { }));
        }
    }
}