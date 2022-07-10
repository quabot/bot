const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager, DiscordAPIError } = require('discord.js');

module.exports = {
    name: "list",
    command: "application",
    async execute(client, interaction, color) {

        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // ! check for perms
        
        // Find the applications
        const Application = require('../../../structures/schemas/ApplicationSchema');
        const ApplicationDatabase = await Application.find({
            guildId: interaction.guild.id
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

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Application results")
            .setTimestamp();

        const backId = 'backMusic'
        const forwardId = 'forwardMusic'
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

        // check if the user has the permissions and remove those from the array beforehand
        const applications = ApplicationDatabase;
        const { channel } = interaction;

        const makeEmbed = async start => {
            const current = applications.slice(start, start + 2);

            return new MessageEmbed({
                color: color,
                title: `Showing applications ${start + 1}-${start + current.length} out of ${applications.length
                    }`,
                fields: await Promise.all(
                    current.map(async (application) => {
                        const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');
                        const ApplicationAnswers = await ApplicationAnswer.find({
                            guildId: interaction.guild.id, 
                            applicationId: application.applicationNumId
        }, (err, application) => {
                            if (err) console.log(err);
                        }).clone().catch((err => { }));

                        let appSinged = ApplicationAnswers.length ? ApplicationAnswers.length : 0;

                        return ({
                            name: `**${application.applicationNumId}** | ${application.applicationName}`,
                            value: `ID: \`${application.applicationTextId}\`\nQuestions: ${application.applicationItems.length}\nApplied to: ${appSinged} times\nTo apply, run \`/apply ${application.applicationTextId}\`.`
                        })
                    })
                )
            });
        }

        const canFit = applications.length <= 2
        const msg = await channel.send({
            embeds: [await makeEmbed(0)],
            components: canFit
                ? []
                : [new MessageActionRow({ components: [forwardButton] })]
        })
        if (canFit) return;

        const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

        let currentIndex = 0
        collector.on('collect', async interaction => {
            interaction.customId === backId ? (currentIndex -= 2) : (currentIndex += 2)
            await interaction.update({
                embeds: [await makeEmbed(currentIndex)],
                components: [
                    new MessageActionRow({
                        components: [
                            ...(currentIndex ? [backButton] : []),
                            ...(currentIndex + 2 < applications.length ? [forwardButton] : [])
                        ]
                    })
                ]
            });
        });

    }
}