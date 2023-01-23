const Giveaway = require("../../structures/schemas/Giveaway");
const { shuffleArray } = require("./array");

async function endGiveaway(client, document, color) {
    const giveaway = await Giveaway.findOne({
        guildId: document.guildId,
        id: document.id
    }).clone().catch();

    const guild = await client.guilds.cache.get(document.guildId);
    if (!giveaway || !guild) return;
    
    const channel = await guild.channels.cache.get(giveaway.channel);
    if (!channel) return;

    channel.messages
        .fetch(`${giveaway.message}`)
        .then(async message => {

            const reactions = await message.reactions.cache.get('🎉').users.fetch();
            const shuffled = await shuffleArray(
                (array = Array.from(
                    reactions.filter(u => u.id !== client.user.id),
                    ([name, value]) => ({ name, value})
                ))
            );

            
        });
}

module.exports = { endGiveaway };