import { getSuggestConfig, getIdConfig } from '../../../utils';
import { Schemas, Modal, Embed, CustomEmbed, type ModalArgs } from '../../../structures';

export default new Modal().setName('suggest').setCallback(async ({ client, interaction, color }: ModalArgs) => {
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

    const suggestChannel: any = interaction.guild?.channels.cache.get(suggestConfig.channelId);
    if (!suggestChannel)
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

    const idConfig: any = await getIdConfig(client, interaction.guildId ?? '');
    if (!idConfig)
        return await interaction.editReply({
            embeds: [
                new Embed(color).setDescription('We just setup some more documents! Please run the command again.'),
            ],
        });

    const getParsedString = (text: string) => {
        return (
            text
                .replaceAll('{suggestion}', suggestion)
                .replaceAll('{user}', `${interaction.user}`)
                .replaceAll('{avatar}', interaction.user.displayAvatarURL() ?? '')
                .replaceAll('{server}', interaction.guild?.name ?? '')
                .replaceAll('{icon}', interaction.guild?.iconURL() ?? '') || null
        );
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

    // respond with an epic smex msg
    // get the log channel
    // send the msg
});
