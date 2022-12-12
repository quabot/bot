import {
    TextInputStyle,
    TextInputBuilder,
    ModalBuilder,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from 'discord.js';
import { Command, Embed, type CommandArgs } from '../../structures';
import { getSuggestConfig } from '../../utils';

export default new Command()
    .setName('suggest')
    .setDescription('Leave a suggestion.')
    .setDMPermission(false)
    .setDeferReply(false)
    .setCallback(async ({ client, interaction, color }: CommandArgs) => {
        let suggestConfig: any = await getSuggestConfig(client, interaction.guildId ?? '');

        if (suggestConfig === null) suggestConfig = await getSuggestConfig(client, interaction.guildId ?? '');

        if (!suggestConfig.enabled)
            return await interaction.reply({
                embeds: [new Embed(color).setDescription('Suggestions are disabled in this server.')],
            });

        const suggestChannel = interaction.guild?.channels.cache.get(suggestConfig.channelId);
        if (!suggestChannel)
            return await interaction.reply({
                embeds: [
                    new Embed(color).setDescription(
                        'The suggestions channel has not been configured. This can be done our [dashboard](https://quabot.net).'
                    ),
                ],
            });

        const modal = new ModalBuilder()
            .setTitle('Leave a suggestion')
            .setCustomId('suggest')
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                    new TextInputBuilder()
                        .setCustomId('suggestion')
                        .setLabel('Suggestion')
                        .setMaxLength(800)
                        .setMinLength(2)
                        .setPlaceholder('Leave a suggestion...')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )
            );

        await interaction.showModal(modal);
    });
