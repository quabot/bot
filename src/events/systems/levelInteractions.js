const { Client, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { getLevelConfig } = require('../../utils/configs/levelConfig');
const { AttachmentBuilder } = require('discord.js');
const { getLevel } = require('../../utils/configs/level');
const cooldowns = new Map();
const { CustomEmbed } = require('../../utils/constants/customEmbed');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const Vote = require('../../structures/schemas/Vote');
const { drawCard } = require('../../utils/functions/levelCard');

module.exports = {
	event: Events.InteractionCreate,
	name: "levelInteractions",
	/**
	* @param {import('discord.js').Interaction} interaction
	* @param {Client} client 
	*/
	async execute(interaction, client) {
		if (!interaction.guildId) return;
		try {
			if (interaction.user.bot) return;
		} catch (e) { }

		if (!cooldowns.has(interaction.user)) cooldowns.set(interaction.user, new Collection());
		const current_time = Date.now();
		const time_stamps = cooldowns.get(interaction.user);
		const cooldown_amount = 1; //!change

		let no = false;
		if (time_stamps.has(interaction.user.id)) {
			const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;
			if (current_time < expiration_time) return (no = true);
		}
		if (no) return;

		time_stamps.set(interaction.user.id, current_time);
		setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);


		const config = await getLevelConfig(interaction.guildId, client);
		if (!config) return;
		if (!config.enabled) return;
		if (!config.commandXp) return;
			if (config.excludedChannels.includes(interaction.channelId)) return;

		const levelDB = await getLevel(interaction.guildId, interaction.user.id);

		for (let i = 0; i < config.excludedRoles.length; i++) {
			const role = config.excludedRoles[i];
			if (interaction.member.roles.cache.has(role)) return;
		}


		const configColor = await getServerConfig(client, interaction.guildId);
		const color = configColor?.color ?? '#416683';
		if (!color) return;

		const sentFrom = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('sentFrom')
					.setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
			);

		if (!levelDB) return;

		let xp = levelDB.xp;
		let level = levelDB.level;

		const formula = (lvl) => 120 * (lvl ** 2) + 100;
		let reqXp = formula(level);

		let rndXp = Math.floor(Math.random() * 3);
		rndXp = rndXp * config.commandXpMultiplier ?? 1;

		const vote = await Vote.findOne(
			{ userId: interaction.user.id },
			(err, config) => {
				if (err) console.log(err);
				if (!config)
					new Vote({
						userId: interaction.user.id,
						lastVote: `0`
					}).save();
			}
		).clone().catch(() => { });
		if (vote) {
			if (parseInt(vote.lastVote) + 43200000 > new Date().getTime()) rndXp = rndXp * 1.5;
		}


		if (xp + rndXp >= reqXp) {
			levelDB.xp += rndXp;
			levelDB.level += 1;
			await levelDB.save();

			xp = xp += rndXp;
			level = level += 1;

			const parse = (s) => {
				return s
					.replaceAll('{server.name}', `${interaction.guild.name}`)
					.replaceAll('{server}', `${interaction.guild.name}` ?? '')
					.replaceAll('{server.id}', `${interaction.guildId}` ?? '')
					.replaceAll('{server.icon_url}', `${interaction.guild.iconURL()}` ?? '')
					.replaceAll('{server.icon}', `${interaction.guild.icon}` ?? '')
					.replaceAll('{icon}', `${interaction.guild.iconURL()}` ?? '')
					.replaceAll('{server.owner}', `<@${interaction.guild.ownerId}>` ?? '')
					.replaceAll('{icon}', `${interaction.guild.iconURL()}` ?? '') // Deprecated
					.replaceAll('{id}', `${interaction.user.id}` ?? '') // Deprecated
					.replaceAll('{server.owner_id}', `${interaction.guild.ownerId}` ?? '')
					.replaceAll('{server.members}', `${interaction.guild.memberCount}` ?? '')
					.replaceAll('{members}', `${interaction.guild.memberCount}` ?? '')
					.replaceAll('{user}', `${interaction.user}` ?? '')
					.replaceAll('{username}', `${interaction.user.username}` ?? '')
					.replaceAll('{user.name}', `${interaction.user.username}` ?? '')
					.replaceAll('{user.username}', `${interaction.user.username}` ?? '')
					.replaceAll('{user.tag}', `${interaction.user.tag}` ?? '')
					.replaceAll('{tag}', `${interaction.user.tag}` ?? '') // Deprecated
					.replaceAll('{user.discriminator}', `${interaction.user.discriminator}` ?? '')
					.replaceAll('{user.displayname}', `${interaction.user.displayName}` ?? '')
					.replaceAll('{user.id}', `${interaction.user.id}` ?? '')
					.replaceAll('{user.avatar_url}', `${interaction.user.avatarURL()}` ?? '')
					.replaceAll('{user.avatar}', `${interaction.user.avatar}` ?? '')
					.replaceAll('{avatar}', `${interaction.user.avatarURL()}` ?? '') // Deprecated
					.replaceAll('{user.created_at}', `${interaction.user.createdAt}` ?? '')
					.replaceAll('{user.joined_at}', `${interaction.member.joinedAt}` ?? '')
					.replaceAll('{channel}', `${interaction.channel}` ?? '')
					.replaceAll('{channel.name}', `${interaction.channel.name}` ?? '')
					.replaceAll('{channel.id}', `${interaction.channel.id}` ?? '')
					.replaceAll('{level}', `${level}` ?? '')
					.replaceAll('{xp}', `${xp}` ?? '')
					.replaceAll('{required_xp}', `${formula(level)}` ?? '')
					.replaceAll('{color}', `${color}` ?? '')
			};

			if (config.channel !== 'none') {
				let channel = config.channel === 'current' ? interaction.channel : interaction.guild.channels.cache.get(`${config.channel}`);
				if (!channel) return;

				const embed = new CustomEmbed(config.message, parse);

				if (config.messageType === 'embed') await channel.send({ embeds: [embed], content: `${parse(config.message.content)}` });
				if (config.messageType === 'text') await channel.send({ content: `${parse(config.messageText)}` });
				if (config.messageType === 'card') {
					const card = await drawCard(interaction.member, interaction.member.user, level, xp, formula(level), config.levelCard);
					if (!card) return channel.send('Internal error with card');

					const attachment = new AttachmentBuilder(card, { name: 'level_card.png' });

					if (!config.cardMention) await channel.send({ files: [attachment] });
					if (config.cardMention) await channel.send({ files: [attachment], content: `${interaction.user}` });
				}
			}

			if (config.dmEnabled) {
				const embed = new CustomEmbed(config.dmMessage, parse);

				if (config.dmType === 'embed') await interaction.member.send({ embeds: [embed], content: `${parse(config.dmMessage.content)}`, components: [sentFrom] });
				if (config.dmType === 'text') await interaction.member.send({ content: `${parse(config.dmMessageText)}` });
				if (config.dmType === 'card') {
					const card = await drawCard(interaction.member, interaction.member.user, level, xp, formula(level), config.levelCard);
					if (!card) return interaction.member.send('You leveled up! Sorry, we tried to send a card to the configured channel, but there was an error. Sorry for the inconvinience! All level rewards have been given.');

					if (card) {
						const attachment = new AttachmentBuilder(card, { name: 'level_card.png' });

						if (!config.cardMention) await interaction.member.send({ files: [attachment] });
						if (config.cardMention) await interaction.member.send({ files: [attachment], content: `${interaction.user}` });
					}
				}
			}

			const nextCheck = config.rewards.filter(i => i.level === level) ?? [];
			nextCheck.forEach(async check => {

				const parseCheck = (s) => {
					return s
						.replaceAll('{server.name}', `${interaction.guild.name}`)
						.replaceAll('{server}', `${interaction.guild.name}` ?? '')
						.replaceAll('{server.id}', `${interaction.guildId}` ?? '')
						.replaceAll('{server.icon_url}', `${interaction.guild.iconURL()}` ?? '')
						.replaceAll('{server.icon}', `${interaction.guild.icon}` ?? '')
						.replaceAll('{icon}', `${interaction.guild.iconURL()}` ?? '')
						.replaceAll('{server.owner}', `<@${interaction.guild.ownerId}>` ?? '')
						.replaceAll('{icon}', `${interaction.guild.iconURL()}` ?? '') // Deprecated
						.replaceAll('{id}', `${interaction.user.id}` ?? '') // Deprecated
						.replaceAll('{server.owner_id}', `${interaction.guild.ownerId}` ?? '')
						.replaceAll('{server.members}', `${interaction.guild.memberCount}` ?? '')
						.replaceAll('{members}', `${interaction.guild.memberCount}` ?? '')
						.replaceAll('{user}', `${interaction.user}` ?? '')
						.replaceAll('{username}', `${interaction.user.username}` ?? '')
						.replaceAll('{user.name}', `${interaction.user.username}` ?? '')
						.replaceAll('{user.username}', `${interaction.user.username}` ?? '')
						.replaceAll('{user.tag}', `${interaction.user.tag}` ?? '')
						.replaceAll('{tag}', `${interaction.user.tag}` ?? '') // Deprecated
						.replaceAll('{user.discriminator}', `${interaction.user.discriminator}` ?? '')
						.replaceAll('{user.displayname}', `${interaction.user.displayName}` ?? '')
						.replaceAll('{user.id}', `${interaction.user.id}` ?? '')
						.replaceAll('{user.avatar_url}', `${interaction.user.avatarURL()}` ?? '')
						.replaceAll('{user.avatar}', `${interaction.user.avatar}` ?? '')
						.replaceAll('{avatar}', `${interaction.user.avatarURL()}` ?? '') // Deprecated
						.replaceAll('{user.created_at}', `${interaction.user.createdAt}` ?? '')
						.replaceAll('{user.joined_at}', `${interaction.member.joinedAt}` ?? '')
						.replaceAll('{channel}', `${interaction.channel}` ?? '')
						.replaceAll('{channel.name}', `${interaction.channel.name}` ?? '')
						.replaceAll('{channel.id}', `${interaction.channel.id}` ?? '')
						.replaceAll('{level}', `${level}` ?? '')
						.replaceAll('{xp}', `${xp}` ?? '')
						.replaceAll('{required_xp}', `${formula(level)}` ?? '')
						.replaceAll('{color}', `${color}` ?? '')
						.replaceAll('{role}', `<@&${check.role}>` ?? '')
						.replaceAll('{reward}', `<@&${check.role}>` ?? '')
						.replaceAll('{required_level}', `${check.level}` ?? '')
						.replaceAll('{reward.level}', `${check.level}` ?? '')
						.replaceAll('{reward.role}', `<@&${check.role}>` ?? '')
				};

				if (config.rewardsMode === 'replace') {
					if (levelDB.role !== 'none') {
						const role = interaction.guild.roles.cache.get(levelDB.role);
						if (role) await interaction.member.roles.remove(role);
					}

					const role = interaction.guild.roles.cache.get(check.role);
					if (role) await interaction.member.roles.add(role);
					levelDB.role = check.role;
					await levelDB.save();
				}

				if (config.rewardsMode === 'stack') {
					const role = interaction.guild.roles.cache.get(check.role);
					if (role) await interaction.member.roles.add(role);
					levelDB.role = check.role;
					await levelDB.save();
				}

				if (config.rewardDm === false) return;

				if (config.rewardDmType === 'embed') await interaction.member.send({ embeds: [new CustomEmbed(config.rewardDmMessage, parseCheck)], content: `${parseCheck(config.rewardDmMessage.content)}`, components: [sentFrom] });
				if (config.rewardDmType === 'text') await interaction.member.send({ content: `${parseCheck(config.rewardDmMessageText)}`, components: [sentFrom] });
			});

		} else {
			levelDB.xp += rndXp;
			await levelDB.save();
		}
	}
}