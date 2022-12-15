import { type Client, ButtonInteraction, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, ModalBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Suggest from '../../../structures/schemas/SuggestSchema';
import { getSuggestConfig } from "../../../utils/configs/getSuggestConfig";
import CustomEmbed from "../../../utils/constants/customEmbed";
import Embed from "../../../utils/constants/embeds";

module.exports = {
    name: 'suggestion-deny',
    async execute(_client: Client, interaction: ButtonInteraction, color: ColorResolvable) {

        const suggestionId = parseInt(interaction.message.embeds[0].fields[2].value);
        const suggestion = await Suggest.findOne({
            guildId: interaction.guildId,
            id: suggestionId
        });
        if (!suggestion) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find the suggestion.')
            ], ephemeral: true
        });

        const config: any = await getSuggestConfig(_client, interaction.guildId);
        if (!config) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('We just created a new document! Could you please run that command again?')
            ], ephemeral: true
        });
        if (!config.enabled) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Suggestions are disabled in this server!')
            ], ephemeral: true
        });

        const channel: any = interaction.guild.channels.cache.get(config.channelId);
        if (!channel) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find the suggestions channel.')
            ], ephemeral: true
        });

        await channel.messages
            .fetch(suggestion.msgId)
            .then(async (message: any) => {
                if (!message)
                    return interaction.reply({
                        embeds: [
                            new Embed(color)
                                .setDescription('Couldn\'t find the suggestion! Are you sure it wasn\'t deleted?')
                        ], ephemeral: true
                    });

                let rejectionReason = "No reason specified";
                const modal = new ModalBuilder()
                    .setTitle('Reason for rejecting')
                    .setCustomId('reject-suggest')
                    .addComponents(
                        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                            new TextInputBuilder()
                                .setCustomId('reason')
                                .setLabel('Rejection Reason')
                                .setMaxLength(500)
                                .setMinLength(2)
                                .setPlaceholder('Leave a rejection reason...')
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                    );
                await interaction.showModal(modal);

                const modalResponse: any = await interaction
                    .awaitModalSubmit({
                        time: 60000,
                        filter: i => i.user.id === interaction.user.id,
                    }).catch(() => { });


                if (modalResponse && modalResponse.customId === 'reject-suggest') rejectionReason = modalResponse.fields.getTextInputValue('reason');

                await modalResponse.reply({
                    embeds: [
                        new Embed(color)
                            .setDescription('Suggestion denied.')
                    ], ephemeral: true
                });

                suggestion.status = 'denied';
                await suggestion.save();

                message.edit({
                    embeds: [
                        EmbedBuilder.from(message.embeds[0])
                            .setColor(config.colors.deny)
                            .addFields(
                                { name: "Denied by", value: `${interaction.user}`, inline: true },
                                { name: "Reason", value: `${rejectionReason}`, inline: true }
                            )
                            .setFooter({ text: 'This suggestion was denied!' })
                    ]
                });

                await interaction.message.edit({
                    embeds: [
                        new Embed(config.colors.deny)
                            .setTitle("New Suggestion")
                            .addFields(
                                { name: "User", value: `${interaction.message.embeds[0].fields[0].value}`, inline: true },
                                { name: "State", value: `Denied`, inline: true },
                                { name: "Denied By", value: `${interaction.user}`, inline: true },
                                { name: "ID", value: `${suggestion.id}`, inline: true },
                                { name: "Message", value: `${interaction.message.embeds[0].fields[3].value}`, inline: true },
                                { name: "Deny reason", value: `${rejectionReason}`, inline: true },
                                { name: "Suggestion", value: `${suggestion.suggestion}`, inline: false },
                            )
                    ], components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('suggestion-approve')
                                    .setLabel('Approve')
                                    .setDisabled(true)
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setDisabled(true)
                                    .setCustomId('suggestion-deny')
                                    .setLabel('Deny')
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setDisabled(true)
                                    .setCustomId('suggestion-delete')
                                    .setLabel('Delete')
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    ]
                })

                if (!config.dm) return;

                const user = interaction.guild?.members.cache.get(`${suggestion.userId}`);
                const parseString = (text: string) =>
                    text
                        .replaceAll('{suggestion}', suggestion.suggestion)
                        .replaceAll('{user}', `${user}`)
                        .replaceAll('{avatar}', user.displayAvatarURL() ?? '')
                        .replaceAll('{server}', interaction.guild?.name ?? '')
                        .replaceAll('{staff}', `${interaction.user ?? ''}`)
                        .replaceAll('{state}', 'denied')
                        .replaceAll('{color}', ` ${config.colors.deny}`)
                        .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

                const embed = new CustomEmbed(config.dmMessage, parseString)
                    .addFields(
                        { name: "Denied by", value: `${interaction.user}`, inline: true },
                        { name: "Reason", value: `${rejectionReason}`, inline: true }
                    );
                user.send({ embeds: [embed], content: parseString(config.dmMessage.content) });
            });
    },
};