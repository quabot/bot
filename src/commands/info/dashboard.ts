import { Command, Embed, type CommandArgs } from '../../structures';

export default new Command()
    .setName('dashboard')
    .setDescription('Get the link of our dashboard.')
    .setDMPermission(false)
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(
                        `https://cdn.discordapp.com/icons/1007810461347086357/a08a18c53574cadc45aa5825e1decd9c.webp?size=240`
                    )
                    .setTitle(`QuaBot Dashboard`)
                    .setDescription(`You can find our dashboard [here](https://quabot.net)!`),
            ],
        });
    });
