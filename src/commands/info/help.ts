import { ActionRowBuilder, Client, CommandInteraction, SelectMenuBuilder, SlashCommandBuilder } from 'discord.js';
import Embed from '../../_utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of all the bot commands.')
        .setDMPermission(false),
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        // TODO: ADD [module] argument support, add the embeds (only when all modules done)

        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${client.user?.displayAvatarURL()}`)
                    .setTitle(`QuaBot Commands`)
                    .setDescription(
                        `With the menu below this message you can select a category to get a list of commands within the selected category.`
                    ),
            ],
            components: [
                new ActionRowBuilder<SelectMenuBuilder>().addComponents(
                    new SelectMenuBuilder().setCustomId('help').setPlaceholder('Select a category').addOptions(
                        {
                            label: '💬 Info',
                            description:
                                'Info commands will give you information about the bot, a server and loads of other things.',
                            value: 'help_info',
                        },
                        {
                            label: '😂 Fun',
                            description: 'Fun commands will give you fun games to play.',
                            value: 'help_fun',
                        },
                        {
                            label: '👍 Misc',
                            description: 'Misc commands allow you to visualize colors, translate and much more.',
                            value: 'help_misc',
                        },
                        {
                            label: '🔒 Management',
                            description: 'Manage your server with polls, locking channels and more.',
                            value: 'help_management',
                        },
                        {
                            label: '🔨 Moderation',
                            description: 'Ban and punish users for breaking the rules.',
                            value: 'help_moderation',
                        },
                        {
                            label: '📊 Module',
                            description: 'Leave a suggestion or create a ticket, module commands have it all.',
                            value: 'help_module',
                        }
                    )
                ),
            ],
        });
    },
};
