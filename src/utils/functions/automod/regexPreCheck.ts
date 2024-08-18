import { IAutomodConfig } from '@typings/schemas';
import { Message } from 'discord.js';

export const regexPreCheck = async (message: Message, config: IAutomodConfig) => {
  if (message.author.bot) return;
  if (!message.guildId) return;
  if (!message.guild) return;
  if (!config.enabled) return;

  if (config.excessiveCaps.enabled) {
    const capsRegex = /[A-Z]/g;
    const caps = message.content.match(capsRegex);
    if (!caps) return;
    const percentage = (caps.length / message.content.length) * 100;
    if (percentage > config.excessiveCaps.percentage) return false;
  }

  if (config.excessiveEmojis.enabled) {
    //* Detect if the message contains more that percentage emojis (check regular emojis and custom emojis)
    const customEmojiRegex = /<a?:[a-zA-Z0-9_]+:[0-9]+>/g;
    const customEmojis = message.content.match(customEmojiRegex);
    let newContent = message.content.replace(customEmojiRegex, '.');

    const emojiRegex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const emojis = message.content.match(emojiRegex);
    newContent = newContent.replace(emojiRegex, '.');
    if (!emojis && !customEmojis) return;

    const totalEmojis = (emojis?.length ?? 0) + (customEmojis?.length ?? 0);
    const percentage = (totalEmojis / newContent.length) * 100;
    if (percentage > config.excessiveEmojis.percentage) return false;
  }

  if (config.excessiveMentions.enabled) {
    const mentionsRegex = /<@&[0-9]+>|<@![0-9]+>|<@[0-9]+>|<#[0-9]+>/g;
    const mentions = message.content.match(mentionsRegex)?.length ?? 0;
    if (mentions > config.excessiveMentions.mentions) return false;
  }

  if (config.excessiveSpoilers.enabled) {
    const spoilerRegex = /\|\|.*?\|\|/g;
    const spoilers = message.content.match(spoilerRegex);
    if (!spoilers) return;
    const spoilerLength = spoilers.reduce((acc, spoiler) => acc + spoiler.length, 0);
    const percentage = (spoilerLength / message.content.length) * 100;
    if (percentage > config.excessiveSpoilers.percentage) return false;
  }

  if (config.externalLinks.enabled) {
    const externalLinkRegex = /https?:\/\/(?!discord)([^\s]+)/gi;
    const externalLinks = message.content.match(externalLinkRegex);
    if (externalLinks && externalLinks.length > 0) return false;
  }

  if (config.serverInvites.enabled) {
    const inviteRegex = /discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/gi;
    const invites = message.content.match(inviteRegex);
    if (invites && invites.length > 0) return false;
  }

  if (config.newLines.enabled) {
    //* Detect if the message contains clears more than X lines, must not be just text but by using line-clearing methods. If there is no text between line breaks for up to X lines, blcok it
    const lines = message.content.split('\n');
    if (lines.length < config.newLines.lines) return;
    const clearedLines = lines.filter(line => line.trim() === '');
    if (clearedLines.length > config.newLines.lines) return false;
  }

  return true;
};
