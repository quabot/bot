import { EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import ApplicationAnswer from '@schemas/ApplicationAnswer';
import Application from '@schemas/Application';
import type { ButtonArgs } from '@typings/functionArgs';
import { hasAnyRole, hasRolePerms } from '@functions/discord';

export default {
  name: 'application-accept',

  async execute({ interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.message.embeds[0].footer?.text;
    const answer = await ApplicationAnswer.findOne({
      guildId: interaction.guildId,
      response_uuid: id,
    });
    if (!answer)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the application answer.")],
      });

    if (answer.state !== 'pending')
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The application has already been approved/denied.')],
      });

    const form = await Application.findOne({
      guildId: interaction.guildId,
      id: answer.id,
    });
    if (!form)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the application.")],
      });

    let allowed = true;
    if (form.submissions_managers!.length !== 0) {
      allowed = hasAnyRole(interaction.member, form.submissions_managers!);
    }
    if (!allowed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("You don't have the required roles to approve this application.")],
      });

    answer.state = 'approved';
    await answer.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Successfully approved the application.')],
    });

    const member = interaction.guild?.members.cache.get(answer.userId);
    if (!member) return await interaction.editReply({ content: "Sorry, this member isn't in this server anymore." });

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
        EmbedBuilder.from(interaction.message.embeds[0]).addFields({
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
            `Your application response for the form **${form.name}** has been accepted! Some roles may have been added/removed. You can view your answers [here](https://quabot.net/dashboard/${interaction.guild?.id}/user/applications/answers/${id}).`,
          ),
        ],
      })
      .catch(() => {});
  },
};
