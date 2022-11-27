import { type Client, ButtonInteraction, ColorResolvable } from "discord.js";
import Suggest from '../../../structures/schemas/SuggestSchema';
import Embed from "../../../utils/constants/embeds";

module.exports = {
    name: 'suggestion-delete',
    async execute(_client: Client, interaction: ButtonInteraction, color: ColorResolvable) {
        await interaction.deferReply({ ephemeral: true });

        const suggestionId = parseInt(interaction.message.embeds[0].fields[2].value);
        const suggestion = await Suggest.findOne({
            guildId: interaction.guildId,
            id: suggestionId
        });
        
        if (!suggestion) return await interaction.editReply({
            embeds:[
                new Embed(color)
                    .setDescription('Couldn\'t find the suggestion.')
            ]
        });

        // delete and edit log msg
    },
};