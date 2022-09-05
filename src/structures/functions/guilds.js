const { EmbedBuilder, Colors } = require('discord.js');
const { getModerationConfig, getPollConfig } = require('./config');
const { shuffleArray } = require('./arrays');
const { generateEmbed } = require('./embed');

async function tempUnban(client, document, color) {
    const guild = client.guilds.cache.get(`${document.guildId}`);
    if (!guild) return;
    const channel = guild.channels.cache.get(`${document.channelId}`);


    let member = await guild.bans.fetch(document.userId).catch(err => { return; });

    guild.members.unban(document.userId).catch(err => {
        if (err.code !== 50035) return;
    });


    const TempBan = require('../schemas/TempbanSchema');
    await TempBan.findOneAndDelete({
        guildId: document.guildId,
        userId: document.userId,
        banId: document.banId,
    });


    if (channel) channel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(color)
                .setTitle("Member Unbanned!")
                .addFields(
                    { name: "User", value: `<@${document.userId}>`, inline: true },
                    { name: "Unbanned After", value: `${document.banDuration}`, inline: true },
                    { name: "Ban-Id", value: `${document.banId}`, inline: true },
                )
                .setTimestamp()
        ]
    }).catch((e => { }));


    const moderationConfig = await getModerationConfig(client, document.guildId);
    const logChannel = guild.channels.cache.get(`${moderationConfig.channelId}`);
    if (logChannel) logChannel.send({
        embeds: [
            new EmbedBuilder()
                .setColor(color)
                .setTitle("Member Auto-Unbanned")
                .addFields(
                    { name: "User", value: `<@${document.userId}>`, inline: true },
                    { name: "Unbanned After", value: `${document.banDuration}`, inline: true },
                    { name: "Ban-Id", value: `${document.banId}`, inline: true },
                )
                .setTimestamp()
        ]
    }).catch((e => { }));
}

async function endPoll(client, document, color) {

    const Poll = require('../schemas/PollSchema');
    const poll = await Poll.findOne({
        guildId: document.guildId,
        interactionId: document.interactionId
    }).clone().catch((e => { }));

    const guild = client.guilds.cache.get(poll.guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get(poll.channelId);
    if (!channel) return;

    const pollConfig = await getPollConfig(client, guild.id);
    if (pollConfig.pollEnabled === false) return;

    channel.messages.fetch(`${poll.msgId}`).then(message => {
        let reactions = message.reactions.cache
            .each(async (reaction) => await reaction.users.fetch())
            .map((reaction) => reaction.count)
            .flat();

        reactions = reactions.slice(0, 3)
        var winner = Math.max(...reactions);

        let winMsg;
        if (reactions[0] === winner) winMsg = poll.optionsArray[0];
        if (reactions[1] === winner) winMsg = poll.optionsArray[1];
        if (reactions[2] === winner) winMsg = poll.optionsArray[2];
        if (reactions[3] === winner) winMsg = poll.optionsArray[3];

        message.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${message.embeds[0].title}`)
                    .setDescription(`${message.embeds[0].description}\n\nPoll is over, the poll was won by ${winMsg}!`)
                    .addFields(
                        { name: "Hosted by", value: `${message.embeds[0].fields[0].value}`, inline: true },
                        { name: "Winner", value: `${winMsg}`, inline: true },
                        { name: "Ended", value: `${message.embeds[0].fields[1].value}`, inline: true }
                    )
                    .setTimestamp()
                    .setColor(color)
            ]
        });
    }).catch((e => { }));

    await Poll.findOneAndDelete(poll);
}

async function endGiveaway(client, document, color) {

    const Giveaway = require('../schemas/GiveawaySchema');
    const giveaway = await Giveaway.findOne({
        guildId: document.guildId,
        giveawayID: document.giveawayID
    }).clone().catch((e => { }));
    if (!giveaway) return;

    const guild = client.guilds.cache.get(giveaway.guildId);
    if (!guild) return;

    const channel = guild.channels.cache.get(giveaway.channelId);
    if (!channel) return;

    channel.messages.fetch(`${giveaway.msgId}`).then(async message => {

        const reactions = await message.reactions.cache.get("🎉").users.fetch();
        const reactionsShuffle = await shuffleArray(array = Array.from(reactions.filter(u => u.id !== client.user.id), ([name, value]) => ({ name, value })));
        const winners = reactionsShuffle.slice(0, giveaway.winners)
        const isWinner = winners.length !== 0;
        let winMsg = winners.map(u => `<@${u.value.id}>`).join(", ");
        if (!isWinner) winMsg = "No entries!";

        message.edit({
            content: "**:tada: GIVEAWAY ENDED :tada:**",
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`Ended: <t:${Math.floor(giveaway.endTimestampRaw / 1000)}:R>\nWinners: **${winMsg}**\nHosted by: <@${giveaway.hostId}>`)
                    .setTitle(`${giveaway.prize}`)
                    .setTimestamp()
                    .setFooter({ text: `ID: ${giveaway.giveawayID}` })
            ]
        }).catch((e => { }));

        if (isWinner === true) channel.send({
            embeds: [await generateEmbed(color, `${winMsg}, you won **${giveaway.prize}**!`)], content: `${winMsg}`
        }).catch((e => { }));

        giveaway.ended = true;
        giveaway.save().catch(() => null);

    }).catch((e => { }));
}

module.exports = { endGiveaway, tempUnban, endPoll };