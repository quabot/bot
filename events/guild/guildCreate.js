const Guild = require('../../models/guild');
const config = require('../../files/config.json');
const mongoose = require('mongoose');

module.exports = {
    name: "emojiDelete",
    /**
     * @param {Client} client 
     */
    async execute(emoji, client) {
        console.log(" ");
        console.log("QUABOT ADDED")
        console.log(`QuaBot has been added to: `)

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
    }
};