import { EmbedBuilder } from "discord.js";

export const embed = (color: any) => new EmbedBuilder().setTimestamp().setColor(color).setFooter({ text: 'QuaBot.net', iconURL: 'https://cdn.discordapp.com/icons/1007810461347086357/a08a18c53574cadc45aa5825e1decd9c.webp' });