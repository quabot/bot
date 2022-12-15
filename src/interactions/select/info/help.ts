import { SelectMenu, type SelectMenuArgs } from '../../../structures';

export default new SelectMenu().setName('help').setCallback(async ({ interaction }: SelectMenuArgs) => {
    await interaction.editReply('need help? go to hell!');
});
