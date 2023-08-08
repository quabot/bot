const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const colors = require('../../files/colors.json');

const regions = {
    brazil: 'Brazil',
    europe: 'Europe',
    hongkong: 'Hong Kong',
    india: 'India',
    japan: 'Japan',
    russia: 'Russia',
    singapore: 'Singapore',
    southafrica: 'South Africa',
    sydeny: 'Sydeny',
    'us-central': 'US Central',
    'us-east': 'US East',
    'us-west': 'US West',
    'us-south': 'US South'
};

module.exports = {
    name: 'serverinfo',
    aliases: ["serverinfo"],
    async execute(client, message, args) {

        console.log("Command `serverinfo` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
                
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;


        const embed = new MessageEmbed()
            .setDescription(`**Server Info**`)
            .setColor(colors.COLOR)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(`General\n**Name:**`, `${message.guild.name}`)
            .addField(`**Boost Tier:**`, `${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : '0'}`)
            .addField(`**Time Created:**`, `${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]`)
            .addField(`**Role Count:**`, `${roles.length}`, true)
            .addField(`**Emoji Count:**`, `${emojis.size}`, true)
            .addField(`**Member Count:**`, `${message.guild.memberCount}`, true)
            .addField(`**Humans:**`, `${members.filter(member => !member.user.bot).size}`, true)
            .addField(`**Bots:**` ,`${members.filter(member => member.user.bot).size}`, true)
            .addField(`**Text Channels:**`, `${channels.filter(channel => channel.type === 'text').size}`, true)
            .addField(`**Voice Channels:**`, `${channels.filter(channel => channel.type === 'voice').size}`, true)
            .addField(`**Boost Count:**`, `${message.guild.premiumSubscriptionCount || '0'}`, true)
            .addField(`Roles [${roles.length - 1}]`, roles.join(', '))

            .setTimestamp();
        message.channel.send({ embeds: [embed]});
    }

}