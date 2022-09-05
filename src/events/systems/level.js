const { Client, Message, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { getLevelConfig } = require('../../structures/functions/config');
const { Rank } = require('canvacord');
const { levelVariables, isValidHttpUrl } = require('../../structures/functions/strings');

module.exports = {
    event: "messageCreate",
    name: "level",
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client, color) {

        if (!message.guildId) return;
        if (message.author.bot) return;

        const levelConfig = await getLevelConfig(client, message.guildId);
        if (!levelConfig) return;
        if (levelConfig.levelEnabled === false) return;
        if (levelConfig.levelExcludedChannels.includes(message.channel.id)) return;

        for (let i = 0; i < levelConfig.levelExcludedRoles.length; i++) {
            const role = levelConfig.levelExcludedRoles[i]
            if (message.member.roles.cache.has(role)) return;
        }

        const Level = require('../../structures/schemas/LevelSchema');
        const levelDB = await Level.findOne({
            guildId: message.guildId,
            userId: message.author
        }, (err, level) => {
            if (err) console.error(err);
            if (!level) {
                const newLevel = new Level({
                    guildId: message.guildId,
                    userId: message.author.id,
                    xp: 0,
                    level: 0,
                    role: "none"
                });
                newLevel.save()
                    .catch(err => {
                        console.log(err);
                    });
            }
        }).clone().catch(function (err) { });
        if (!levelDB) return;

        const xp = 0;
        const level = levelDB.level + 1;

        const reqXp = level * 400 + 100;
        const rndXp = Math.floor((Math.random() * 10) + message.content.length / 90);

        if (xp + rndXp >= reqXp) {

            levelDB.xp = 0;
            levelDB.level += 1;
            levelDB.save();

            const channel = message.guild.channels.cache.get(`${levelConfig.levelUpChannel}`);
            const levelChannel = channel ? channel : message.channel;

            if (levelConfig.levelCard) {

                const rankCard = new Rank()
                    .setAvatar(message.author.displayAvatarURL({ dynamic: false, format: 'png' }))
                    .setCurrentXP(0)
                    .setRequiredXP(reqXp)
                    .setProgressBar(color, 'COLOR', true)
                    .setUsername(message.author.username)
                    .setLevel(level + 1)
                    .setDiscriminator(message.author.discriminator)
                    .setRank(1, 'none', false)
                rankCard.build().then(data => {
                    const attachment = new AttachmentBuilder(data, 'levelcard.png')
                    levelChannel.send({ files: [attachment], content: `${message.author}` }).catch((e => { }));
                });

            } else if (levelConfig.levelUpBuilder) {

                const embed = new EmbedBuilder().setColor(color);

                if (levelConfig.levelUpEmbed.length === 0) return;

                if (levelConfig.levelUpEmbed[0].title) embed.setTitle(await levelVariables(levelConfig.levelUpEmbed[0].title, message.member, level, xp));
                if (levelConfig.levelUpEmbed[0].description) embed.setDescription(await levelVariables(levelConfig.levelUpEmbed[0].description, message.member, level, xp));
                if (levelConfig.levelUpEmbed[0].color && /^#([0-9A-F]{6}){1,2}$/i.test(levelConfig.levelUpEmbed[0].color)) embed.setColor(levelConfig.levelUpEmbed[0].color);
                if (levelConfig.levelUpEmbed[0].timestamp === true) embed.setTimestamp();
                if (levelConfig.levelUpEmbed[0].image && isValidHttpUrl(await levelVariables(levelConfig.levelUpEmbed[0].image, message.member, level, xp)) && embed.setImage(await levelVariables(levelConfig.levelUpEmbed[0].image, message.member, level, xp)));
                if (levelConfig.levelUpEmbed[0].thumbnail && isValidHttpUrl(await levelVariables(levelConfig.levelUpEmbed[0].thumbnail, message.member, level, xp)) && embed.setThumbnail(await levelVariables(levelConfig.levelUpEmbed[0].thumbnail, message.member, level, xp)));
                if (levelConfig.levelUpEmbed[0].url && isValidHttpUrl(await levelVariables(levelConfig.levelUpEmbed[0].url, message.member, level, xp)) && embed.setURL(await levelVariables(levelConfig.levelUpEmbed[0].url, message.member, level, xp)));

                if (levelConfig.levelUpEmbed[0].authorText) {
                    let icon = null;
                    let url = null;
                    if (isValidHttpUrl(levelConfig.levelUpEmbed[0].authorIcon)) icon = await levelVariables(levelConfig.levelUpEmbed[0].authorIcon, message.member, level, xp);
                    if (isValidHttpUrl(levelConfig.levelUpEmbed[0].authorUrl)) url = await levelVariables(levelConfig.levelUpEmbed[0].authorUrl, message.member, level, xp);
                    embed.setAuthor({ name: await levelVariables(levelConfig.levelUpEmbed[0].authorText, message.member, level, xp), iconURL: icon, url: url });
                }

                if (levelConfig.levelUpEmbed[0].footerText) {
                    let icon = null;
                    if (isValidHttpUrl(levelConfig.levelUpEmbed[0].footerIcon)) icon = await levelVariables(levelConfig.levelUpEmbed[0].footerIcon, member);
                    embed.setFooter({ text: await levelVariables(levelConfig.levelUpEmbed[0].footerText, member), iconURL: icon });
                }

                levelChannel.send({ embeds: [embed], content: `${message.author}` }).catch((e => { }));

            } else {

                levelChannel.send({ content: `${await levelVariables(levelConfig.levelUpMessage, message.member, level, xp)}` }).catch((e => { }));

            }

            const nextCheck = await levelConfig.levelRewards.find(item => item.level === level);
            if (nextCheck) {
                const levelRole = nextCheck.role.replace(/[<@!&>]/g, '');
                const prevRoleId = levelDB.role
                if (message.member.roles.cache.has(levelRole)) {
                    return;
                } else {
                    message.member.roles.remove(prevRoleId).catch((e => { }));
                    message.member.roles.add(levelRole).catch((e => { }));

                    levelDB.role = levelRole;
                    try {
                        await LevelDatabase.save().catch((e => { }));
                    } catch (e) { return; }
                }
            }

        } else {
            levelDB.xp += rndXp;
            levelDB.save();
        }
    }
}