// ! add permissions for subcmds (answers, approve & deny)
// ! Required perms: ADMIN

const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager, DiscordAPIError } = require('discord.js');


// ! Required perms: ADMIN
module.exports = {
    name: "answers",
    command: "application",
    async execute(client, interaction, color) {

        const appId = interaction.options.getString("application_id");
        const responseUser = interaction.options.getUser("response_user");

        // Find the applications
        const Application = require('../../../structures/schemas/ApplicationSchema');
        const ApplicationDatabase = await Application.findOne({
            guildId: interaction.guild.id,
            applicationTextId: appId,
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

        const questions = ApplicationDatabase.applicationItems;
        const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');
        const foundUserList = await ApplicationAnswer.find({
            applicationUserId: responseUser.id,
            guildId: interaction.guild.id,
            applicationTextId: appId
        }).clone().catch((err => { }));
        if (!foundUserList || foundUserList.length === 0) return interaction.reply({content:'Couldn\'t find any responses by that user for that application'});

        const backId = 'backMusic'
        const forwardId = 'forwardMusic'
        const approveThisId = 'approveThis'
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

        const { user, channel } = interaction;

        const makeEmbed = async start => {
            const current = foundUserList.slice(start, start + 1)[0];
            current.applicationAnswers.sort((a, b) => {
                return a.question - b.question;
            });

            console.log(ApplicationDatabase);

            return new MessageEmbed({
                title: `Showing response ${start + 1} out of ${foundUserList.length} for ${responseUser.tag}`,
                color: color,
                fields: await Promise.all(
                    current.applicationAnswers.map(async (answer, id) => ({
                        name: `${ApplicationDatabase.applicationItems[answer.question].question}`,
                        value: `${answer.value}`
                    }))
                )
            });
        }

        const canFit = foundUserList.length <= 1
        const msg = await channel.send({
            embeds: [await makeEmbed(0)],
            components: canFit
                ? []
                : [new MessageActionRow({ components: [forwardButton] })]
        }).catch((err => { }));
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0
        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 1) : (currentIndex += 1)
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new MessageActionRow({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 1 < foundUserList.length ? [forwardButton] : []),
                        ]
                    })
                ]
            }).catch((err => { }));
        });
    }
}