const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');
const { Embed } = require('@constants/embed');
const ApplicationAnswer = require('@schemas/ApplicationAnswer');
const Application = require('@schemas/Application');

module.exports = {
  name: 'application-deny',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.message.embeds[0].footer.text;
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
		if (form.submissions_managers.length !== 0) {
			allowed = false;
			form.submissions_managers.forEach((manager) => {
       				if (interaction.member.roles.find(r => r.id === manager)) allowed = true;
			});
		}
		if (!allowed) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You don\'t have the required roles to deny this application.')
			]
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
		const member = await interaction.guild.members.fetch(answer.userId).catch(() => { });
		if (!member) return;
		await member.send({
			embeds: [
				new Embed('#416683')
					.setDescription(`Your application response for the form **${form.name}** has been denied. You can view your answers [here](https://quabot.net/dashboard/${interaction.guild.id}/user/applications/answers/${id}).`)
			]
		}).catch(() => { });
	},
};
