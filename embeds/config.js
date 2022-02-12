const { COLOR_MAIN } = require('../files/colors.json');
const { MessageEmbed } = require('discord.js');

const noPermission = new MessageEmbed()
    .setColor(COLOR_MAIN)
    .setTimestamp()
    .setTitle(":x: No permission!")
    .setDescription("To change server settings you need `ADMINISTRATOR` permissions.")
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.net/) - [Discord](https://discord.gg/Nwu9DNjYa9)")
    .setThumbnail("https://i.imgur.com/jgdQUul.png");

const timedOut = new MessageEmbed()
    .setTitle("❌ Timed Out!")
    .setDescription("You took too long to respond.")
    .setColor(COLOR_MAIN)
    .setThumbnail("https://i.imgur.com/jgdQUul.png");

const role = new MessageEmbed()
    .setTitle("Configure Roles")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(COLOR_MAIN)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.net/) - [Discord](https://discord.gg/Nwu9DNjYa9)")

const other = new MessageEmbed()
    .setTitle("Configure Other Settings")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(COLOR_MAIN)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.net/) - [Discord](https://discord.gg/Nwu9DNjYa9)")

const events = new MessageEmbed()
    .setTitle("Toggle Events")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(COLOR_MAIN)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.net/) - [Discord](https://discord.gg/Nwu9DNjYa9)")


const toggle = new MessageEmbed()
    .setTitle("Toggle Features")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(COLOR_MAIN)
    .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp();

const channel = new MessageEmbed()
    .setTitle("Configure Channels")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(COLOR_MAIN)
    .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")

const toggledEmbed = new MessageEmbed()
    .setTitle("✅ Success!")
    .setDescription("[empty]")
    .setColor(COLOR_MAIN)
    .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.net) - [Website](https://quabot.net)")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")

module.exports = { toggledEmbed, timedOut, events, noPermission, timedOut, role, other, toggle, channel };