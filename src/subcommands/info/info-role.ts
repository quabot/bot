import { Client, CommandInteraction } from "discord.js";
import { embed } from "../../utils/constants/embeds";

module.exports = {
    command: 'info',
    subcommand: 'role',
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        await interaction.deferReply();

        const role:any = interaction.options.get('role')?.role;

        await interaction.editReply({
            embeds: [
                embed(role?.color || color)
                    .setTitle("Role Info")
                    .setDescription(`
                    **• Name:** ${role?.name}
                    **• Role:** ${role}
                    **• ID:** ${role?.id}
                    **• Mentionable:** ${role?.mentionable ? 'Yes' : 'No'}
                    **• Separated:** ${role?.hoist ? 'Yes' : 'No'}
                    `)
            ]
        });
    }
}