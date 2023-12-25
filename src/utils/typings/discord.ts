import {
  ChannelType,
  type ApplicationCommandOptionAllowedChannelTypes,
  type CategoryChannel,
  type ForumChannel,
  type NewsChannel,
  type StageChannel,
  type TextChannel,
  type VoiceChannel,
} from 'discord.js';

export type GuildChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StageChannel | ForumChannel;

export const GuildTextBasedChannel: ApplicationCommandOptionAllowedChannelTypes[] = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
  ChannelType.PrivateThread,
  ChannelType.PublicThread,
  ChannelType.AnnouncementThread,
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice,
];
