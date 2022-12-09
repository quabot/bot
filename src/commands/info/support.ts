import { Command, Embed, type CommandArgs } from '../../structures';

export default new Command()
    .setName('support')
    .setDescription('Get an invite to our support server.')
    .setDMPermission(false)
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${interaction.guild?.iconURL()}`)
                    .setTitle(`QuaBot Support`)
                    .setDescription(
                        `Join our support server [here](https://discord.gg/kxKHuy47Eq) for fun, events, questions and suggestions!`
                    ),
            ],
        });
    });
