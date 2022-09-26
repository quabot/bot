const { Client, EmbedBuilder, Colors, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const consola = require('consola');
require('dotenv').config();

module.exports = {
    event: "ready",
    name: "clientConnections",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {

        const { io } = require("socket.io-client");
        const socket = io("http://localhost:3002");
        socket.on("connect", () => {
            consola.info("Websocket connected.");
        });

        socket.on("update", (data) => {
            client.cache.take(data.cache);
        });

        socket.on("send", (data) => {
            const channel = client.guilds.cache.get(data.guildId).channels.cache.get(data.channelId);
            if (!channel) return;
            if (data.type === "suggestion") {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setTitle("Create suggestion")
                            .setDescription("Click on the button below this message to leave a suggestion.")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("suggestion-create")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("💡 Suggest")
                            )
                    ]
                }).catch((e => { }));
            } else if (data.type === "ticket") {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setTitle("Create ticket")
                            .setDescription("Click on the button below this message to create a ticket.")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("create-ticket")
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel("🎫 Ticket")
                            )
                    ]
                }).catch((e => { }));
            } else {
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Colors.Green)
                            .setTitle("Please verify to get access to the server!")
                            .setDescription("Click the button below this message to get verified.")
                    ], components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("verify-server")
                                    .setLabel("Verify")
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                }).catch((e => { }));
            }
        });

        socket.on("react", async (data) => {
            const channel = client.guilds.cache.get(data.newReaction.guildId).channels.cache.get(data.newReaction.channelId);
            if (!channel) return;

            const message = await channel.messages.fetch({ message: data.newReaction.messageId })
                .catch(async e => {
                    return;
                });

            message.react(data.newReaction.emoji).catch((e => { }));
        });

        socket.on("disconnect", () => {
            consola.warn("Websocket disconnected.");
        });
    }
}