import { Command, Embed, type CommandArgs } from '../../structures';

export default new Command()
    .setName('invite')
    .setDescription('Get an invite to add quabot to your own server.')
    .setDMPermission(false)
    .setCallback(async ({ client, interaction, color }: CommandArgs) => {
        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${client.user?.displayAvatarURL()}`)
                    .setTitle(`Add QuaBot`)
                    .setDescription(
                        `Do you like QuaBot and do you want to try it out for yourself? Invite it [here](https://discord.com/oauth2/authorize?client_id=995243562134409296&permissions=274878426206&redirect_uri=https%3A%2F%2Fapi.quabot.net%2Fauth&response_type=code&scope=bot%20applications.commands%20guilds%20identify)! This link will also redirect your to our [dashboard](https://quabot.net).`
                    ),
            ],
        });
    });
