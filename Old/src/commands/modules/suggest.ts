import {
    TextInputStyle,
    TextInputBuilder,
    Client,
    CommandInteraction,
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from 'discord.js';
import { getSuggestConfig } from '../../utils/configs/getSuggestConfig';
import Embed from '../../utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder().setName('suggest').setDescription('Leave a suggestion.').setDMPermission(false),
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        const suggestConfig: any = await getSuggestConfig(client, interaction.guildId ?? '');
        if (!suggestConfig)
            return await interaction.reply({
                embeds: [
                    new Embed(color).setDescription(
                        'We are setting up suggestions for first-time use, please run the command again!'
                    ),
                ],
            });

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
    },
};
