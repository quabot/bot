import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'level',
  name: 'reset-old-members',

  async execute({ interaction }: CommandArgs) {
    await interaction.deferReply();

    await interaction.editReply('This command has been temporarily disabled, we\'re sorry for the inconvinience.');

  },
};
