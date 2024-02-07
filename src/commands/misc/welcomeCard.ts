import { drawWelcomeCard } from '@functions/cards';
import type { CommandArgs } from '@typings/functionArgs';
import { AttachmentBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
export default {
  data: new SlashCommandBuilder().setName('welcome-card').setDescription('Get the server or user icon.'),

  async execute({ interaction }: CommandArgs) {
    const card = await drawWelcomeCard(interaction.member as GuildMember, {
      bg: {
        type: 'image',
        color: '#2B2D31',
        image: 'amsterdam',
        image_overlay: 'rgba(0,0,0,0.6)',
      },
      border: {
        enabled: false,
        color: '#ff0099',
        size: 20,
      },
      welcomeTxt: {
        enabled: true,
        value: 'No vars yet',
        color: '#fff',
        weight: 'SemiBold',
      },
      memberTxt: {
        enabled: false,
        color: '#444',
        value: 'Boldie',
        weight: 'Bold',
      },
      customTxt: {
        enabled: true,
        color: '#f09',
        value: 'Third line option, custom color',
        weight: 'Normal',
      },
      pfp: {
        rounded: true,
      },
    });

    const attachment = new AttachmentBuilder(card, {
      name: 'welcome_card.png',
    });

    await interaction.reply({ files: [attachment] });
  },
};
