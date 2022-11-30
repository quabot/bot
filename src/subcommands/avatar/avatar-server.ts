import type { Guild } from 'discord.js';
import { Subcommand, type SubcommandArgs, Embed } from '../../structures';

export default new Subcommand()
    .setParent('avatar')
    .setName('server')
    .setCallback(async ({ interaction, color }: SubcommandArgs) => {
        const guild = interaction.guild as Guild;

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setTitle(`${guild.name}'s avatar`)
                    .setImage(
                        guild.iconURL({ size: 1024, forceStatic: false }) ??
                            'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png'
                    ),
            ],
        });
    });
