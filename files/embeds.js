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
    .setDescription(":x: Levels are disabled on this guild!")
    .setColor(colors.COLOR)
const addedDatabase = new discord.MessageEmbed()
    .setTitle(":white_check_mark: This server is now added to our database.")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription(":x: There was an error!")
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
    .setDescription("Music is disabled!");

module.exports = {MusicDisabled, NotInVC, CatNoFiles, CatScanning, PingGetting, SupportEmbed, CoinFlipping, DogNoFiles, DogScanning, MemeScanning, MemeNoAttach, TypeNoSentence, DonateEmbed, HelpMain, LBNoXP, LBDisabled, addedDatabase, errorMain}