import { Command, Embed, type CommandArgs } from '../../structures';

export default new Command()
    .setName('dashboard')
    .setDescription('Get the link of our dashboard.')
    .setDMPermission(false)
    .setCallback(async ({ client, interaction, color }: CommandArgs) => {
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${client.user?.displayAvatarURL()}`)
                    .setTitle(`QuaBot Dashboard`)
                    .setDescription(`You can find our dashboard [here](https://quabot.net)!`),
            ],
        });
    });
