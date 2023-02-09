const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType } = require('discord.js');
const { getGiveawayConfig } = require('../../../utils/configs/giveawayConfig');
const { getIdConfig } = require('../../../utils/configs/idConfig');
const { Embed } = require('../../../utils/constants/embed');
const ms = require('ms');
const { endGiveaway } = require('../../../utils/functions/giveaway');
const Giveaway = require('../../../structures/schemas/Giveaway');

module.exports = {
    parent: 'giveaway',
    name: 'create',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const ids = await getIdConfig(interaction.guildId);
        const config = await getGiveawayConfig(client, interaction.guildId);

        if (!ids || !config) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Giveaways are disabled in this server.')
            ]
        });


        const channel = interaction.options.getChannel('channel');
        const prize = interaction.options.getString('prize');
        const winners = interaction.options.getNumber('winners');
        const duration = interaction.options.getString('duration');

        if (!channel || !prize || !winners || !duration) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter all the required fields.')
            ]
        });

        if (channel.type !== ChannelType.GuildAnnouncement && channel.type !== ChannelType.GuildText) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please create the giveaway in either a text or announcement channel.')
            ]
        });

        if (!ms(duration)) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter a valid duration. Eg. 1h, 5m, 1d etc.')
            ]
        });
        
        if (ms(duration) > 2147483647) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter a value that is below 24 days.')
            ]
        });

        if (winners > 25 || winners < 1) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('The amount of winners needs to be between 1 and 25.')
            ]
        });

        if (prize.length > 500) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Please enter a prize with a maximum length of 500.')
            ]
        });

        const endTime = Math.round((new Date().getTime() + ms(duration)) / 1000);

        const message = await channel.send({
            embeds: [
                new Embed(color)
                    .setTitle(`${prize}`)
                    .setDescription(`React with :tada: to participate!
                    Ends: <t:${endTime}:R>
                    Winners: **${winners}**
                    Hosted by: ${interaction.user}
                    `)
                    .setFooter({ text: `ID: ${ids.giveawayId}` })

            ], content: `${config.pingEveryone ? '@everyone\n**:tada: GIVEAWAY :tada:**' : '**:tada: GIVEAWAY :tada:**'}`,
        });

        if (!message) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Failed to send the message. Please make sure I have the permissions required to post there.')
            ]
        });
        message.react('🎉');


        const newGiveaway = new Giveaway({
            guildId: interaction.guildId,
            id: ids.giveawayId,
        
            prize,
            winners,
        
            channel: channel.id,
            message: message.id,
            host: interaction.user.id,
        
            endTimestamp: new Date().getTime() + ms(duration),
            ended: false
        });
        await newGiveaway.save();

        
        ids.giveawayId += 1;
        await ids.save();


        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`The giveaway has been created and is starting in ${channel}! [Click here](${message.url}) to jump there.`)
            ]
        });

        
        setTimeout(() => {
            endGiveaway(client, newGiveaway, false);
        }, ms(duration));
    }
};
