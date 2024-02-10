import type { ColorResolvable, Snowflake } from 'discord.js';
import type {
  LevelCard,
  Message,
  MessageType,
  MessageTypeWithCard,
  ReactionRoleType,
  Status,
  TicketAction,
  WelcomeCard,
} from '@typings/mongoose';
import { Types } from 'mongoose';

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

  questions?: Types.Array<{
    question: string;
    description?: string;
    type: 'multiple' | 'checkbox' | 'short' | 'paragraph' | 'bool';
    options?: string[];
    required: boolean;
    image?: string;
    thumbnail?: string;
  }>;

  submissions_channel: Snowflake;
  submissions_managers?: Types.Array<Snowflake>;

  ignored_roles?: Types.Array<Snowflake>;
  allowed_roles?: Types.Array<Snowflake>;
  reapply: boolean;
  allowed_from: 'dashboard' | 'bot' | 'both';
  anonymous: boolean;
  cooldown_enabled: boolean;
  cooldown: string;

  add_roles?: Types.Array<Snowflake>;
  remove_roles?: Types.Array<Snowflake>;

  date: string;
}

export interface IApplicationAnswer {
  guildId: string;
  id: string;
  response_uuid: string;

  userId: Snowflake;
  time: Date;
  answers: Types.Array<string[] | string | number[]>;
  state: Status;
  reason?: string;
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

  excludedChannels?: Types.Array<Snowflake>;
  excludedRoles?: Types.Array<Snowflake>;

  rewards?: Types.Array<{ level: number; role: Snowflake }>;
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
  excludedChannels?: Types.Array<Snowflake>;
  excludedCategories?: Types.Array<Snowflake>;
  events?: Types.Array<string>;
}

export interface IModerationConfig {
  guildId: Snowflake;
  channel: boolean;
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
  role?: `<@&${string}>` | null;

  topic: string;
  description: string;

  duration: string;
  optionsCount: number;
  options?: Types.Array<string>;

  created: string;
  endTimestamp: string;
}

export interface IServer {
  guildId: Snowflake;
  locale: string;
  color: ColorResolvable;
  updatesChannel: Snowflake;
  disabledCommands?: Types.Array<string>;
}

export type IResponder = {
  guildId: Snowflake;
  trigger: string;
  wildcard: boolean;

  ignored_channels?: Types.Array<Snowflake>;
  ignored_roles?: Types.Array<Snowflake>;
} & (
  | { type: 'message'; message: string }
  | { type: 'reaction'; reaction: string }
  | {
      type: 'embed';
      embed?: any; //! Option not implemented in Dashboard
    }
);

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

  type: 'ban' | 'kick' | 'tempban' | 'timeout' | 'warn';
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
  reqPermission: string;
  reqRoles?: Types.Array<Snowflake>;
  excludedRoles?: Types.Array<Snowflake>;
  roleId: Snowflake;
  messageId: Snowflake;
  emoji: string;
  type: ReactionRoleType;
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
  status: 'pending' | string; //todo Debug to see all options, to be more type specific
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

  owner: Snowflake;
  users?: Types.Array<Snowflake>;
  staff: Snowflake;
}

export interface ITicketConfig {
  guildId: Snowflake;

  enabled: boolean;
  openCategory: Snowflake;
  closedCategory: Snowflake;

  guildMax: number;
  userMax: number;

  inactiveDaysToDelete: number;
  deleteOnClose: boolean;

  staffRoles?: Types.Array<Snowflake>;
  staffPing: Snowflake;
  topicButton: boolean;

  dmEnabled: boolean;
  dmMessages: {
    [key in TicketAction]: { enabled: boolean; type: MessageType; message: Message };
  };

  logChannel: Snowflake;
  logActions: Types.Array<TicketAction>;
  logEnabled: boolean;
}

export interface IUser {
  guildId: Snowflake;
  userId: Snowflake;

  bans: number;
  tempbans: number;
  warns: number;
  kicks: number;
  timeouts: number;

  afk: boolean;
  afkMessage: string;
}

export interface IWelcomeConfig {
  guildId: Snowflake;

  joinEnabled: boolean;
  joinChannel: Snowflake | 'none';
  joinType: MessageTypeWithCard;
  joinMessage: Message;
  joinCard: WelcomeCard;

  leaveEnabled: boolean;
  leaveChannel: Snowflake | 'none';
  leaveType: MessageTypeWithCard;
  leaveMessage: Message;
  leaveCard: WelcomeCard;

  joinRole?: Types.Array<{ role: Snowflake; delay: number; bot: true }>;
  joinRoleEnabled: boolean;

  joinDM: boolean;
  joinDMType: MessageTypeWithCard;
  dm: Message;
  dmCard: WelcomeCard;
}

export interface IVote {
  userId: Snowflake;
  lastVote: string; //* Date.prototype.getTime().toString()
}
