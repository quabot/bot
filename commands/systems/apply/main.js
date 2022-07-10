const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager } = require('discord.js');

module.exports = {
    name: "apply",
    description: 'Staff applications.',
    permissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
    options: [
        {
            name: "id",
            description: "Application text ID",
            type: "STRING",
            required: true
        }
    ],
    async execute(client, interaction, color) {

        const id = interaction.options.getString("id");

        const Application = require('../../../structures/schemas/ApplicationSchema');
        const ApplicationDatabase = await Application.findOne({
            guildId: interaction.guild.id,
            applicationTextId: id,
        }, (err, application) => {
            if (err) console.log(err);
            if (!application) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                            .setColor(color)
                    ], ephemeral: true
                }).catch((err => { }));
            }
        }).clone().catch((err => { }));

        if (!ApplicationDatabase) {
            return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`Could not find that application. Please create one on our [dashboard](https://dashboard.quabot.net)`)
                        .setColor(color)
                ], ephemeral: true
            }).catch((err => { }));
        }

        const backId = 'backMusic'
        const forwardId = 'forwardMusic'
        const doQuestionId = 'doQuestionApplicaiton'
        const backButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Back',
            emoji: '⬅️',
            customId: backId
        });
        const forwardButton = new MessageButton({
            style: 'SECONDARY',
            label: 'Forward',
            emoji: '➡️',
            customId: forwardId
        });
        const doQuestionButton = new MessageButton({
            style: 'PRIMARY',
            label: 'Answer this question',
            customId: doQuestionId
        })

        // check if the user has the permissions and remove those from the array beforehand
        const questions = ApplicationDatabase.applicationItems;
        console.log(ApplicationDatabase)
        console.log(questions)
        const { channel } = interaction;

        const makeEmbed = async start => {
            const current = questions.slice(start, start + 1);

            return new MessageEmbed({
                color: color,
                title: `Showing questions ${start + 1}-${start + current.length} out of ${questions.length
                    }`,
                fields: await Promise.all(
                    current.map(async (question) => {
                        return ({
                            name: `**Question ${questions[current+1]}** (${question.type})`,
                            value: `${question.question}`
                        })
                    })
                )
            });
        }

        const canFit = questions.length <= 1
        const msg = await channel.send({
            embeds: [await makeEmbed(0)],
            components: canFit
                ? [new MessageActionRow({ components: [doQuestionButton ] })]
                : [new MessageActionRow({ components: [forwardButton, doQuestionButton] })]
        })
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0
        collector.on('collect', async interaction => {
            if (interaction.customId === doQuestionId) {
                interaction.reply("DO SMTH")
                console.log(questions[currentIndex])
            }
            interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new MessageActionRow({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 1 < questions.length ? [forwardButton] : [])
                        ]
                    })
                ]
            });
        });
        
    }
}