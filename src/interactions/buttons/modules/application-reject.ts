import { EmbedBuilder, GuildMemberRoleManager, Snowflake } from 'discord.js';
import { Embed } from '@constants/embed';
import ApplicationAnswer from '@schemas/ApplicationAnswer';
import Application from '@schemas/Application';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'application-deny',

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
      allowed = false;
      form.submissions_managers!.forEach(manager => {
        if (!interaction.member) return;

        const hasRole =
          'cache' in interaction.member.roles
            ? (interaction.member.roles as GuildMemberRoleManager).cache.get
            : (interaction.member.roles as Snowflake[]).includes;

        if (hasRole(manager)) allowed = true;
      });
    }
    if (!allowed)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("You don't have the required roles to deny this application.")],
      });

    answer.state = 'denied';
    await answer.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Successfully denied the application.')],
    });

    await interaction.message.edit({
      embeds: [
        EmbedBuilder.from(interaction.message.embeds[0]).addFields({
          name: 'Status',
          value: 'Rejected',
          inline: true,
        }),
      ],
      components: [],
    });

    const member = await interaction.guild?.members.fetch(answer.userId).catch(() => {});
    if (!member) return await interaction.editReply({ content: "Sorry, this member isn't in this server anymore." });

    await member
      .send({
        embeds: [
          new Embed('#416683').setDescription(
            `Your application response for the form **${form.name}** has been denied. You can view your answers [here](https://quabot.net/dashboard/${interaction.guild?.id}/user/applications/answers/${id}).`,
          ),
        ],
      })
      .catch(() => {});
  },
};
