const colors = require('../colors.json');
const { MessageEmbed } = require('discord.js');

const main = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTimestamp()
    .setTitle("Select a category of commands using the dropdown.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .addField("Quick Links", "[Invite me](https://discord.com/oauth2/authorize?client_id=845603702210953246&scope=bot%20applications.commands&permissions=346268609631) - [Website](https://quabot.xyz/) - [Discord](https://discord.gg/Nwu9DNjYa9)")
    .setThumbnail("https://i.imgur.com/jgdQUul.png");

const misc = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Misc Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .setDescription(`These commands are just general commands that dont fit the descrition of the ones above.\n
    **/afk** - Set your afk status.
    **/avatar** - Get a user's avatar.
    **/color** - Visualize a hex color.
    **/discriminator** - Find all users with a discriminator.
    **/divide** - Divide two numbers.
    **/members** - Get the guild's membercount.
    **/multiply** - Multiply two numbers.
    **/power** - Get a number to the power of a number.
    **/servericon** - Get the guild's icon.
    **/subtract** - Subtract two numbers.
    **/sum** - Sum of two numbers.
    `);

const support = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Support Commands")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands can be used by members to seek support, make suggestions and more.\n
    **/add** - Add a user to your ticket.
    **/close** - Close a ticket.
    **/delete** - Delete a ticket.
    **/endpoll** - End the voting on a poll.
    **/endsuggestion** - End the voting on a suggestion.
    **/poll** - Start a poll.
    **/quabot** - Leave suggestions and bug reports.
    **/remove** - Remove users from a ticket.
    **/reopen** - Reopen a ticket.
    **/settopic** - Change a ticket topic.
    **/suggest** - Make a suggestion.
    **/ticket** - Open a ticket.
    **/transcript** - Make a ticket transcript.
    `)

const fun = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Fun Commands")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands give funny pictures, games and more.\n
    **/cat** - Get an image of a cat.
    **/coin** - Flip a coin.
    **/dog** - Get an image of a dog.
    **/meme** - Get a meme.
    **/quiz** - Play a quiz.
    **/rps** - Play rock, paper, scissors.
    **/type** - Play a typing game.`);

const info = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Info Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .setDescription(`These commands are used to get information about loads of different things.\n    
    **/announcement** - Latest quabot news.
    **/help** - List commands and their descriptions.
    **/info** - Information about the bot.
    **/leaderboard** - Server XP's leadersboard.
    **/nick** - Change the nickname of a user.
    **/online** -  View activity list.
    **/ping** - Get bot ping.
    **/rank** - Get level and XP points.
    **/roles** - List of roles in this guild.
    **/role** - Create, delete, add or remove roles.
    **/serverinfo** - Server information.
    **/stats** - Bot statistics.
    **/support** - Bot's support discord.
    **/uptime** - Bot's uptime.
    **/userinfo** - Information about a user.
    `)

const music = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Music Commands")
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setTimestamp()
    .setDescription(`These commands are all commands related to music.\n
    **/autoplay** - Toggle autoplay.
    **/nowplaying** - Information about the playing song.
    **/filter** - Toggle filters.
    **/join** - Make bot join your vc.
    **/leave** - Make bot leave your vc.
    **/pause** - Pause the stream.
    **/play** - Play a song.
    **/queue** - Get music queue.
    **/repeat** - Alter repeat mode.
    **/resume** - Resume the stream.
    **/seek** - Seek to a point in the song.
    **/shuffle** - Shuffle queue.
    **/skip** - Skip the playing song.
    **/stop** - Stop the music stream.
    **/volume** - Change volume.
    `)

const moderation = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Moderation Commands")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are used to punish users and moderate the server.\n
    **/ban** - Ban a member.
    **/kick** - Kick a member.
    **/timeout** - Timeout a member.
    **/punishments** - View a member's punishments.
    **/report** - Report a user.
    **/tempban** - Temporarily ban a member.
    **/unban** - Unban a member.
    **/warn** - Warn a member.
    `)

const management = new MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Management Commands")
    .setTimestamp()
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription(`These commands are used by managers to clear channels, start giveaways and more.\n
    **/admin** - Send a "open ticket" message.
    **/clear** - Clear an amount of messages.
    **/config** - Configure quabot.
    **/lock** - Lock a channel.
    **/mention** - Ping everyone.
    **/reactionrole** - Create and delete reactionroles.
    **/unlock** - Get bot ping.
`)

module.exports = { misc, main, support, fun, info, music, moderation, management };