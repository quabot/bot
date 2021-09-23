const discord = require('discord.js');
const colors = require('./colors.json');

const CatNoFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR)
const CatScanning = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription(":mag: Scanning the web for the cutest cat! :cat:")
const CoinFlipping = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle("Tossing the coin... :coin:")
const DogNoFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR)
const DogScanning = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription(":mag: Scanning the web for the cutest dog! :dog: ")
const MemeNoAttach = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR);
const MemeScanning = new discord.MessageEmbed()
    .setDescription(":mag: Scanning for the best memes... :joy:")
    .setColor(colors.COLOR)
const TypeNoSentence = new discord.MessageEmbed()
    .setDescription(":x: Could not find a sentence!")
    .setColor(colors.COLOR)

module.exports = {CatNoFiles, CatScanning, CoinFlipping, DogNoFiles, DogScanning, MemeScanning, MemeNoAttach, TypeNoSentence}