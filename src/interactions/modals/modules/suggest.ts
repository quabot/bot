import { getSuggestConfig, getIdConfig } from '../../../utils';
import { Schemas, Modal, Embed, CustomEmbed, type ModalArgs } from '../../../structures';

export default new Modal().setName('suggest').setCallback(async ({ client, interaction, color }: ModalArgs) => {
    const suggestConfig: any = await getSuggestConfig(client, interaction.guildId || '');
    const suggestChannel: any = interaction.guild?.channels.cache.get(suggestConfig.channelId);
    const suggestion = interaction.fields.getTextInputValue('suggestion');
    const idConfig: any = await getIdConfig(client, interaction.guildId ?? '');

    const getParsedString = (text: string | undefined) => {
        const result = text
            ?.replaceAll('{suggestion}', suggestion)
            .replaceAll('{user}', `${interaction.user}`)
            .replaceAll('{avatar}', interaction.user.displayAvatarURL() ?? '')
            .replaceAll('{server}', interaction.guild?.name ?? '')
            .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

        if (result?.length === 0 || !result) {
            return null;
        }

        return result;
    };

    const suggestEmbed = new CustomEmbed(suggestConfig.message, getParsedString);

    const msg = await suggestChannel.send({
        embeds: [suggestEmbed],
        content: getParsedString(suggestConfig.message.content),
    });
    await msg.react(suggestConfig.emojiGreen);
    await msg.react(suggestConfig.emojiRed);

    idConfig.suggestId += 1;
    client.cache.set(`${interaction.guildId}-id-config`, await idConfig.save());

    const newSuggestion = new Schemas.Suggest({
        guildId: interaction.guildId,
        id: idConfig.suggestId ?? 0,
        msgId: msg.id,
        suggestion: suggestion,
        status: 'pending',
        userId: interaction.user.id,
    });
    await newSuggestion.save();

    await interaction.editReply({
        embeds: [
            new Embed(color)
                .setDescription(`Successfully created your suggestion! You can check it out [here](${msg.url}).`)
                .setFooter({ text: `ID: ${idConfig.suggestId}` }),
        ],
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
