import Poll from '@schemas/Poll';
import { getPollConfig } from '@configs/pollConfig';
import { Embed } from '@constants/embed';
import type { ModalArgs } from '@typings/functionArgs';
import { Types } from 'mongoose';

export default {
  name: 'choices-poll',

  async execute({ client, interaction, color }: ModalArgs) {
    const config = await getPollConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Polls are not enabled in this server.')],
      });

    const poll = await Poll.findOne({
      guildId: interaction.guildId,
      interaction: interaction.message?.id,
    })
      .clone()
      .catch(() => {});

    if (!poll)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the poll, this is an error. Please try again.")],
      });

    const options = interaction.components.map(item => `${item.components[0].value}`);

    if (options.length < 2 || options.length > 5)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You need at least two options and a maximum of 5.')],
      });

    poll.options = new Types.Array();
    poll.options.push(...options);
    await poll.save();

    const embed = new Embed(color)
      .setDescription(
        `Click the blue button below this message to enter the details for the poll. When entered, click the gray button to enter the choices.${
          options ? `\n\n**Entered Choices:**${options.map(o => `\n${o}`)}` : ''
        }`,
      )
      .addFields(
        { name: 'Channel', value: `<#${poll.channel}>`, inline: true },
        { name: 'Duration', value: `${poll.duration}`, inline: true },
        { name: 'Choices', value: `${poll.optionsCount}`, inline: true },
        {
          name: 'Role',
          value: `${poll.role ? `${poll.role}` : 'None'}`,
          inline: true,
        },
      );

    if (poll.topic !== 'none')
      embed.addFields({
        name: 'Question',
        value: `${poll.topic}`,
        inline: true,
      });
    if (poll.description !== 'none')
      embed.addFields({
        name: 'Description',
        value: `${poll.description}`,
        inline: true,
      });

    //? Fuck Discord.js SOURCE: https://discord.js.org/#/docs/discord.js/main/class/ModalSubmitInteraction?scrollTo=update
    //@ts-ignore
    await interaction.update({ embeds: [embed] });
  },
};
