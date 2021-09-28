const discord = require('discord.js');
const colors = require('./colors.json');

const CatNoFiles = new discord.MessageEmbed()
    .setTitle(":x: I do not have permission to attach files!")
    .setColor(colors.COLOR)
const CatScanning = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":mag: Scanning the web for the cutest cat! :cat:")
const CoinFlipping = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Tossing the coin... :coin:")
const DogNoFiles = new discord.MessageEmbed()
    .setTitle(":x: I do not have permission to attach files!")
    .setColor(colors.COLOR)
const DogScanning = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":mag: Scanning the web for the cutest dog! :dog: ")
const MemeNoAttach = new discord.MessageEmbed()
    .setTitle(":x: I do not have permission to attach files!")
    .setColor(colors.COLOR);
const MemeScanning = new discord.MessageEmbed()
    .setTitle(":mag: Scanning for the best memes... :joy:")
    .setColor(colors.COLOR)
const TypeNoSentence = new discord.MessageEmbed()
    .setTitle(":x: Could not find a sentence!")
    .setColor(colors.COLOR)
const DonateEmbed = new discord.MessageEmbed()
    .setTitle("Support Quabot :thumbsup:")
    .setColor(colors.COLOR)
    .setDescription("Quabot is a non-profit project, that takes up money and time. By donating to us via paypal you directly support us! :)")
    .addField("Donate", "[Click here](https://paypal.me/joascraft) for the link.")
const HelpMain = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Select a category of commands using the dropdown.")
    .setDescription("When selecting a category you'll get a detailed list of commands within that category.")
    .setThumbnail("https://i.imgur.com/jgdQUul.png");
const LBNoXP = new discord.MessageEmbed()
    .setTitle(":x: There are no people with xp!")
    .setColor(colors.COLOR);
const LBDisabled = new discord.MessageEmbed()
    .setTitle(":x: Levels are disabled in this guild!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setTitle(":white_check_mark: This server is now added to our database.")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setTitle(":x: There was an error!")
    .setColor(colors.COLOR)
const PingGetting = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription(":clock7:  Getting ping...");
const SupportEmbed = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setThumbnail("https://i.imgur.com/jgdQUul.png")
    .setDescription("**Do you need support?**\n\nIf you run into an issue, have a question or just wanna chat with people you can join our support discord.\nBot downtime, updates and more are also announced here.\n\nInvite: https://discord.gg/Nwu9DNjYa9");
const NotInVC = new discord.MessageEmbed()
    .setTitle(":x: You need to be in a voice channel to play songs!")
    .setColor(colors.COLOR);
const MusicDisabled = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":x: Music is disabled in this guild!");
const NotPlaying = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":x: There is no music playing!");
const PauseQueue = new discord.MessageEmbed()
    .setTitle(`:pause_button: Paused the queue!`)
    .setColor(colors.COLOR);
const banNoPermsBot = new discord.MessageEmbed()
    .setTitle(":x: I do not have permission to ban members!")
    .setColor(colors.COLOR);
const banNoPermsUser = new discord.MessageEmbed()
    .setTitle(":x: You do not have permission to ban members!")
    .setColor(colors.COLOR);
const banNoUser = new discord.MessageEmbed()
    .setTitle(":question: Please mention a user you want to ban!")
    .setColor(colors.COLOR)
const banImpossible = new discord.MessageEmbed()
    .setTitle(":x: Failed to ban, you cannot ban this user!")
    .setColor(colors.COLOR)
const PunsishmentsOthers = new discord.MessageEmbed()
    .setTitle(":x: You do not have permission to view punishments of other users!")
    .setColor(colors.COLOR)
const clearpunNoType = new discord.MessageEmbed()
    .setTitle(":question: Please enter a type of punishment to clear: `warn, kick, mute or ban`!")
    .setColor(colors.COLOR);
const clearpunNoMember = new discord.MessageEmbed()
    .setTitle(":x: Please mention a user to clear the warnings of!")
    .setColor(colors.COLOR);
const kickNoPermsClient = new discord.MessageEmbed()
    .setTitle(":x: I do not have permission to kick members!")
    .setColor(colors.COLOR)
const kickNoPermsUser = new discord.MessageEmbed()
    .setTitle(":x: You do not have permission to kick members!")
    .setColor(colors.COLOR)
const kickNoUser = new discord.MessageEmbed()
    .setTitle(":question: Please mention a user you want to kick!")
    .setColor(colors.COLOR)
const kickImpossible = new discord.MessageEmbed()
    .setTitle(":x: Failed to kick, you cannot ban this user!")
    .setColor(colors.COLOR)
const muteNoUser = new discord.MessageEmbed()
    .setTitle(":question: Please mention a user to mute!")
    .setColor(colors.COLOR);
const muteNoRoleManage = new discord.MessageEmbed()
    .setDescription(":x: I do not have permission to manage roles!")
    .setColor(colors.COLOR);
const muteNoPermsUser = new discord.MessageEmbed()
    .setDescription(":x: You do not have permission to mute members!")
    .setColor(colors.COLOR);
const reportNoUser = new discord.MessageEmbed()
    .setTitle(":question: Please mention a user to report!")
    .setColor(colors.COLOR);
const reportNoSelf = new discord.MessageEmbed()
    .setTitle(":x: You cannot report yourself!")
    .setColor(colors.COLOR);
const reportNoContent = new discord.MessageEmbed()
    .setTitle(":x: Please enter something you wish to report this user for!")
    .setColor(colors.COLOR);
const reportsDisabled = new discord.MessageEmbed()
    .setTitle(":x: This guild has reports disabled!")
    .setColor(colors.COLOR);
const reportNoChannel = new discord.MessageEmbed()
    .setTitle(":x: This guild doesn't have a report logging channel setup!")
    .setColor(colors.COLOR);

module.exports = { reportNoChannel, reportsDisabled, reportNoContent, reportNoSelf, reportNoUser, muteNoUser, muteNoRoleManage, muteNoPermsUser, kickImpossible, kickNoPermsClient, kickNoUser, kickNoPermsUser, clearpunNoType, clearpunNoMember, PunsishmentsOthers, banNoPermsBot, banNoPermsUser, banNoUser, banImpossible, PauseQueue, NotPlaying, MusicDisabled, NotInVC, CatNoFiles, CatScanning, PingGetting, SupportEmbed, CoinFlipping, DogNoFiles, DogScanning, MemeScanning, MemeNoAttach, TypeNoSentence, DonateEmbed, HelpMain, LBNoXP, LBDisabled, addedDatabase, errorMain}