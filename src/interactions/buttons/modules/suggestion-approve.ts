import { type Client, ButtonInteraction, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import Suggest from '../../../structures/schemas/SuggestSchema';
import { getSuggestConfig } from "../../../utils/configs/getSuggestConfig";
import CustomEmbed from "../../../utils/constants/customEmbed";
import Embed from "../../../utils/constants/embeds";

module.exports = {
    name: 'suggestion-approve',
    async execute(_client: Client, interaction: ButtonInteraction, color: ColorResolvable) {
        await interaction.deferReply({ ephemeral: true });

        const suggestionId = parseInt(interaction.message.embeds[0].fields[2].value);
        const suggestion = await Suggest.findOne({
            guildId: interaction.guildId,
            id: suggestionId
        });
        if (!suggestion) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find the suggestion.')
            ]
        });

        const config: any = await getSuggestConfig(_client, interaction.guildId);
        if (!config) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('We just created a new document! Could you please run that command again?')
            ]
        });
        if (!config.enabled) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Suggestions are disabled in this server!')
            ]
        });

        const channel: any = interaction.guild.channels.cache.get(config.channelId);
        if (!channel) return await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription('Couldn\'t find the suggestions channel.')
            ]
        });

        await channel.messages
            .fetch(suggestion.msgId)
            .then(async (message: any) => {
                if (!message)
                    return interaction.editReply({
                        embeds: [
                            new Embed(color)
                                .setDescription('Couldn\'t find the suggestion! Are you sure it wasn\'t deleted?')
                        ]
                    });

                    // edit msg to be approved

                await interaction.editReply({
                    embeds: [
                        new Embed(color)
                            .setDescription('Suggestion approved.')
                    ]
                });

                suggestion.status = 'approved';
                await suggestion.save();

                message.edit({
                    embeds:[
                        EmbedBuilder.from(message.embeds[0])
                            .setColor(config.colors.approve )
                            .setFooter({ text: 'This suggestion was approved!' })
                    ]
                });
                
                await interaction.message.edit({
                    embeds: [
                        new Embed(config.colors.approve)
                            .setTitle("New Suggestion")
                            .addFields(
                                { name: "User", value: `${interaction.message.embeds[0].fields[0].value}`, inline: true },
                                { name: "State", value: `Approved`, inline: true },
                                { name: "Approved By", value: `${interaction.user}`, inline: true },
                                { name: "ID", value: `${suggestion.id}`, inline: true },
                                { name: "Message", value: `[Click to jump](${interaction.message.embeds[0].fields[3].value})`, inline: true },
                                { name: "Suggestion", value: `${suggestion}`, inline: false },
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
                        .replaceAll('{state}', 'approved')
                        .replaceAll('{color}', ` ${config.colors.approve}`)
                        .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

                const embed = new CustomEmbed(config.dmMessage, parseString);
                user.send({ embeds: [embed], content: parseString(config.dmMessage.content) });
            });
    },
};