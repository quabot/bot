import { Command, Embed, type CommandArgs } from '../../structures';

export default new Command()
    .setName('members')
    .setDescription('Get the amount of people in the server.')
    .setDMPermission(false)
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(
                        interaction.guild?.iconURL() ??
                            'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png'
                    )
                    .setTitle(`${interaction.guild?.name}`)
                    .setDescription(`${interaction.guild?.memberCount}`),
            ],
        });
    });
