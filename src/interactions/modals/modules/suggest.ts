import { type Client, type ColorResolvable, type ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
import { getSuggestConfig } from '../../../utils/configs/getSuggestConfig';
import Embed from '../../../utils/constants/embeds';

module.exports = {
    name: 'suggest',
    async execute(client: Client, interaction: ModalSubmitInteraction, color: ColorResolvable) {
        await interaction.deferReply();

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

        const suggestChannel = interaction.guild?.channels.cache.get(suggestConfig.channelId);
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

        const suggestEmbed = new EmbedBuilder();
        const getParsedString = (text: any) => {
            let newText = text;

            newText = newText.replaceAll('{suggestion}', suggestion);
            newText = newText.replaceAll('{user}', interaction.user);
            newText = newText.replaceAll('{avatar}', interaction.user.displayAvatarURL());
            newText = newText.replaceAll('{server}', interaction.guild?.name);
            newText = newText.replaceAll('{icon}', interaction.guild?.iconURL());

            return newText;
        };
        
        if (suggestConfig.message.title)
            suggestEmbed.setTitle(`${getParsedString(suggestConfig.message.title)}`);
        if (suggestConfig.message.timestamp) suggestEmbed.setTimestamp();
        if (suggestConfig.message.footer) {
            let text = null;
            let iconURL = null;
            if (suggestConfig.message.footer.text) text = suggestConfig.message.footer.text;
            if (suggestConfig.message.footer.icon) iconURL = suggestConfig.message.footer.icon;
            //@ts-ignore
            suggestEmbed.setFooter({ text, iconURL });
        }
        if (suggestConfig.message.author) {
             let name = null;
             let url = null;
             let iconURL = null;
             if (suggestConfig.message.author.text) name = suggestConfig.message.author.text;
             if (suggestConfig.message.author.url) url = suggestConfig.message.author.url;
             if (suggestConfig.message.author.icon) iconURL = suggestConfig.message.author.icon;
             //@ts-ignore
             suggestEmbed.setAuthor({ name, iconURL, url });
        }
        if (suggestConfig.message.description) suggestEmbed.setDescription(suggestConfig.message.description);
        if (suggestConfig.message.fields) suggestEmbed.addFields(suggestConfig.message.fields);
        if (suggestConfig.message.url) suggestEmbed.setURL(suggestConfig.message.url);
        if (suggestConfig.message.thumbnail) suggestEmbed.setThumbnail(suggestConfig.message.thumbnail);
        if (suggestConfig.message.image) suggestEmbed.setImage(suggestConfig.message.image);
        if (suggestConfig.message.color) suggestEmbed.setColor(suggestConfig.message.color);
        
        await interaction.editReply({ embeds: [suggestEmbed], content: suggestConfig.message.content });

        // get the embed for the channel
        // get the colors
        // get the emojis
        // send the msg
        // create the suggestion document
        // get the log channel
        // send the msg
    },
};
