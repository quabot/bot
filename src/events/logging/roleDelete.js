const { Client, EmbedBuilder, Colors, Role } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "roleDelete",
    name: "roleDelete",
    /**
     * @param {Role} role
     * @param {Client} client
     */
    async execute(role, client, color) {

        if (!role.guild) return;

        const logConfig = await getLogConfig(client, role.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(role.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setDescription(`**Role Deleted**\n${role.name}`)
                    .setTimestamp()
            ]
        }).catch((err => { }));
    }
}