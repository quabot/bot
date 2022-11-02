const { Client, EmbedBuilder, Colors, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const consola = require('consola');
const { handleVote } = require('../../structures/functions/guilds');
const { default: axios } = require('axios');
require('dotenv').config();

module.exports = {
    event: 'ready',
    name: 'clientConnections',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        const { io } = require('socket.io-client');
        const socket = io('http://localhost:3002');
        socket.on('connect', () => {
            consola.info('Websocket connected.');
        });

        socket.on('update', data => {
            client.cache.take(data.cache);
        });

        socket.on('vote', data => {
            handleVote(client, data);
        });

        socket.on('send', data => {
            const channel = client.guilds.cache.get(data.guildId).channels.cache.get(data.channelId);
            if (!channel) return;
            if (data.type === 'suggestion') {
                channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setTitle('Create suggestion')
                                .setDescription('Click on the button below this message to leave a suggestion.'),
                        ],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('suggestion-create')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel('💡 Suggest')
                            ),
                        ],
                    })
                    .catch(e => { });
            } else if (data.type === 'ticket') {
                channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setTitle('Create ticket')
                                .setDescription('Click on the button below this message to create a ticket.'),
                        ],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('create-ticket')
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel('🎫 Ticket')
                            ),
                        ],
                    })
                    .catch(e => { });
            } else {
                channel
                    .send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Colors.Green)
                                .setTitle('Please verify to get access to the server!')
                                .setDescription('Click the button below this message to get verified.'),
                        ],
                        components: [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('verify-server')
                                    .setLabel('Verify')
                                    .setStyle(ButtonStyle.Secondary)
                            ),
                        ],
                    })
                    .catch(e => { });
            }
        });

        socket.on('react', async data => {
            const channel = client.guilds.cache
                .get(data.newReaction.guildId)
                .channels.cache.get(data.newReaction.channelId);
            if (!channel) return;

            const message = await channel.messages.fetch({ message: data.newReaction.messageId }).catch(async e => {
                return;
            });

            message.react(data.newReaction.emoji).catch(e => { });
        });

        socket.on('application-state', async data => {
            const Application = require('../../structures/schemas/ApplicationSchema');
            const application = await Application.findOne({
                guildId: data.guildId,
                applicationId: data.applicationId,
            });
            if (!application) return;

            const member = client.guilds.cache.get(data.guildId).members.cache.get(data.userId);
            const role =
                application.applicationReward === 'none'
                    ? undefined
                    : client.guilds.cache.get(data.guildId).roles.cache.get(application.applicationReward);

            if (role) member.roles.add(role).catch(e => { });
            member
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(data.applicationState === 'APPROVED' ? Colors.Green : Colors.Red)
                            .setTitle(`Application ${data.applicationState.toLowerCase()}!`)
                            .setDescription(
                                `Your application in ${client.guilds.cache.get(data.guildId).name
                                } has been approved. You have been given the rewards (if any).`
                            ),
                    ],
                })
                .catch(e => { });
        });

        socket.on('stats', async data => {
            axios
                .post('https://api.quabot.net/stats-post', {
                    password: `${process.env.STATS_PASSWORD}`,
                    guilds: client.guilds.cache.size,
                    channels: client.channels.cache.size,
                    users: client.users.cache.size,
                }).catch(e => { });
        });

        socket.on('uptime', async data => {
            axios
                .post('https://api.quabot.net/uptime-post', {
                    password: `${process.env.STATS_PASSWORD}`
                }).catch(e => { });
        });

        socket.on('nickname', async data => {
            const guild = client.guilds.cache.get(data.guildId);
            if (!guild) return;
            guild.members.me.setNickname(data.nickname).catch(e => console.log(e));
        });

        socket.on('disconnect', () => {
            consola.warn('Websocket disconnected.');
        });
    },
};
