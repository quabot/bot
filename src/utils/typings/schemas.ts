import type { ColorResolvable, Snowflake } from 'discord.js';
import type { LevelCard, Message, MessageType, MessageTypeWithCard, Status } from '@typings/mongoose';

export interface IUserGame {
  userId: Snowflake;
  typePoints: number;
  typeTries: number;
  typeFastest: number;

  quizTries: number;
  quizPoints: number;

  rpsTries: number;
  rpsPoints: number;

  birthday: {
    configured: boolean;
    day: number;
    month: number;
    year: number;
  };
  bio: string;
}

export interface IAfkConfig {
  guildId: Snowflake;
  enabled: boolean;
}

export interface IApplication {
  guildId: Snowflake;
  id: string;

  name: string;
  description?: string;

  questions: {
    question: string;
    description?: string;
    type: 'multiple' | 'checkbox' | 'short' | 'paragraph';
    required: boolean;
  }[];

  submissions_channel: Snowflake;
  submissions_managers: Snowflake[];

  ignored_roles: Snowflake[];
  allowed_roles: Snowflake[];
  reapply: boolean;
  dashboard_allowed: boolean;
  anonymous: boolean;
  cooldown_enabled: boolean;
  cooldown: string;

  add_roles: Snowflake[];
  remove_roles: Snowflake[];

  date: string;
}

export interface IApplicationAnswer {
  guildId: string;
  id: string;
  response_uuid: string;

  userId?: Snowflake;
  time: string;
  answers: string[];
  state: Status;
}

export interface IApplicationConfig {
  guildId: Snowflake;
  enabled: boolean;
}

export interface IGiveaway {
  guildId: Snowflake;
  id: number;

  prize: string;
  winners: number;

  channel: string;
  message: string;
  host: string;

  endTimestamp: string;
  ended: boolean;
}

export interface IGiveawayConfig {
  guildId: Snowflake;
  enabled: boolean;
  pingEveryone: boolean;
}

export interface IIds {
  guildId: Snowflake;
  suggestId?: number;
  giveawayId?: number;
  pollId?: number;
  ticketId?: number;
}

export interface ILevel {
  guildId: Snowflake;
  userId: Snowflake;
  xp: number;
  level: number;
  role: Snowflake;
  active: boolean;
}

export interface ILevelConfig {
  guildId: Snowflake;
  enabled: boolean;
  channel: Snowflake;

  messageType: MessageTypeWithCard;
  levelCard: LevelCard;

  cardMention: true;
  messageText: string;
  message: Message;

  dmEnabled: boolean;
  dmType: MessageTypeWithCard;
  dmMessageText: string;
  dmMessage: Message;

  voiceXp: boolean;
  voiceXpMultiplier: number;
  xpMultiplier: number;

  commandXp: boolean;
  commandXpMultiplier: number;

  excludedChannels: Snowflake[];
  excludedRoles: Snowflake[];

  rewards: { level: number; role: Snowflake }[];
  rewardsMode: 'stack' | 'replace';
  removeRewards: boolean;

  rewardDm: boolean;
  rewardDmType: MessageType;
  rewardDmMessageText: string;
  rewardDmMessage: Message;

  viewCard: boolean;
  leaderboardPublic: boolean;
}

export interface ILoggingConfig {
  guildId: Snowflake;
  enabled: boolean;
  channelId: string;
  excludedChannels: Snowflake[];
  excludedCategories: Snowflake[];
  events: string[];
}

export interface IModerationConfig {
  guildId: Snowflake;
  channel: Snowflake;
  channelId: Snowflake;

  warnDM: boolean;
  warnDMMessage: Message;

  timeoutDM: boolean;
  timeoutDMMessage: Message;

  kickDM: boolean;
  kickDMMessage: Message;

  banDM: boolean;
  banDMMessage: Message;

  tempbanDM: boolean;
  tempbanDMMessage: Message;
}

export interface IPoll {
  guildId: Snowflake;
  id: number;
  channel: Snowflake;
  message: Snowflake;
  interaction: Snowflake; //* Message id
  role?: Snowflake;

  topic: string;
  description: string;

  duration: string;
  optionsCount: number;
  options: any[]; //todo Debug to see value

  created: string;
  endTimestamp: string;
}

export interface IServer {
  guildId: Snowflake;
  locale: string;
  color: ColorResolvable;
  updatesChannel: Snowflake;
  disabledCommands: string[]; //! Mr Joas should not hardCode this in dashboard
}

export interface IResponder {
  guildId: Snowflake;
  trigger: string;
  wildcard: boolean;

  type: 'message' | 'reaction';
  embed: any; //! Option not implemented in Dashboard
  message: string;
  reaction: string;

  ignored_channels: Snowflake[];
  ignoredRoles: Snowflake[];
}

export interface IPollConfig {
  guildId: Snowflake;
  enabled: boolean;
  logEnabled: boolean;
  logChannel: Snowflake;
}

export interface IPunishment {
  guildId: Snowflake;
  userId: Snowflake;

  channelId: Snowflake;
  moderatorId: Snowflake;
  time: string;

  type: string; //todo Debug to see all options, to be more type specific
  id: Snowflake;
  reason: string;
  duration: string;
  active: boolean;
}

export interface IReactionConfig {
  guildId: Snowflake;
  enabled: boolean;
  dmEnabled: boolean;
  dm: Message;
}

export interface IReactionRoles {
  guildId: Snowflake;
  channelId: Snowflake;
  reqPermission: string; //! Gotta make type
  reqRoles: Snowflake[];
  excludedRoles: Snowflake[];
  roleId: Snowflake;
  messageId: Snowflake;
  emoji: string;
  type: 'normal' | 'verify' | 'drop' | 'reversed' | 'unique' | 'binding';
}

export interface IResponderConfig {
  guildId: Snowflake;
  enabled: boolean;
}

export interface ISuggestion {
  guildId: Snowflake;
  id: number;
  msgId: Snowflake;
  suggestion: string;
  status: string; //todo Debug to see all options, to be more type specific
  userId: Snowflake;
}

export interface ISuggestionConfig {
  guildId: Snowflake;

  enabled: boolean;
  channelId: Snowflake;

  logEnabled: boolean;
  logChannelId: Snowflake;

  message: Message;
  emojiRed: string;
  emojiGreen: string;

  reasonRequired: boolean;
  dm: boolean;
  dmMessage: Message;

  colors: {
    approve: `#${string}`;
    deny: `#${string}`;
    pending: `#${string}`;
    deleted: `#${string}`;
  }; //! Option not implemented in Dashboard
}

export interface ITicket {
  guildId: Snowflake;

  id: string;
  channelId: Snowflake;

  topic: string;
  closed: boolean;

  owner: Snowflake; //todo Debug to be sure
  users: Snowflake[]; //todo Debug to be sure
  staff: Snowflake; //todo Debug to be sure
}
