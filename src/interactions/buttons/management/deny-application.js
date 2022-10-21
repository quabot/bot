const {
    ButtonBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonStyle,
    EmbedBuilder,
    Colors,
} = require('discord.js');
const { getApplicationConfig } = require('../../../structures/functions/config');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    id: 'deny-application',
    /**
     * @param {import("discord.js").Interaction} interaction
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true }).catch(e => {});

        const applicationConfig = await getApplicationConfig(client, interaction.guildId);

        const uuid = interaction.message.embeds[0].footer.text;

        const ApplicationAnswer = require('../../../structures/schemas/ApplicationAnswerSchema');
        const found = await ApplicationAnswer.findOne({
            responseUuid: uuid,
            guildId: interaction.guildId,
        });
        if (!found)
            return await interaction
                .editReply("Couldn't find that application, the response appears to be deleted from our database.")
                .catch(e => {});

        found.applicationState = 'DENIED';
        found.save();

        interaction.message
            .edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0])
                        .setColor(Colors.Red)
                        .setDescription(
                            `Application ID: ${found.applicationId}\nSubmitted by: <@${found.userId}>\nState: **DENIED**\n\nView the answers [on our dashboard](https://dashboard.quabot.net) (discord support coming soon).`
                        ),
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('approve-application')
                            .setLabel('Approve')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('deny-application')
                            .setLabel('Deny')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Danger)
                    ),
                ],
            })
            .catch(e => {});

        const user = interaction.guild.members.cache.get(found.userId);
        if (user)
            user.send({
                embeds: [
                    await generateEmbed(
                        color,
                        'Your application in ' +
                            interaction.guild.name +
                            ' was denied! You applied for `' +
                            found.applicationId +
                            '`.'
                    ),
                ],
            }).catch(e => {});

        await interaction
            .editReply({
                embeds: [await generateEmbed(color, 'Denied the application.')],
            })
            .catch(e => {});
    },
};
