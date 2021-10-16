const discord = require('discord.js');
const DisTube = require('distube');

const Guild = require('../../models/guild');
const colors = require('../../files/colors.json');

const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setDescription("This server is now added to our database.")
    .setColor(colors.COLOR)
const noPlay = new discord.MessageEmbed()
    .setDescription("There is nothing playing!")
    .setColor(colors.COLOR);
const notVC = new discord.MessageEmbed()
    .setDescription("You need to be in a voice channel to play songs!")
    .setColor(colors.COLOR);
const musicOff = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Music is disabled!");
module.exports = {
    name: "queue",
    aliases: ["q"],
    async execute(client, message, args) {

        console.log("Command `queue` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const settings = await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) message.channel.send(errorMain);
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectID(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: config.PREFIX,
                    logChannelID: none,
                    enableLog: false,
                    enableSwearFilter: true,
                    enableMusic: true,
                    enableLevel: true,
                    mutedRoleName: muted,
                    mainRoleName: member
                });

                newGuild.save()
                    .catch(err => message.channel.send(errorMain));

                return message.channel.send(addedDatabase);
            }
        });

        if (settings.enableMusic === "false") return message.channel.send(musicOff);
        if (!message.member.voice.channel) return message.channel.send(notVC);

        let queue = distube.getQueue(message);
        message.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
        ).join("\n"));
        console.log(queue);
        if (!queue) return message.channel.send({ embeds: [noPlay] });

        const song0 = queue.songs[0];
        const song1 = queue.songs[1];
        const song2 = queue.songs[2];
        const song3 = queue.songs[3];
        const song4 = queue.songs[4];
        const song5 = queue.songs[5];
        const song6 = queue.songs[6];
        const song7 = queue.songs[7];
        const song8 = queue.songs[8];
        const song9 = queue.songs[9];

        if (!queue.songs[1]) {
            const a = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [a] });
            return;
        }

        if (!queue.songs[2]) {
            const b = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [b] });
            return;
        }

        if (!queue.songs[3]) {
            const c = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [c] });
            return;
        }

        if (!queue.songs[4]) {
            const d = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [d] });
            return;
        }

        if (!queue.songs[5]) {
            const e = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [e] });
            return;
        }

        if (!queue.songs[6]) {
            const f = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}\n6. ${song5.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [f] });
            return;
        }

        if (!queue.songs[7]) {
            const g = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}\n6. ${song5.name}\n7. ${song6.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [g] });
            return;
        }

        if (!queue.songs[8]) {
            const h = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}\n6. ${song5.name}\n7. ${song6.name}\n8. ${song7.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [h] });
            return;
        }

        if (!queue.songs[9]) {
            const i = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}\n6. ${song5.name}\n7. ${song6.name}\n8. ${song7.name}\n9. ${song8.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [i] });
            return;
        }

        if (!queue.songs[10]) {
            const j = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}\n6. ${song5.name}\n7. ${song6.name}\n8. ${song7.name}\n9. ${song9.name}\n10.${song10.name}`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [j] });
            return;
        }

        if (!queue.songs[11]) {
            const k = new discord.MessageEmbed()
                .setDescription(`1. ${song0.name}\n2. ${song1.name}\n3. ${song2.name}\n4. ${song3.name}\n5. ${song4.name}\n6. ${song5.name}\n7. ${song6.name}\n8. ${song7.name}\n9. ${song9.name}\n10.${song10.name}\nMore songs will be shown soon.`)
                .setColor(colors.COLOR)
                .setTitle("Music Queue")
            message.channel.send({ embeds: [k] });
            return;
        }
    }
}