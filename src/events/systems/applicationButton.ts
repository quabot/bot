import { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, type Interaction } from 'discord.js';
import { Embed } from '@constants/embed';
import { getServerConfig } from '@configs/serverConfig';
import Application from '@schemas/ApplicationForm';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.InteractionCreate,
  name: 'applicationButton',

  async execute({ client }: EventArgs, interaction: Interaction) {
    if (!interaction.isButton() || !interaction.guildId) return;

    const id = interaction.customId;

    if (!id.startsWith('applications-fill-')) return;

    await interaction.deferReply({ ephemeral: true });

    const serverConfig = await getServerConfig(client, interaction.guildId);
    if (!serverConfig)
      return await interaction.editReply({
        embeds: [
          new Embed('#416683').setDescription(
            "We're still setting up some documents for first-time use. Please run the command again.",
          ),
        ],
      });
    const color = serverConfig.color ?? '#416683';

    const appid = id.slice(18, id.length);
    if (!appid)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The application form couldn't be found.")],
      });

    const application = await Application.findOne({
      id: appid,
      guildId: interaction.guildId,
    });
    if (!application)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("The application form couldn't be found.")],
      });

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(`You can apply for **${application.name}** by clicking the button below.`),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel('Apply')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://quabot.net/dashboard/${interaction.guildId}/user/applications/form/${application.id}`),
        ),
      ],
    });
  },
};
