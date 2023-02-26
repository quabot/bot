const { SlashCommandBuilder, Client, CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test-command')
        .setDescription('Test anything lol')
        .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        interaction.reply('Sending message...');

        interaction.channel.send({
            embeds: [
                new Embed(color)
                    .setTitle('Reaction Roles test')
                    .setDescription(':red_circle: Red\n:green_circle: Green\n:blue_circle: Blue')
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('reactionrole')
                        .setMinValues(1)
                        .setMaxValues(3)
                        .setPlaceholder('Select your role(s)...')
                        .addOptions(
                            {
                                label: 'Red',
                                value: '1079409728867795024',
                                description: 'Get the @Red role.',
                                default: true
                            },
                            {
                                label: 'Green',
                                value: '1079409749776400456',
                                description: 'Get the green reaction role'
                            },
                            {
                            
                                label: 'Blue',
                                value: '1079409779409166426',
                                description: 'Get the @Blue role.'
                            }
                        )
                )
            ]
        });
    }
}