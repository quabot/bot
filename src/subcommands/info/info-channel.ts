import { Client, Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embed } from "../../utils/constants/embeds";

module.exports = {
    command: 'info',
    subcommand: 'channel',
    async execute(client: Client, interaction: CommandInteraction, color: any) {

        interaction.reply('channel');
        
    }
}