const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: "tes",
    description: 'tsst command',
    async execute(client, interaction, color) {
        try {

            const backId = 'back'
            const forwardId = 'forward'
            const backButton = new MessageButton({
                style: 'SECONDARY',
                label: 'Back',
                emoji: '⬅️',
                customId: backId
            })
            const forwardButton = new MessageButton({
                style: 'SECONDARY',
                label: 'Forward',
                emoji: '➡️',
                customId: forwardId
            })

            const { user, channel } = interaction
            const guilds = [...client.guilds.cache.values()]

            const generateEmbed = async start => {
                const current = guilds.slice(start, start + 10)

                return new MessageEmbed({
                    title: `Showing guilds ${start + 1}-${start + current.length} out of ${guilds.length
                        }`,
                    fields: await Promise.all(
                        current.map(async guild => ({
                            name: guild.name,
                            value: `**ID:** ${guild.id}\n**Owner:** ${(await guild.fetchOwner()).user.tag}`
                        }))
                    )
                })
            }

            const canFitOnOnePage = guilds.length <= 10
            const embedMessage = await channel.send({
                embeds: [await generateEmbed(0)],
                components: canFitOnOnePage
                    ? []
                    : [new MessageActionRow({ components: [forwardButton] })]
            })
            if (canFitOnOnePage) return

            const collector = embedMessage.createMessageComponentCollector({
                filter: ({ user }) => user.id === user.id
            })

            let currentIndex = 0
            collector.on('collect', async interaction => {
                interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)
                await interaction.update({
                    embeds: [await generateEmbed(currentIndex)],
                    components: [
                        new MessageActionRow({
                            components: [
                                ...(currentIndex ? [backButton] : []),
                                ...(currentIndex + 10 < guilds.length ? [forwardButton] : [])
                            ]
                        })
                    ]
                })
            })

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}