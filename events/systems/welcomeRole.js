const { EmbedBuilder, Interaction, Colors } = require('discord.js');

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
        if (joinLeaveSettings.joinRoleEnabled === false) return;

        joinLeaveSettings.joinRole.forEach(obj => {
            const role = member.guild.roles.cache.get(`${obj.role}`);
            if (!role) return;

            if (obj.user === "BOT") {
                if (member.user.bot === false) return;
                setTimeout(() => {
                    member.roles.add(obj.role).catch((err => { }));
                }, obj.cooldown * 1000);
            } else {
                setTimeout(() => {
                    member.roles.add(obj.role).catch((err => { }));
                }, obj.cooldown * 1000);
            }
        })
    }
}
