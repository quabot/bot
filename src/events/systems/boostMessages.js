module.exports = {
    event: 'guildMemberUpdate',
    name: 'boostMessages',
    once: false,
    /**
     * @param {Client} client
     */
    async execute(oldMember, newMember) {
        if (oldMember.premiumSinceTimestamp === null && newMember.premiumSinceTimestamp > 0) {
            if (!newMember.guild) return;

            const channel = await newMember.guild.channels.cache.find(
                channel => channel.name.toLowerCase() === 'general'
            );
            if (!channel) return;

            channel.send({ content: `${newMember} started boosting this server!` }).catch(e => {});
        }
    },
};
