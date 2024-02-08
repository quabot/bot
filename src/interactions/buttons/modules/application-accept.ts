import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Embed } from '@constants/embed';
import ApplicationAnswer from '@schemas/ApplicationAnswer';
import Application from '@schemas/Application';
import type { ButtonArgs } from '@typings/functionArgs';
import { hasAnyRole, hasRolePerms } from '@functions/discord';

export default {
  name: 'application-accept',

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
        embeds: [new Embed(color).setDescription("You don't have the required roles to approve this application.")],
        ephemeral: true,
      });

    await interaction.showModal(
      new ModalBuilder()
        .setTitle('Approve Application Submission')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setLabel('Reason')
              .setPlaceholder('You have a lot of experience!')
              .setStyle(TextInputStyle.Short)
              .setRequired(false)
              .setCustomId('reason'),
          ),
        )
        .setCustomId('application-accept'),
    );

    const modal = await interaction
      .awaitModalSubmit({
        time: 180000,
        filter: i => i.user.id === interaction.user.id,
      })
      .catch(() => null);
    if (!modal) return;
    const reason = modal.fields.getTextInputValue('reason');

    answer.state = 'approved';
    if (reason) answer.reason = reason;
    await answer.save();

    await modal.reply({
      embeds: [new Embed(color).setDescription('Successfully approved the application.')],
      ephemeral: true,
    });

    const member = interaction.guild?.members.cache.get(answer.userId);
    if (!member)
      return await modal.followUp({
        content: "Sorry, this member isn't in this server anymore. We can't give or remove roles.",
      });

    if (form.add_roles) {
      form.add_roles.forEach(async role => {
        const roleToAdd = interaction.guild?.roles.cache.get(role);
        if (hasRolePerms(roleToAdd)) member?.roles.add(roleToAdd!);
      });
    }

    if (form.remove_roles) {
      form.remove_roles.forEach(async role => {
        const roleToAdd = interaction.guild?.roles.cache.get(role);
        if (hasRolePerms(roleToAdd)) member.roles.remove(roleToAdd!);
      });
    }

    await interaction.message.edit({
      embeds: [
        EmbedBuilder.from(interaction.message.embeds[0]).spliceFields(1, 1, {
          name: 'Status',
          value: 'Approved',
          inline: true,
        }),
      ],
      components: [],
    });

    await member
      .send({
        embeds: [
          new Embed('#416683').setDescription(
            `Your application response for the form \`${form.name}\` has been accepted${
              reason ? ` With reason: \`${reason}\`` : ''
            }! Some roles may have been added/removed. You can view your answers [here](https://quabot.net/dashboard/${interaction
              .guild?.id}/user/applications/answers/${id}).`,
          ),
        ],
      })
      .catch(() => {});
  },
};
