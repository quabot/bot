import { Client, EmbedBuilder, ModalSubmitInteraction } from "discord.js"
import { getSuggestConfig } from "../../../utils/configs/getSuggestConfig";
import { embed } from "../../../utils/constants/embeds";

module.exports = {
    id: 'suggest',
    async execute(client: Client, interaction: ModalSubmitInteraction, color: any) {
        await interaction.deferReply();

        const suggestConfig:any = await getSuggestConfig(client, interaction.guildId || '');
        if (!suggestConfig) return await interaction.editReply({
            embeds: [
                embed(color)
                    .setDescription("We are setting up suggestions for first-time use, please run the command again!")
            ]
        });

        if (!suggestConfig.enabled) return await interaction.editReply({
            embeds: [
                embed(color)
                    .setDescription("Suggestions are disabled in this server.")
            ]
        });

        const suggestChannel = interaction.guild?.channels.cache.get(suggestConfig.channelId);
        if (!suggestChannel) return await interaction.editReply({
            embeds: [
                embed(color)
                    .setDescription("The suggestions channel has not been configured. This can be done our [dashboard](https://quabot.net).")
            ]
        });

        const suggestion = interaction.fields.getTextInputValue('suggestion');
        if (!suggestion) return await interaction.editReply({
            embeds: [
                embed(color)
                    .setDescription("You didn't enter anything.")
            ]
        });

        const suggestEmbed = new EmbedBuilder();
        const getParsedString = (text: any) => {
            let newText = text;

            newText = newText.replaceAll("{suggestion}", suggestion);
            newText = newText.replaceAll("{user}", interaction.user);
            newText = newText.replaceAll("{avatar}", interaction.user.displayAvatarURL());
            newText = newText.replaceAll("{server}", interaction.guild?.name);
            newText = newText.replaceAll("{icon}", interaction.guild?.iconURL());

            return newText;
        }

        if (suggestConfig.message.title !== "") suggestEmbed.setTitle(`${getParsedString(suggestConfig.message.title)}`);
        if (suggestConfig.message.timestamp) suggestEmbed.setTimestamp();
        if (suggestConfig.message.footer) {
            let url = null;
            let text = null; // finish the embed thing, then code cleanup and pass in the everything for a general thing maker
        }


        await interaction.editReply({ embeds: [suggestEmbed], content: suggestConfig.message.content });

        // get the embed for the channel
        // get the colors
        // get the emojis
        // send the msg
        // create the suggestion document
        // get the log channel
        // send the msg
    }
}