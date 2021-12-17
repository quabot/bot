const { commands } = require('../../index');
const { Client, MessageEmbed } = require('discord.js');
const colors = require('../../files/colors.json');
const consola = require('consola');
const mongoose = require('mongoose');

module.exports = {
    name: "messageReactionAdd",
    /**
     * @param {Client} client 
     */
    async execute(reaction, user, client) {

        try {
            console.log("hello")
        } catch (e) {
            console.log(e);
            return;
        }

    }
}