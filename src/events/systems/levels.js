const { Client, Message, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getLevelConfig } = require('../../utils/configs/levelConfig');
const { getLevel } = require('../../utils/configs/level');
const cooldowns = new Map();
const { CustomEmbed } = require('../../utils/constants/customEmbed');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const Vote = require('../../structures/schemas/Vote');

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
		const cooldown_amount = 7500;

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
		const color = configColor?.color ?? '#3a5a74';
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
		let reqXp = level * 500 + 100;
		let rndXp = Math.floor(Math.random() * 10 + (Math.min(Math.max(message.content.length / 100, 1), 20)));

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
			levelDB.xp = 0;
			levelDB.level += 1;
			await levelDB.save();

			xp = 0;
			level = level += 1;

			const parse = (s) => {
				return s
					.replaceAll('{tag}', `${message.author.tag}`)
					.replaceAll('{username}', `${message.author.username}` ?? '')
					.replaceAll('{discriminator}', `${message.author.discriminator}` ?? '')
					.replaceAll('{id}', `${message.author.id}` ?? '')
					.replaceAll('{user}', message.author)
					.replaceAll('{color}', `${color}`)
					.replaceAll('{xp}', `${xp}`)
					.replaceAll('{level}', `${level}`)
					.replaceAll('{icon}', message.guild.iconURL() ?? '')
					.replaceAll('{server}', message.guild.name ?? '')
					.replaceAll('{members}', message.guild.memberCount ?? '')
					.replaceAll('{avatar}', `${message.author.displayAvatarURL({ dynamic: true })}`)
			};
			if (config.channel !== 'disabled') {
				const channel = config.channel === 'none' ? message.channel : message.guild.channels.cache.get(`${config.channel}`);
				if (!channel) return;

				const embed = new CustomEmbed(config.message, parse);

				if (config.messageEmbed) channel.send({ embeds: [embed], content: `${parse(config.message.content)}` });
				if (!config.messageEmbed && config.messageEmbed.content) channel.send({ content: `${parse(config.message.contents)}` });
			}

			if (config.dmMessageEnabled) {
				const embed = new CustomEmbed(config.dmMessage, parse);
				if (config.dmMessageEmbed) message.member.send({ embeds: [embed], content: `${parse(config.dmMessage.content)}`, components: [sentFrom] });
				if (!config.dmMessageEmbed && config.dmMessage.content) message.member.send({ content: `${parse(config.dmMessage.content)}`, components: [sentFrom] });
			}


			if (levelDB.role !== 'none') {
				const removeRole = message.guild.roles.cache.get(levelDB.role);
				if (!removeRole) return;
				await message.member.roles.remove(levelDB.role);
			}

			const nextCheck = config.rewards.filter(i => i.level === level) ?? [];
			nextCheck.forEach(async check => {
				if (!check.remove) {
					const role = message.guild.roles.cache.get(check.role);
					if (!role) return;
					await message.member.roles.add(check.role);
				} else {
					const role = message.guild.roles.cache.get(check.role);
					if (!role) return;
					await message.member.roles.add(check.role);

					levelDB.role = check.role;
					await levelDB.save();
				}
			});

		} else {
			levelDB.xp += rndXp;
			await levelDB.save();
		}
	}
}