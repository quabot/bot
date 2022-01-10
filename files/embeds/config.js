const colors = require('../colors.json');
const { MessageEmbed } = require('discord.js');

const noPermission = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTimestamp()
    .setTitle(":x: No permission!")
    .setDescription("To change server settings you need `ADMINISTRATOR` permissions.")
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.xyz/) - [Discord](https://discord.gg/Nwu9DNjYa9)")
    .setThumbnail("https://i.imgur.com/jgdQUul.png");

const timedOut = new MessageEmbed()
    .setTitle("❌ Timed Out!")
    .setDescription("You took too long to respond.")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png");

const role = new MessageEmbed()
    .setTitle("Configure Roles")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.xyz/) - [Discord](https://discord.gg/Nwu9DNjYa9)")

const other = new MessageEmbed()
    .setTitle("Configure Other Settings")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.xyz/) - [Discord](https://discord.gg/Nwu9DNjYa9)")

const toggle = new MessageEmbed()
    .setTitle("Toggle Features")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(colors.COLOR)
    .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.xyz) - [Website](https://quabot.xyz)")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp();

const channel = new discord.MessageEmbed()
    .setTitle("Configure Channels")
    .setDescription("Use the dropdown to select a setting you wish to change!")
    .setColor(colors.COLOR)
    .addField("Links", "[Discord](https://discord.gg/Nwu9DNjYa9) - [Invite me](https://invite.quabot.xyz) - [Website](https://quabot.xyz)")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")

module.exports = { noPermission, timedOut, role, other, toggle, channel };