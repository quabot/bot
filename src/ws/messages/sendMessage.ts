import { GuildParser } from '@classes/parsers';
import { CustomEmbed } from '@constants/customEmbed';
import { hasSendPerms } from '@functions/discord';
import SentMessage from '@schemas/SentMessage';
import type { WsEventArgs } from '@typings/functionArgs';

//* QuaBot Dashboard Message Sender Handler.
export default {
  code: 'message-guild',
  async execute({ client, data }: WsEventArgs) {
    //* Get the guild and channel.
    const guild = client.guilds.cache.get(data.guildId);
    if (!guild) return;
    const channel = guild.channels.cache.get(data.channelId);
    const embed = data.embed;
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    //@ts-ignore
    const testMessage = (msg: any): msg is CustomEmbed => {
      return true;
    };
    if (!testMessage(data.message)) return;

    //* Send the message.
    const parser = new GuildParser(guild);

    const sentEmbed = new CustomEmbed(data.message, parser);
    if (embed) {
      const msg = await channel.send({
        embeds: [sentEmbed],
        content: parser.parse(data.message.content) ?? '',
      }).catch(() => {});
      if (!msg) return;

      const newSent = new SentMessage({
        channel: data.channelId,
        date: new Date().getTime(),
        guildId: data.guildId,
        id: msg.id,
        message: data.message,
        user: data.userId ?? "unknown",
        title: "A message"
      });
      await newSent.save();
    }

    if (!embed && (parser.parse(data.message.content) ?? '** **') !== '') {
      const msg = await channel.send({
        content: parser.parse(data.message.content) ?? '** **',
      }).catch(() => {});
      if (!msg) return;

      const newSent = new SentMessage({
        channel: data.channelId,
        date: new Date().getTime(),
        guildId: data.guildId,
        id: msg.id,
        message: data.message,
        user: data.userId ?? "unknown",
        title: "A message"
      });
      await newSent.save();
    }
  },
};
