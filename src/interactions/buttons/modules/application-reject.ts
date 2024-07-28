import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Embed } from '@constants/embed';
import ApplicationAnswer from '@schemas/ApplicationAnswer';
import Application from '@schemas/ApplicationForm';
import type { ButtonArgs } from '@typings/functionArgs';
import { hasAnyRole } from '@functions/discord';

export default {
  name: 'application-deny',

  async execute({ interaction, color }: ButtonArgs) {
    const id = interaction.message.embeds[0].footer?.text;
    const answer = await ApplicationAnswer.findOne({
      guildId: interaction.guildId,
      response_uuid: id,
    });
    if (!answer)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Couldn't find the application answer.")],
        ephemeral: true,
      });

    if (answer.state !== 'pending')
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('The application has already been approved/denied.')],
        ephemeral: true,
      });

    const form = await Application.findOne({
      guildId: interaction.guildId,
      id: answer.id,
    });
    if (!form)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("Couldn't find the application.")],
        ephemeral: true,
      });

    let allowed = true;
    if (form.submissions_managers!.length !== 0) {
      allowed = hasAnyRole(interaction.member, form.submissions_managers!);
    }
    if (!allowed)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("You don't have the required roles to deny this application.")],
        ephemeral: true,
      });

    await interaction.showModal(
      new ModalBuilder()
        .setTitle('Deny Application Submission')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setLabel('Reason')
              .setPlaceholder("Don't think you're motivated enough.")
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
              .setCustomId('reason'),
          ),
        )
        .setCustomId('application-reject'),
    );

    const modal = await interaction
      .awaitModalSubmit({
        time: 180000,
        filter: i => i.user.id === interaction.user.id,
      })
      .catch(() => null);
    if (!modal) return;
    const reason = modal.fields.getTextInputValue('reason');

    answer.state = 'denied';
    if (reason) answer.reason = reason;
    await answer.save();

    await modal.reply({
      embeds: [new Embed(color).setDescription('Successfully denied the application.')],
      ephemeral: true,
    });

    const member = interaction.guild?.members.cache.get(answer.userId);
    if (!member)
      return await modal.followUp({
        content: "Sorry, this member isn't in this server anymore. We can't give or remove roles.",
      });

    await interaction.message.edit({
      embeds: [
        EmbedBuilder.from(interaction.message.embeds[0]).spliceFields(1, 1, {
          name: 'Status',
          value: 'Denied',
          inline: true,
        }),
      ],
      components: [],
    });

    await member
      .send({
        embeds: [
          new Embed(color).setDescription(
            `Your application response for the form \`${form.name}\` has been denied${
              reason ? ` With reason: \`${reason}\`` : ''
            }! You can view your answers [here](https://quabot.net/dashboard/${interaction.guild
              ?.id}/applications/answers/${id}).`,
          ),
        ],
      })
      .catch(() => {});
  },
};
