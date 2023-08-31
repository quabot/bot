import type { ColorResolvable, EmbedField, Snowflake } from 'discord.js';
import type { Document as MongooseDoc, Types } from 'mongoose';

//* The return type of Mongoose function like 'findOne' and 'save'
export type MongooseReturn<T> =
  | (MongooseDoc<unknown, any, T> &
      Omit<
        T & {
          _id: Types.ObjectId;
        },
        never
      >)
  | null;

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
  disabledCommands: string[]; //todo Debug to be sure
}

export type Status = 'pending' | 'approved' | 'denied';

export type MessageTypeWithCard = MessageType | 'card';
export type MessageType = 'embed' | 'text';

export interface Message {
  content: string;
  title: string;
  color: ColorResolvable;
  timestamp: boolean;
  footer: { text: string; icon: string };
  author: { text: string; icon: string; url: string };
  description: string;
  fields: EmbedField[];
  url: string;
  thumbnail: string;
  image: string;
}

export interface LevelCard {
  bg: {
    type: 'none' | 'color' | 'image';
    color: Color;
    image:
      | 'amsterdam'
      | 'helsinki'
      | 'london'
      | 'paris'
      | 'mit'
      | 'new york'
      | 'new york 2'
      | 'new york 3'
      | 'new york 4'
      | 'san francisco'
      | 'prague';
    image_overlay: Color;
  };

  border: {
    enabled: boolean;
    color: Color;
    size: number;
  };

  colors: {
    accent: Color;
    displayname: Color;
    username: Color;
    xp: Color;
    xp_bar: Color;

    level_bg: Color;
    level_text: Color;
  };

  pfp: {
    rounded: boolean;
  };
}

export type Color =
  | `#${string}`
  | `rgb(${number}, ${number}, ${number})`
  | `rgba(${number}, ${number}, ${number}, ${number})`;
