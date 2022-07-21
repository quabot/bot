const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { getColor } = require('../../structures/files/contants');
const canvacord = require('canvacord');

module.exports = {
    name: "messageCreate",
    async execute(message, client) {

        if (message.author.bot) return;

        if (messageArray.find(item => item.userId === message.author.id && item.guildId === message.guild.id)) return;

        let msg = {
            content_length: message.content.length,
            guildId: message.guild.id,
            userId: message.author.id,
            channelId: message.channel.id
        };

        const Level = require('../../structures/schemas/LevelSchema');
                const LevelDatabase = await Level.findOne({
                    guildId: msg.guildId,
                    userId: msg.userId
                }, async (err, config) => {
                    if (err) console.log(err);
                    if (!config) {
                        const newLevel = new Level({
                            guildId: msg.guildId,
                            userId: msg.userId,
                            xp: 0,
                            level: 0,
                            role: 'none',
                        });
                        await newLevel.save();
                    }
                }).clone().catch((err => { }));

                if (!LevelDatabase) return;

                const LevelConfig = require('../../structures/schemas/LevelConfigSchema');
                const LevelConfigDatabase = await LevelConfig.findOne({
                    guildId: msg.guildId,
                }, (err, config) => {
                    if (err) console.log(err);
                    if (!config) {
                        const newLevelConfig = new LevelConfig({
                            guildId: msg.guildId,
                            levelEnabled: true,
                            levelUpChannel: "none",
                            levelUpMessage: "{user} is now level **{level}** with **{xp}** xp!",
                            levelUpEmbed: true,
                            levelExcludedChannels: [],
                            levelExcludedRoles: [],
                            levelCard: false,
                            levelRewards: [],
                        });
                        newLevelConfig.save();
                    }
                }).clone().catch((err => { }));

                if (!LevelConfigDatabase) return;

                if (LevelConfigDatabase.levelEnabled === false) return;
                if (LevelConfigDatabase.levelExcludedChannels.includes(msg.channelId)) return;

                const guild = client.guilds.cache.get(msg.guildId);
                const member = guild.members.cache.get(msg.userId);
                const color = await getColor(msg.guildId) // ! IMPORT THIS!!

                const hasRole = new Promise((resolve, reject) => {
                    LevelConfigDatabase.levelExcludedRoles.forEach(item => {
                        if (member.roles.cache.some(role => role.id === item)) return;
                        resolve();
                    });
                });
                let goForward = true;
                await hasRole.then(() => goForward = false);

                const xp = LevelDatabase.xp;
                const level = LevelDatabase.level;
                const reqXp = level * 400 + 100;

                let randomXp = Math.floor(Math.random() * 10);
                if (msg.content_length < 100) randomXp = Math.floor(Math.random() * 10);
                if (msg.content_length > 100 && msg.content_length < 500) randomXp = Math.floor(Math.random() * 15);
                if (msg.content_length > 500) randomXp = Math.floor(Math.random() * 25);

                if (xp + randomXp >= reqXp) {
                    LevelDatabase.xp = 0;
                    LevelDatabase.level += 1;
                    LevelDatabase.save();

                    const levelChannel = guild.channels.cache.get(`${LevelConfigDatabase.levelUpChannel}`) ? guild.channels.cache.get(`${LevelConfigDatabase.levelUpChannel}`) : guild.channels.cache.get(`${msg.channelId}`);
                    if (!levelChannel) return;

                    let levelMessage = LevelConfigDatabase.levelUpMessage;
                    levelMessage = levelMessage.replace('{level}', `${level + 1}`);
                    levelMessage = levelMessage.replace('{xp}', `0`);
                    levelMessage = levelMessage.replace('{user}', `${member}`);
                    levelMessage = levelMessage.replace('{username}', `${member.user.username}`);
                    levelMessage = levelMessage.replace('{tag}', `${member.user.tag}`);
                    levelMessage = levelMessage.replace('{discriminator}', `${member.user.discriminator}`);
                    levelMessage = levelMessage.replace('{guild}', `${guild.name}`);

                    if (LevelConfigDatabase.levelCard === true) {
                        const rankCard = new canvacord.Rank()
                            .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
                            .setCurrentXP(0)
                            .setRequiredXP(reqXp)
                            .setProgressBar(color, 'COLOR', true)
                            .setUsername(member.user.username)
                            .setLevel(level + 1)
                            .setDiscriminator(member.user.discriminator)
                            .setRank(1, 'none', false)
                        rankCard.build().then(data => {
                            const attactment = new AttachmentBuilder(data, 'levelcard.png')
                            levelChannel.send({ files: [attactment] }).catch((err => { }));
                        });
                    } else {
                        if (LevelConfigDatabase.levelUpEmbed === true) {
                            levelChannel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor(color)
                                        .setTimestamp()
                                        .setDescription(`${levelMessage}`)
                                        .setAuthor({ name: `${member.user.tag} is now level ${level + 1}!`, iconURL: member.user.avatarURL() })
                                        .setThumbnail(member.user.avatarURL())
                                ], content: `${member}`
                            }).catch((err => console.log(err)));
                        } else {
                            levelChannel.send({ content: levelMessage }).catch((err => { }));
                        }
                    }

                } else {
                    LevelDatabase.xp += randomXp;
                    LevelDatabase.save();
                }

                const nextCheck = await LevelConfigDatabase.levelRewards.find(item => item.level === level + 1);
                if (nextCheck) {
                    const levelRole = nextCheck.role.replace(/[<@!&>]/g, '');
                    const prevRoleId = LevelDatabase.role
                    if (member.roles.cache.has(levelRole)) {
                        return
                    } else {
                        member.roles.remove(prevRoleId).catch((err => { }));
                        member.roles.add(levelRole).catch((err => { }));

                        LevelDatabase.role = levelRole;
                        try { await LevelDatabase.save().catch((err => { }));; } catch (e) { return }
                    }
                }
    }
}
