const Levels = require('discord.js-leveling');
const discord = require('discord.js');
const { COLOR_MAIN } = require('../../files/colors.json');

const { error, added } = require('../../embeds/general');

module.exports = {
    name: "profile",
    description: "View your profile.",
    options: [
        {
            name: "user",
            description: "User to get the leaderboard of.",
            type: "USER",
            required: false,
        }
    ],
    async execute(client, interaction) {

        const user = interaction.options.getMember('user');
        if (!user) {
            try {
                const UserEco = require('../../schemas/UserEcoSchema');
                const UserEcoDatabase = await UserEco.findOne({
                    userId: interaction.user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: interaction.user.id,
                            outWallet: 250,
                            walletSize: 500,
                            commandsUsed: 0,
                            inWallet: 250,
                            lastUsed: "none"
                        });
                        newEco.save()
                            .catch(err => {
                                console.log(err);
                                interaction.channel.send({ embeds: [error] });
                            });
                        const addedEmbed = new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] });
                    }
                }).clone().catch(function (err) { console.log(err) });

                const User = require('../../schemas/UserSchema');
                const userDatabase = await User.findOne({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                }, (err, user) => {
                    if (err) console.error(err);
                    if (!user) {
                        const newUser = new User({
                            userId: interaction.user.id,
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            typeScore: 0,
                            kickCount: 0,
                            banCount: 0,
                            warnCount: 0,
                            muteCount: 0,
                            afk: true,
                            afkStatus: "none",
                            bio: "none",
                        });
                        newUser.save()
                            .catch(err => {
                                console.log(err);
                                interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                            });
                    }
                }).clone().catch(function (err) { console.log(err) });

                let bio = userDatabase.bio;
                if (!bio) bio = "No bio set!";

                var walletSize = Math.round(UserEcoDatabase.walletSize);
                var inWallet = Math.round(UserEcoDatabase.inWallet);
                var outWallet = Math.round(UserEcoDatabase.outWallet);
                var net = Math.round(UserEcoDatabase.outWallet + UserEcoDatabase.inWallet) // add the shop stuff;

                const target = interaction.user;
                const user = await Levels.fetch(target.id, interaction.guild.id);
                const a = UserEcoDatabase.commandsUsed;

                const profile = new discord.MessageEmbed()
                    .setTitle(`${interaction.user.username}'s Profile`)
                    .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                    .addField("Money", `In Bank: \`⑩ ${inWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}\`
                    Bank Size: \`⑩ ${walletSize.toLocaleString('us-US', { minimumFractionDigits: 0 })}\`
                    Pocket: \`⑩ ${outWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}\`
                    Net Worth: \`⑩ ${net.toLocaleString('us-US', { minimumFractionDigits: 0 })}\``)
                    .addField("Bio", `${bio}`)
                    .addField("Level Rank", `${user.level}`, true)
                    .addField("Level XP", `${user.xp}/${Levels.xpFor(user.level + 1)}`, true)
                    .addField("Misc", `\`${a.toLocaleString('us-US', { minimumFractionDigits: 0 })}\` commands used`)
                    .setColor(COLOR_MAIN)
                    .setTimestamp()
                interaction.reply({ embeds: [profile] }).catch(e => console.log("Failed to DM"));
            } catch (e) {
                console.log(e);
                return;
            }
        } else {
            try {
                const UserEco = require('../../schemas/UserEcoSchema');
                const UserEcoDatabase = await UserEco.findOne({
                    userId: user.user.id
                }, (err, usereco) => {
                    if (err) console.error(err);
                    if (!usereco) {
                        const newEco = new UserEco({
                            userId: user.user.id,
                            outWallet: 250,
                            walletSize: 500,
                            commandsUsed: 0,
                            inWallet: 250,
                            lastUsed: "none"
                        });
                        newEco.save()
                            .catch(err => {
                                console.log(err);
                                interaction.channel.send({ embeds: [error] });
                            });
                        const addedEmbed = new discord.MessageEmbed().setColor(COLOR_MAIN).setDescription("You can use economy commands now.")
                        return interaction.channel.send({ embeds: [addedEmbed] });
                    }
                }).clone().catch(function (err) { console.log(err) });

                const User = require('../../schemas/UserSchema');
                const userDatabase = await User.findOne({
                    userId: user.id,
                    guildId: interaction.guild.id,
                }, (err, user) => {
                    if (err) console.error(err);
                    if (!user) {
                        const newUser = new User({
                            userId: user.id,
                            guildId: interaction.guild.id,
                            guildName: interaction.guild.name,
                            typeScore: 0,
                            kickCount: 0,
                            banCount: 0,
                            warnCount: 0,
                            muteCount: 0,
                            afk: true,
                            afkStatus: "none",
                            bio: "none",
                        });
                        newUser.save()
                            .catch(err => {
                                console.log(err);
                                interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
                            });
                    }
                }).clone().catch(function (err) { console.log(err) });

                let bio = userDatabase.bio;
                if (!bio) bio = "No bio set!";
                var walletSize = Math.round(UserEcoDatabase.walletSize);
                var inWallet = Math.round(UserEcoDatabase.inWallet);
                var outWallet = Math.round(UserEcoDatabase.outWallet);
                var net = Math.round(UserEcoDatabase.outWallet + UserEcoDatabase.inWallet);

                const target = interaction.options.getMember('user');
                const userLevel = await Levels.fetch(target.id, interaction.guild.id);
                const a = UserEcoDatabase.commandsUsed;

                const profile = new discord.MessageEmbed()
                    .setTitle(`${user.user.username}'s Profile`)
                    .setThumbnail(user.user.avatarURL({ dynamic: true }))
                    .addField("Money", `In Bank: \`⑩ ${inWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}\`
                    Bank Size: \`⑩ ${walletSize.toLocaleString('us-US', { minimumFractionDigits: 0 })}\`
                    Pocket: \`⑩ ${outWallet.toLocaleString('us-US', { minimumFractionDigits: 0 })}\`
                    Net Worth: \`⑩ ${net.toLocaleString('us-US', { minimumFractionDigits: 0 })}\``)
                    .addField("Bio", `${bio}`)
                    .addField("Level Rank", `${userLevel.level}`, true)
                    .addField("Level XP", `${userLevel.xp}/${Levels.xpFor(userLevel.level + 1)}`, true)
                    .addField("Misc", `\`${a.toLocaleString('us-US', { minimumFractionDigits: 0 })}\` commands used`)
                    .setColor(COLOR_MAIN)
                    .setTimestamp()
                interaction.reply({ embeds: [profile] }).catch(e => console.log("Failed to DM"));
            } catch (e) {
                console.log(e);
                return;
            }
        }

    }
}