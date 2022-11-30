import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type Client, type ColorResolvable, type ModalSubmitInteraction } from 'discord.js';
import { getIdConfig } from '../../../utils/configs/getIdConfig';
import { getSuggestConfig } from '../../../utils/configs/getSuggestConfig';
import CustomEmbed from '../../../utils/constants/customEmbed';
import Embed from '../../../utils/constants/embeds';
import Suggestion from '../../../structures/schemas/SuggestSchema';

module.exports = {
    name: 'suggest',
    async execute(client: Client, interaction: ModalSubmitInteraction, color: ColorResolvable) {
        await interaction.deferReply({ ephemeral: true });

        const suggestConfig: any = await getSuggestConfig(client, interaction.guildId || '');
        if (!suggestConfig)
            return await interaction.editReply({
                embeds: [
                    new Embed(color).setDescription(
                        'We are setting up suggestions for first-time use, please run the command again!'
                    ),
                ],
            });

        if (!suggestConfig.enabled)
            return await interaction.editReply({
                embeds: [new Embed(color).setDescription('Suggestions are disabled in this server.')],
            });

        const channel: any = interaction.guild?.channels.cache.get(suggestConfig.channelId);
        if (!channel)
            return await interaction.editReply({
                embeds: [
                    new Embed(color).setDescription(
                        'The suggestions channel has not been configured. This can be done our [dashboard](https://quabot.net).'
                    ),
                ],
            });

        const suggestion = interaction.fields.getTextInputValue('suggestion');
        if (!suggestion)
            return await interaction.editReply({
                embeds: [new Embed(color).setDescription("You didn't enter anything.")],
            });

        const idConfig: any = await getIdConfig(interaction.guildId ?? '');
        if (!idConfig) return await interaction.editReply({
            embeds: [new Embed(color).setDescription("We just setup some more documents! Please run the command again.")],
        });

        const getParsedString = (text: string) => text
            .replaceAll('{suggestion}', suggestion)
            .replaceAll('{user}', `${interaction.user}`)
            .replaceAll('{avatar}', interaction.user.displayAvatarURL() ?? '')
            .replaceAll('{server}', interaction.guild?.name ?? '')
            .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

        const suggestEmbed = new CustomEmbed(suggestConfig.message, getParsedString);

        const msg = await channel.send({ embeds: [suggestEmbed], content: getParsedString(suggestConfig.message.content) })
        await msg.react(suggestConfig.emojiGreen);
        await msg.react(suggestConfig.emojiRed);


        idConfig.suggestId += 1;
        await idConfig.save();

        const newSuggestion = new Suggestion({
            guildId: interaction.guildId,
            id: idConfig.suggestId ?? 0,
            msgId: msg.id,
            suggestion: suggestion,
            status: "pending",
            userId: interaction.user.id,
        });
        await newSuggestion.save();


        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`Successfully created your suggestion! You can check it out [here](${msg.url}). ${suggestConfig.dm && "You will receive a DM when staff has approved/denied your suggestion."}`)
                    .setFooter({ text: `ID: ${idConfig.suggestId}` })
            ]
        });

        if (!suggestConfig.logEnabled) return;
        const logChannel: any = interaction.guild?.channels.cache.get(suggestConfig.logChannelId);
        if (!logChannel) return;

        await logChannel.send({
            embeds: [
                new Embed(suggestConfig.colors.pending)
                    .setTitle("New Suggestion")
                    .addFields(
                        { name: "User", value: `${interaction.user}`, inline: true },
                        { name: "State", value: `Pending`, inline: true },
                        { name: "ID", value: `${idConfig.suggestId}`, inline: true },
                        { name: "Message", value: `[Click to jump](${msg.url})`, inline: true },
                        { name: "Suggestion", value: `${suggestion}`, inline: false },
                    )
            ], components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('suggestion-approve')
                            .setLabel('Approve')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('suggestion-deny')
                            .setLabel('Deny')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('suggestion-delete')
                            .setLabel('Delete')
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        });
    },
};
