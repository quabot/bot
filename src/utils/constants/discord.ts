import { ChannelType } from 'discord.js';

export const API_URL = 'https://api.quabot.net';

export const CHANNEL_TYPES = [
  'GUILD_TEXT',
  'DM',
  'GUILD_VOICE',
  'GROUP_DM',
  'GUILD_CATEGORY',
  'GUILD_ANNOUNCEMENT',
  'ANNOUNCEMENT_THREAD',
  'PUBLIC_THREAD',
  'PRIVATE_THREAD',
  'GUILD_STAGE_VOICE',
  'GUILD_DIRECTORY',
  'GUILD_FORUM',
  //? Isn't fully supported yet
  //'GUILD_MEDIA',
];

export const CHANNEL_TYPES_BY_ID = [...CHANNEL_TYPES.slice(0, 6), '', '', '', '', '', ...CHANNEL_TYPES.slice(6)];

export const channelBlacklist = [
  ChannelType.DM,
  ChannelType.GroupDM,
  ChannelType.GuildCategory,
  ChannelType.GuildDirectory,
  ChannelType.GuildForum,
  ChannelType.GuildStageVoice,
  ChannelType.GuildVoice,
];

export type Perm =
  | 'CREATE_INSTANT_INVITE'
  | 'KICK_MEMBERS'
  | 'BAN_MEMBERS'
  | 'ADMINISTRATOR'
  | 'MANAGE_CHANNELS'
  | 'MANAGE_GUILD'
  | 'ADD_REACTIONS'
  | 'VIEW_AUDIT_LOG'
  | 'PRIORITY_SPEAKER'
  | 'STREAM'
  | 'VIEW_CHANNEL'
  | 'SEND_MESSAGES'
  | 'SEND_TTS_MESSAGES'
  | 'MANAGE_MESSAGES'
  | 'EMBED_LINKS'
  | 'ATTACH_FILES'
  | 'READ_MESSAGE_HISTORY'
  | 'MENTION_EVERYONE'
  | 'USE_EXTERNAL_EMOJIS'
  | 'VIEW_GUILD_INSIGHTS'
  | 'CONNECT'
  | 'SPEAK'
  | 'MUTE_MEMBERS'
  | 'DEAFEN_MEMBERS'
  | 'MOVE_MEMBERS'
  | 'USE_VAD'
  | 'CHANGE_NICKNAME'
  | 'MANAGE_NICKNAMES'
  | 'MANAGE_ROLES'
  | 'MANAGE_WEBHOOKS'
  | 'MANAGE_GUILD_EXPRESSIONS'
  | 'USE_APPLICATION_COMMANDS'
  | 'REQUEST_TO_SPEAK'
  | 'MANAGE_EVENTS'
  | 'MANAGE_THREADS'
  | 'CREATE_PUBLIC_THREADS'
  | 'CREATE_PRIVATE_THREADS'
  | 'USE_EXTERNAL_STICKERS'
  | 'SEND_MESSAGES_IN_THREADS'
  | 'USE_EMBEDDED_ACTIVITIES'
  | 'MODERATE_MEMBERS'
  | 'VIEW_CREATOR_MONETIZATION_ANALYTICS'
  | 'USE_SOUNDBOARD'
  | 'USE_EXTERNAL_SOUNDS'
  | 'SEND_VOICE_MESSAGES';

export const PERMS = [
  { perm: 'CREATE_INSTANT_INVITE', code: 1 << 0 },
  { perm: 'KICK_MEMBERS', code: 1 << 1 },
  { perm: 'BAN_MEMBERS', code: 1 << 2 },
  { perm: 'ADMINISTRATOR', code: 1 << 3 },
  { perm: 'MANAGE_CHANNELS', code: 1 << 4 },
  { perm: 'MANAGE_GUILD', code: 1 << 5 },
  { perm: 'ADD_REACTIONS', code: 1 << 6 },
  { perm: 'VIEW_AUDIT_LOG', code: 1 << 7 },
  { perm: 'PRIORITY_SPEAKER', code: 1 << 8 },
  { perm: 'STREAM', code: 1 << 9 },
  { perm: 'VIEW_CHANNEL', code: 1 << 10 },
  { perm: 'SEND_MESSAGES', code: 1 << 11 },
  { perm: 'SEND_TTS_MESSAGES', code: 1 << 12 },
  { perm: 'MANAGE_MESSAGES', code: 1 << 13 },
  { perm: 'EMBED_LINKS', code: 1 << 14 },
  { perm: 'ATTACH_FILES', code: 1 << 15 },
  { perm: 'READ_MESSAGE_HISTORY', code: 1 << 16 },
  { perm: 'MENTION_EVERYONE', code: 1 << 17 },
  { perm: 'USE_EXTERNAL_EMOJIS', code: 1 << 18 },
  { perm: 'VIEW_GUILD_INSIGHTS', code: 1 << 19 },
  { perm: 'CONNECT', code: 1 << 20 },
  { perm: 'SPEAK', code: 1 << 21 },
  { perm: 'MUTE_MEMBERS', code: 1 << 22 },
  { perm: 'DEAFEN_MEMBERS', code: 1 << 23 },
  { perm: 'MOVE_MEMBERS', code: 1 << 24 },
  { perm: 'USE_VAD', code: 1 << 25 },
  { perm: 'CHANGE_NICKNAME', code: 1 << 26 },
  { perm: 'MANAGE_NICKNAMES', code: 1 << 27 },
  { perm: 'MANAGE_ROLES', code: 1 << 28 },
  { perm: 'MANAGE_WEBHOOKS', code: 1 << 29 },
  { perm: 'MANAGE_GUILD_EXPRESSIONS', code: 1 << 30 },
  { perm: 'USE_APPLICATION_COMMANDS', code: 1 << 31 },
  { perm: 'REQUEST_TO_SPEAK', code: 1 << 32 },
  { perm: 'MANAGE_EVENTS', code: 1 << 33 },
  { perm: 'MANAGE_THREADS', code: 1 << 34 },
  { perm: 'CREATE_PUBLIC_THREADS', code: 1 << 35 },
  { perm: 'CREATE_PRIVATE_THREADS', code: 1 << 36 },
  { perm: 'USE_EXTERNAL_STICKERS', code: 1 << 37 },
  { perm: 'SEND_MESSAGES_IN_THREADS', code: 1 << 38 },
  { perm: 'USE_EMBEDDED_ACTIVITIES', code: 1 << 39 },
  { perm: 'MODERATE_MEMBERS', code: 1 << 40 },
  { perm: 'VIEW_CREATOR_MONETIZATION_ANALYTICS', code: 1 << 41 },
  { perm: 'USE_SOUNDBOARD', code: 1 << 42 },
  { perm: 'USE_EXTERNAL_SOUNDS', code: 1 << 45 },
  { perm: 'SEND_VOICE_MESSAGES', code: 1 << 46 },
];

export function permissionBitToString(permission: string) {
  return PERMS.find(i => i.code === parseInt(permission))!.perm;
}
