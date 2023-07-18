const {
	ChatInputCommandInteraction,
	Client,
	ColorResolvable
} = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
	parent: 'punishments',
	name: 'view',
	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {ColorResolvable} color
	 */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: false });

		const user = interaction.options.getUser('user');
		const staff = interaction.options.getUser('staff-member');
		const type = interaction.options.getString('type');
		const id = interaction.options.getString('id');

		const Punishment = require('../../../structures/schemas/Punishment');
		const punishments = await Punishment.find({ guildId: interaction.guildId });

		let filtered = punishments;
		if (user) filtered = filtered.filter(punishment => punishment.userId === user.id);
		if (staff) filtered = filtered.filter(punishment => punishment.moderatorId === staff.id);
		if (type) filtered = filtered.filter(punishment => punishment.type === type);
		if (id) filtered = filtered.filter(punishment => punishment.id === id);

		console.log(filtered)
		


		// get punishments

		// display punishments
	}
};
