const { getApplicationConfig, getCustomizationConfig, getGiveawayConfig, getLevelConfig, getLogConfig, getMembersConfig, getModerationConfig, getPollConfig, getRolesConfig, getTicketConfig, getVerifyConfig, getWelcomeConfig } = require('../../structures/functions/config')

module.exports = {
    event: "guildCreate",
    name: "botAdd",
    async execute(guild, client, color) {
        await getApplicationConfig(client, guild.id);
        await getCustomizationConfig(client, guild.id);
        await getGiveawayConfig(client, guild.id);
        await getLevelConfig(client, guild.id);
        await getLogConfig(client, guild.id);
        await getMembersConfig(client, guild.id);
        await getModerationConfig(client, guild.id);
        await getPollConfig(client, guild.id);
        await getRolesConfig(client, guild.id);
        await getTicketConfig(client, guild.id);
        await getVerifyConfig(client, guild.id);
        await getWelcomeConfig(client, guild.id);

        // var channel = guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText).find(x => x.position === 0);

        // if (!checkChannel(channel.type)) return;

        // channel.send(({
        //     embeds: [
        //         new EmbedBuilder()
        //             .setTitle("Hello, I'm QuaBot.")
        //             .setTimestamp()
        //             .setDescription("I'm QuaBot, a multipurpose bot with loads of features. To configure me, go to [my dashboard](https://dashboard.quabot.net). If you need help with anything, join [my support server](https://discord.quabot.net).\nThanks for adding me to your server!")
        //             .setColor(color)
        //     ]
        // })).catch((err => { }));
    }
}