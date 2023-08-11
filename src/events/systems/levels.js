const { Client, Message, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getLevelConfig } = require('../../utils/configs/levelConfig');
const { AttachmentBuilder } = require('discord.js');
const { getLevel } = require('../../utils/configs/level');
const cooldowns = new Map();
const { CustomEmbed } = require('../../utils/constants/customEmbed');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const Vote = require('../../structures/schemas/Vote');
const { drawCard } = require('../../utils/functions/levelCard');

module.exports = {
	event: "messageCreate",
	name: "levels",
	/**
* @param {Message} message
	* @param {Client} client 
	*/
	async execute(message, client) {
		if (!message.guildId) return;
		try {
			if (message.author.bot) return;
		} catch (e) { }

		if (!cooldowns.has(message.author)) cooldowns.set(message.author, new Collection());
		const current_time = Date.now();
		const time_stamps = cooldowns.get(message.author);
		const cooldown_amount = 30000;

		let no = false;
		if (time_stamps.has(message.author.id)) {
			const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;
			if (current_time < expiration_time) return (no = true);
		}
		if (no) return;

		time_stamps.set(message.author.id, current_time);
		setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);


		const config = await getLevelConfig(message.guildId, client);
		if (!config) return;
		if (!config.enabled) return;
		if (config.excludedChannels.includes(message.channelId)) return;

		const levelDB = await getLevel(message.guildId, message.author.id);

		for (let i = 0; i < config.excludedRoles.length; i++) {
			const role = config.excludedRoles[i];
			if (message.member.roles.cache.has(role)) return;
		}


		const configColor = await getServerConfig(client, message.guildId);
		const color = configColor?.color ?? '#416683';
		if (!color) return;

		const sentFrom = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('sentFrom')
					.setLabel('Sent from server: ' + message.guild?.name ?? 'Unknown')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
			);

		if (!levelDB) return;

		let xp = levelDB.xp;
		let level = levelDB.level;

		const formula = (lvl) => 120 * (lvl ** 2) + 100;
		let reqXp = formula(level);

		let rndXp = Math.floor(Math.random() * 5);
		if (message.content.length > 200) rndXp += 1;
		rndXp = rndXp * config.xpMultiplier ?? 1;

		const vote = await Vote.findOne(
			{ userId: message.author.id },
			(err, config) => {
				if (err) console.log(err);
				if (!config)
					new Vote({
						userId: message.author.id,
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
					.replaceAll('{server.name}', `${message.guild.name}`)
					.replaceAll('{server}', `${message.guild.name}` ?? '')
					.replaceAll('{server.id}', `${message.guildId}` ?? '')
					.replaceAll('{server.icon_url}', `${message.guild.iconURL()}` ?? '')
					.replaceAll('{server.icon}', `${message.guild.icon}` ?? '')
					.replaceAll('{icon}', `${message.guild.iconURL()}` ?? '')
					.replaceAll('{server.owner}', `<@${message.guild.ownerId}>` ?? '')
					.replaceAll('{icon}', `${message.guild.iconURL()}` ?? '') // Deprecated
					.replaceAll('{id}', `${message.author.id}` ?? '') // Deprecated
					.replaceAll('{server.owner_id}', `${message.guild.ownerId}` ?? '')
					.replaceAll('{server.members}', `${message.guild.memberCount}` ?? '')
					.replaceAll('{members}', `${message.guild.memberCount}` ?? '')
					.replaceAll('{user}', `${message.author}` ?? '')
					.replaceAll('{username}', `${message.author.username}` ?? '')
					.replaceAll('{user.name}', `${message.author.username}` ?? '')
					.replaceAll('{user.username}', `${message.author.username}` ?? '')
					.replaceAll('{user.tag}', `${message.author.tag}` ?? '')
					.replaceAll('{tag}', `${message.author.tag}` ?? '') // Deprecated
					.replaceAll('{user.discriminator}', `${message.author.discriminator}` ?? '')
					.replaceAll('{user.displayname}', `${message.author.displayName}` ?? '')
					.replaceAll('{user.id}', `${message.author.id}` ?? '')
					.replaceAll('{user.avatar_url}', `${message.author.avatarURL()}` ?? '')
					.replaceAll('{user.avatar}', `${message.author.avatar}` ?? '')
					.replaceAll('{avatar}', `${message.author.avatarURL()}` ?? '') // Deprecated
					.replaceAll('{user.created_at}', `${message.author.createdAt}` ?? '')
					.replaceAll('{user.joined_at}', `${message.member.joinedAt}` ?? '')
					.replaceAll('{channel}', `${message.channel}` ?? '')
					.replaceAll('{channel.name}', `${message.channel.name}` ?? '')
					.replaceAll('{channel.id}', `${message.channel.id}` ?? '')
					.replaceAll('{level}', `${level}` ?? '')
					.replaceAll('{xp}', `${xp}` ?? '')
					.replaceAll('{required_xp}', `${formula(level)}` ?? '')
					.replaceAll('{color}', `${color}` ?? '')
			};

			if (config.channel !== 'none') {
				let channel = config.channel === 'current' ? message.channel : message.guild.channels.cache.get(`${config.channel}`);
				if (!channel) return;

				const embed = new CustomEmbed(config.message, parse);

				if (config.messageType === 'embed') await channel.send({ embeds: [embed], content: `${parse(config.message.content)}` });
				if (config.messageType === 'text') await channel.send({ content: `${parse(config.messageText)}` });
				if (config.messageType === 'card') {
					const card = await drawCard(message.member, message.member.user, level, xp, formula(level), config.levelCard);
					if (!card) return channel.send('Internal error with card');

					const attachment = new AttachmentBuilder(card, { name: 'level_card.png' });

					if (!config.cardMention) await channel.send({ files: [attachment] });
					if (config.cardMention) await channel.send({ files: [attachment], content: `${message.author}` });
				}
			}

			if (config.dmEnabled) {
				const embed = new CustomEmbed(config.dmMessage, parse);

				if (config.dmType === 'embed') await message.member.send({ embeds: [embed], content: `${parse(config.dmMessage.content)}`, components: [sentFrom] });
				if (config.dmType === 'text') await message.member.send({ content: `${parse(config.dmMessageText)}` });
				if (config.dmType === 'card') {
					const card = await drawCard(message.member, message.member.user, level, xp, formula(level), config.levelCard);
					if (!card) return message.member.send('You leveled up! Sorry, we tried to send a card to the configured channel, but there was an error. Sorry for the inconvinience! All level rewards have been given.');

					if (card) {
						const attachment = new AttachmentBuilder(card, { name: 'level_card.png' });

						if (!config.cardMention) await message.member.send({ files: [attachment] });
						if (config.cardMention) await message.member.send({ files: [attachment], content: `${message.author}` });
					}
				}
			}

			const nextCheck = config.rewards.filter(i => i.level === level) ?? [];
			nextCheck.forEach(async check => {

				const parseCheck = (s) => {
					return s
						.replaceAll('{server.name}', `${message.guild.name}`)
						.replaceAll('{server}', `${message.guild.name}` ?? '')
						.replaceAll('{server.id}', `${message.guildId}` ?? '')
						.replaceAll('{server.icon_url}', `${message.guild.iconURL()}` ?? '')
						.replaceAll('{server.icon}', `${message.guild.icon}` ?? '')
						.replaceAll('{icon}', `${message.guild.iconURL()}` ?? '')
						.replaceAll('{server.owner}', `<@${message.guild.ownerId}>` ?? '')
						.replaceAll('{icon}', `${message.guild.iconURL()}` ?? '') // Deprecated
						.replaceAll('{id}', `${message.author.id}` ?? '') // Deprecated
						.replaceAll('{server.owner_id}', `${message.guild.ownerId}` ?? '')
						.replaceAll('{server.members}', `${message.guild.memberCount}` ?? '')
						.replaceAll('{members}', `${message.guild.memberCount}` ?? '')
						.replaceAll('{user}', `${message.author}` ?? '')
						.replaceAll('{username}', `${message.author.username}` ?? '')
						.replaceAll('{user.name}', `${message.author.username}` ?? '')
						.replaceAll('{user.username}', `${message.author.username}` ?? '')
						.replaceAll('{user.tag}', `${message.author.tag}` ?? '')
						.replaceAll('{tag}', `${message.author.tag}` ?? '') // Deprecated
						.replaceAll('{user.discriminator}', `${message.author.discriminator}` ?? '')
						.replaceAll('{user.displayname}', `${message.author.displayName}` ?? '')
						.replaceAll('{user.id}', `${message.author.id}` ?? '')
						.replaceAll('{user.avatar_url}', `${message.author.avatarURL()}` ?? '')
						.replaceAll('{user.avatar}', `${message.author.avatar}` ?? '')
						.replaceAll('{avatar}', `${message.author.avatarURL()}` ?? '') // Deprecated
						.replaceAll('{user.created_at}', `${message.author.createdAt}` ?? '')
						.replaceAll('{user.joined_at}', `${message.member.joinedAt}` ?? '')
						.replaceAll('{channel}', `${message.channel}` ?? '')
						.replaceAll('{channel.name}', `${message.channel.name}` ?? '')
						.replaceAll('{channel.id}', `${message.channel.id}` ?? '')
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
						const role = message.guild.roles.cache.get(levelDB.role);
						if (role) await message.member.roles.remove(role).catch(() => {});
					}

					const role = message.guild.roles.cache.get(check.role);
					if (role) await message.member.roles.add(role).catch(() => {});
					levelDB.role = check.role;
					await levelDB.save();
				}

				if (config.rewardsMode === 'stack') {
					const role = message.guild.roles.cache.get(check.role);
					if (role) await message.member.roles.add(role).catch(() => {});
					levelDB.role = check.role;
					await levelDB.save();
				}

				if (config.rewardDm === false) return;

				if (config.rewardDmType === 'embed') await message.member.send({ embeds: [new CustomEmbed(config.rewardDmMessage, parseCheck)], content: `${parseCheck(config.rewardDmMessage.content)}`, components: [sentFrom] });
				if (config.rewardDmType === 'text') await message.member.send({ content: `${parseCheck(config.rewardDmMessageText)}`, components: [sentFrom] });
			});

		} else {
			levelDB.xp += rndXp;
			await levelDB.save();
		}
	}
}