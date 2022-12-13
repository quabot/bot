import { Subcommand, type CommandArgs, Embed } from '../../structures';

export default new Subcommand()
    .setParent('avatar')
    .setName('user')
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        const user = interaction.options.getUser('user') ?? interaction.user;

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setImage(user.displayAvatarURL({ size: 1024, forceStatic: false }))
                    .setTitle(`${user.tag}'s avatar`),
            ],
        });
    });
