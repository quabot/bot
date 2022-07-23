const { EmbedBuilder, Interaction, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
                    joinColor: Colors.Green,
                    leaveColor: Colors.Red,
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
                    joinRole: [],
                    joinRoleEnabled: true,
                    joinDM: false,
                    joinDMContent: "Welcome to {guild}! Check out the rules in #rules.",
                    joinDMEmbed: true,
                    joinDMColor: Colors.Green,
                    joinDMEmbedTitle: "Welcome {tag}!",
                    joinDMEmbedTitleEnabled: false,
                });
                newJoinLeaveConfig.save();
            }
        }).clone().catch((err => { }));

        if (!joinLeaveSettings) return;

        //* Safety Checks
        if (joinLeaveSettings.joinDM === false) return;

        let name = `${member.guild.name}`;
        if (name.length > 62) name = name.slice(0, 62);

        const sentFrom = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('sentfromserver')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
                    .setLabel(`Sent from server: ${name}`)
            )


        let dmMessage = joinLeaveSettings.joinDMContent;
        dmMessage = dmMessage.replaceAll("{user}", member);
        dmMessage = dmMessage.replaceAll("{tag}", member.user.tag);
        dmMessage = dmMessage.replaceAll("{username}", member.user.username);
        dmMessage = dmMessage.replaceAll("{discriminator}", member.user.discriminator);
        dmMessage = dmMessage.replaceAll("{guild}", member.guild.name);
        dmMessage = dmMessage.replaceAll("{members}", member.guild.memberCount);

        if (joinLeaveSettings.joinDMEmbed === true) {

            let dmTitle = joinLeaveSettings.joinDMEmbedTitle;
            dmTitle = dmTitle.replaceAll("{user}", member.user.tag);
            dmTitle = dmTitle.replaceAll("{tag}", member.user.tag);
            dmTitle = dmTitle.replaceAll("{username}", member.user.username);
            dmTitle = dmTitle.replaceAll("{discriminator}", member.user.discriminator);
            dmTitle = dmTitle.replaceAll("{guild}", member.guild.name);
            dmTitle = dmTitle.replaceAll("{members}", member.guild.memberCount);

            const embed = new EmbedBuilder()
                .setDescription(dmMessage)
                .setColor(joinLeaveSettings.joinDMColor)
                .setTimestamp();

            if (joinLeaveSettings.joinDMEmbedTitleEnabled) embed.setTitle(`${dmTitle}`);

            member.send({ embeds: [embed], components: [sentFrom] }).catch((err => { }));

        } else {
            member.send({ content: dmMessage, components: [sentFrom] }).catch((err => console.log(err)));
        }
    }
}
