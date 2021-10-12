const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const mongoose = require('mongoose');

module.exports = async (client, guild, message) => {
    console.log('Quabot has joined a server.');
    
    // const settings = await Guild.findOne({
    //     guildID: guild.id
    // }, (err, guild) => {
    //     if (err) console.log("!!!!!ERROR");
    //     if (!guild) {
    //         const newGuild = new Guild({
    //             _id: mongoose.Types.ObjectId(),
    //             guildID: guild.id,
    //             prefix: config.PREFIX,
    //             logChannelID: String,
    //             enableLog: false,
    //             enableSwearFilter: true,
    //             enableMusic: true,
    //             enableLevel: true,
    //         });

    //         newGuild.save()
    //             .catch(err => console.log("errorMain"));
    //     }
    // });
};