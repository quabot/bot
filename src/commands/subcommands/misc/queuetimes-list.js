const { EmbedBuilder, ButtonStyle, ButtonBuilder, Colors, ActionRowBuilder } = require('discord.js');
const axios = require('axios');
const { titleCase } = require('../../../structures/functions/strings');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: 'list',
    command: 'queue-times',
    /**
     * @param {import("discord.js").Interaction} interaction
     */
    async execute(client, interaction, color) {
        const country = interaction.options.getString('country')
            ? titleCase(
                  (await interaction.options.getString('country')) ? interaction.options.getString('country') : ''
              )
            : null;
        const park = interaction.options.getString('park')
            ? titleCase((await interaction.options.getString('park')) ? interaction.options.getString('park') : '')
            : null;
        const owner = interaction.options.getString('owner')
            ? titleCase((await interaction.options.getString('owner')) ? interaction.options.getString('owner') : '')
            : null;
        const { data: parks } = await axios.get('https://queue-times.com/parks.json');

        // Only list the parks
        if (country) {
            const newParks = [];
            parks.forEach(park => {
                park.parks.forEach(subpark => {
                    if (subpark.country === country) newParks.push(subpark);
                });
            });

            if (newParks.length === 0)
                return interaction.reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Couldn't find any rides for that country.\n[Powered by Queue-Times.com](https://queue-times.com)"
                        ),
                    ],
                });

            const backId = 'back-list';
            const forwardId = 'forward-list';
            const backButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Back',
                emoji: '◀️',
                customId: backId,
            });
            const forwardButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Next',
                emoji: '▶️',
                customId: forwardId,
            });

            const makeEmbed = async start => {
                const current = newParks.slice(start, start + 4);
                return new EmbedBuilder({
                    color: Colors.Aqua,
                    author: { name: 'Powered by Queue-Times.com', url: 'https://queue-times.com' },
                    timestamp: Date.now(),
                    title: `Park(s) ${start + 1}${newParks.length > 4 ? '-' + (start + 4) : ''}/${newParks.length}`,
                    fields: await Promise.all(
                        current.map(async item => {
                            return {
                                name: `${item.name}`,
                                value: `${item.country}`,
                                inline: false,
                            };
                        })
                    ),
                });
            };

            const canFit = newParks.length <= 4;
            const msg = await interaction
                .reply({
                    embeds: [await makeEmbed(0)],
                    ephemeral: false,
                    components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
                })
                .catch(e => console.log(e));
            if (!msg) return;

            const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

            let currentIndex = 0;
            collector.on('collect', async interaction => {
                if (interaction.customId === backId || interaction.customId === forwardId) {
                    interaction.customId === backId ? (currentIndex -= 4) : (currentIndex += 4);
                    await interaction
                        .update({
                            embeds: [await makeEmbed(currentIndex)],
                            components: [
                                new ActionRowBuilder({
                                    components: [
                                        ...(currentIndex ? [backButton] : []),
                                        ...(currentIndex + 4 < newParks.length ? [forwardButton] : []),
                                    ],
                                }),
                            ],
                        })
                        .catch(e => {});
                }
            });

            return;
        }

        // List attractions
        if (park) {
            const newParks = [];
            parks.forEach(p => p.parks.forEach(fp => newParks.push(fp)));

            const foundPark = newParks.find(i => i.name === park);
            if (!foundPark)
                return interaction.reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Couldn't find that park!\n[Powered by Queue-Times.com](https://queue-times.com)"
                        ),
                    ],
                });
            const id = foundPark.id;

            const { data: rawRides } = await axios
                .get(`https://queue-times.com/parks/${id}/queue_times.json`)
                .catch(() => {});
            const rides = [];
            rawRides.lands.forEach(i => i.rides.forEach(i => rides.push(i)));
            if (rides.length === 0)
                return interaction.reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            'No rides found for that park.\n[Powered by Queue-Times.com](https://queue-times.com)'
                        ),
                    ],
                });

            const backId = 'back-list';
            const forwardId = 'forward-list';
            const backButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Back',
                emoji: '◀️',
                customId: backId,
            });
            const forwardButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Next',
                emoji: '▶️',
                customId: forwardId,
            });

            const makeEmbed = async start => {
                const current = rides.slice(start, start + 4);
                return new EmbedBuilder({
                    color: Colors.Aqua,
                    author: { name: 'Powered by Queue-Times.com', url: 'https://queue-times.com' },
                    timestamp: Date.now(),
                    title: `Rides ${start + 1}${rides.length > start + 4 ? '-' + (start + 4) : '-' + rides.length}/${
                        rides.length
                    } in ${park}`,
                    fields: await Promise.all(
                        current.map(async item => {
                            return {
                                name: `${item.name}`,
                                value: `${item.is_open ? 'Currently Opened' : 'Currently Closed'}`,
                                inline: false,
                            };
                        })
                    ),
                });
            };

            const canFit = rides.length <= 4;
            const msg = await interaction
                .reply({
                    embeds: [await makeEmbed(0)],
                    ephemeral: false,
                    components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
                })
                .catch(e => console.log(e));
            if (!msg) return;

            const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

            let currentIndex = 0;
            collector.on('collect', async interaction => {
                if (interaction.customId === backId || interaction.customId === forwardId) {
                    interaction.customId === backId ? (currentIndex -= 4) : (currentIndex += 4);
                    await interaction
                        .update({
                            embeds: [await makeEmbed(currentIndex)],
                            components: [
                                new ActionRowBuilder({
                                    components: [
                                        ...(currentIndex ? [backButton] : []),
                                        ...(currentIndex + 4 < rides.length ? [forwardButton] : []),
                                    ],
                                }),
                            ],
                        })
                        .catch(e => {});
                }
            });
            return;
        }

        // Only list the parks by one owner
        if (owner) {
            const newParks = [];
            parks.forEach(park => {
                if (park.name === owner)
                    park.parks.forEach(subpark => {
                        newParks.push(subpark);
                    });
            });

            if (newParks.length === 0)
                return interaction.reply({
                    embeds: [
                        await generateEmbed(
                            color,
                            "Couldn't find any rides with that owner.\n[Powered by Queue-Times.com](https://queue-times.com)"
                        ),
                    ],
                });

            const backId = 'back-list';
            const forwardId = 'forward-list';
            const backButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Back',
                emoji: '◀️',
                customId: backId,
            });
            const forwardButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Next',
                emoji: '▶️',
                customId: forwardId,
            });

            const makeEmbed = async start => {
                const current = newParks.slice(start, start + 4);
                return new EmbedBuilder({
                    color: Colors.Aqua,
                    author: { name: 'Powered by Queue-Times.com', url: 'https://queue-times.com' },
                    timestamp: Date.now(),
                    title: `Park(s) ${start + 1}${newParks.length > 4 ? '-' + (start + 4) : ''}/${
                        newParks.length
                    } owned by ${owner}`,
                    fields: await Promise.all(
                        current.map(async item => {
                            return {
                                name: `${item.name}`,
                                value: `${item.country}`,
                                inline: false,
                            };
                        })
                    ),
                });
            };

            const canFit = newParks.length <= 4;
            const msg = await interaction
                .reply({
                    embeds: [await makeEmbed(0)],
                    ephemeral: false,
                    components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
                })
                .catch(e => console.log(e));
            if (!msg) return;

            const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

            let currentIndex = 0;
            collector.on('collect', async interaction => {
                if (interaction.customId === backId || interaction.customId === forwardId) {
                    interaction.customId === backId ? (currentIndex -= 4) : (currentIndex += 4);
                    await interaction
                        .update({
                            embeds: [await makeEmbed(currentIndex)],
                            components: [
                                new ActionRowBuilder({
                                    components: [
                                        ...(currentIndex ? [backButton] : []),
                                        ...(currentIndex + 4 < newParks.length ? [forwardButton] : []),
                                    ],
                                }),
                            ],
                        })
                        .catch(e => {});
                }
            });

            return;
        }

        // List global parks
        if (!country && !park) {
            const newParks = [];
            parks.forEach(park => {
                park.parks.forEach(subpark => {
                    newParks.push(subpark);
                });
            });

            const backId = 'back-list';
            const forwardId = 'forward-list';
            const backButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Back',
                emoji: '◀️',
                customId: backId,
            });
            const forwardButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: 'Next',
                emoji: '▶️',
                customId: forwardId,
            });

            const makeEmbed = async start => {
                const current = newParks.slice(start, start + 4);
                return new EmbedBuilder({
                    color: Colors.Aqua,
                    author: { name: 'Powered by Queue-Times.com', url: 'https://queue-times.com' },
                    timestamp: Date.now(),
                    title: `Park(s) ${start + 1}${newParks.length > 4 ? '-' + (start + 4) : ''}/${newParks.length}`,
                    fields: await Promise.all(
                        current.map(async item => {
                            return {
                                name: `${item.name}`,
                                value: `${item.country}`,
                                inline: false,
                            };
                        })
                    ),
                });
            };

            const canFit = newParks.length <= 4;
            const msg = await interaction
                .reply({
                    embeds: [await makeEmbed(0)],
                    ephemeral: false,
                    components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
                })
                .catch(e => console.log(e));
            if (!msg) return;

            const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

            let currentIndex = 0;
            collector.on('collect', async interaction => {
                if (interaction.customId === backId || interaction.customId === forwardId) {
                    interaction.customId === backId ? (currentIndex -= 4) : (currentIndex += 4);
                    await interaction
                        .update({
                            embeds: [await makeEmbed(currentIndex)],
                            components: [
                                new ActionRowBuilder({
                                    components: [
                                        ...(currentIndex ? [backButton] : []),
                                        ...(currentIndex + 4 < newParks.length ? [forwardButton] : []),
                                    ],
                                }),
                            ],
                        })
                        .catch(e => {});
                }
            });

            return;
        }
    },
};
