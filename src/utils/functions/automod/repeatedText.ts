import { ColorResolvable, type Message } from 'discord.js';
import { IAutomodConfig } from '@typings/schemas';
import { Embed } from '@constants/embed';
import { Client } from '@classes/discord';

export let cooldowns: { guildId: string; userId: string; recentMessages: { content: string; time: number }[] }[] = [];

export const repeatedText = async (message: Message, config: IAutomodConfig, _: Client, color: ColorResolvable) => {
  if (!config.repeatedText.enabled) return;

  //* Check if in the last X messages (in the last X seconds) the user has sent the same message that matches for X percentage
  const now = new Date().getTime();
  const maxMessageAge = now - config.repeatedText.duration * 1000;
  const cooldown = cooldowns.find(c => c.guildId === message.guildId && c.userId === message.author.id);
  if (!cooldown) {
    cooldowns.push({
      guildId: message.guildId ?? '',
      userId: message.author.id,
      recentMessages: [{ content: message.content, time: new Date().getTime() }],
    });
    return;
  }
  cooldowns[cooldowns.indexOf(cooldown)].recentMessages = cooldowns[cooldowns.indexOf(cooldown)].recentMessages.filter(
    time => time.time > maxMessageAge,
  );

  const messageContent = message.content.toLowerCase();
  const recentMessages = cooldowns[cooldowns.indexOf(cooldown)].recentMessages;

  //* Similar messages (overlap percentage)
  const similarMessages = recentMessages.filter(m => {
    const content = m.content.toLowerCase();
    const length = Math.max(content.length, messageContent.length);
    const overlap = [...messageContent].filter((c, i) => c === content[i]).length;
    return (overlap / length) * 100 >= config.repeatedText.percentage;
  });

  if (similarMessages.length >= config.repeatedText.messageLimit) {
    //* Delete the message
    if (message.deletable) await message.delete().catch(() => null);

    //* Send the alert message (if enabled)
    if (config.alert) {
      const alertMessage = await message.channel.send({
        embeds: [
          new Embed(color)
            .setDescription(
              `Hey ${message.author}, you can only send ${config.repeatedText.messageLimit} messages with (mostly) the same contents in the last ${config.repeatedText.duration} seconds!`,
            )
            .setFooter({ text: `This message will be deleted in ${config.deleteAlertAfter} seconds.` }),
        ],
        content: `<@${message.author.id}>`,
      });
      setTimeout(() => {
        if (alertMessage.deletable) alertMessage.delete();
      }, config.deleteAlertAfter * 1000);
    }

    return true;
  } else {
    cooldowns[cooldowns.indexOf(cooldown)].recentMessages.push({
      content: message.content,
      time: new Date().getTime(),
    });
  }
};
