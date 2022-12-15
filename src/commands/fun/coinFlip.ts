import { Command, Embed, type CommandArgs } from '../../structures';

export default new Command()
    .setName('coinflip')
    .setDescription('Flip a coin.')
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        await interaction.editReply({
            embeds: [new Embed(color).setTitle(['🪙 Heads!', '🪙 Tails!'][Math.floor(Math.random() * 2)])],
        });
    });
