const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');
const { getLevelConfig } = require('../../../utils/configs/levelConfig');
const { getUserGame } = require('../../../utils/configs/userGame');
const Level = require('../../../structures/schemas/Level');

module.exports = {
	parent: 'profile',
	name: 'view',
	/**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {
		await interaction.deferReply();

		const user = interaction.options.getMember('user') ?? interaction.member;
		if (!user) return await interaction.editReply('Couldn\'t find a user.');

		const levelConfig = await getLevelConfig(interaction.guildId, client);
		if (!levelConfig) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});

		const levelUser = await Level.findOne({ guildId: interaction.guildId, userId: user.id });

		const userSchema = await getUserGame(user.id);
		if (!userSchema) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});

		const embed = new Embed(color)
			.setTitle(`${user.user.username}'s profile`)
			.setDescription(userSchema.bio)
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: 'Birthday', value: `${userSchema.birthday.configured ? `${userSchema.birthday.day}/${userSchema.birthday.month}/${userSchema.birthday.year}` : 'Unset'}`, inline: true }
			);

		if (levelConfig.enabled) embed.addFields(
			{ name: 'Level', value: `${levelUser.level ?? 0}`, inline: true },
			{ name: 'Level XP', value: `${levelUser.xp ?? 0}`, inline: true }
		);

		embed.addFields(
			{ name: 'Username', value: `${user.user.username}`, inline: true },
			{ name: 'Displayname', value: `${user.globalName ?? 'None'}`, inline: true },
			// { name: 'Discriminator', value: `${user.user.discriminator ?? 'None'}`, inline: true },
			{ name: 'Joined server on', value: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>`, inline: true },
			{ name: 'Account created on', value: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>`, inline: true });


		await interaction.editReply({
			embeds: [embed]
		});
	},
};
