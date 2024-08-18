import type { ColorResolvable, Snowflake } from 'discord.js';
import type { LevelCard, Message, MessageType, MessageTypeWithCard, Status, WelcomeCard } from '@typings/mongoose';
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
export interface IBoostConfig {
  guildId: string;
  enabled: boolean;
  channel: string;
  message: Message;
  type: MessageType;
}

export interface IAfkConfig {
  guildId: Snowflake;
  enabled: boolean;
}

export interface IModerationRules {
  guildId: Snowflake;
  enabled: boolean;
  title: string;
  trigger: {
    type: 'warn' | 'kick' | 'timeout' | 'ban';
    amount: number;
    time: string;
  };
  action: {
    type: 'kick' | 'timeout' | 'ban' | 'warn';
    duration: string;
    reason: string;
  };
}

export interface IApplication {
  guildId: Snowflake;
  id: string;

  enabled: boolean;
  name: string;
  description?: string;

  questions?: Types.Array<{
    question: string;
    description?: string;
    type: 'multiple' | 'checkbox' | 'short' | 'paragraph' | 'bool';
    options: string[];
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
  winnerRole?: string;

  channel: string;
  message: string;
  host: string;

  duration: string;
  entries: Types.Array<string[] | number[]>;
  winnerIds: Types.Array<string[]>;

  startTimestamp: string;
  endTimestamp: string;
  ended: boolean;
}

export interface ISentMessages {
  guildId: string;
  message: Message;
  date: string;
  user: string;
  id: string;
  channel: string;
  title: string;
}

export interface IGiveawayConfig {
  guildId: Snowflake;
  enabled: boolean;
  pingRole: Snowflake | 'none';
  autoPin: boolean;
}

export interface IIds {
  guildId: Snowflake;
  suggestId?: number;
  giveawayId?: number;
  pollId?: number;
  ticketId?: number;
}

export interface IAutomodConfig {
  guildId: Snowflake;
  enabled: boolean,
  ignoredChannels: string[] | Types.Array<string>,
  ignoredRoles: string[] | Types.Array<string>,
  logChannel: string,
  logsEnabled: boolean,
  serverInvites: {
    enabled: boolean,
    action: 'warn' | 'timeout' | 'kick'| 'ban' | 'none',
    duration: string,
    alert: boolean,
    deleteAlertAfter: number;
  },
  externalLinks: {
    enabled: boolean,
    action: 'warn' | 'timeout' | 'kick'| 'ban' | 'none',
    duration: string,
    alert: boolean,
    deleteAlertAfter: number;
  },
  excessiveCaps: {
    enabled: boolean,
    action: 'warn' | 'timeout' | 'kick'| 'ban' | 'none',
    duration: string,
    percentage: number,
    alert: boolean,
    deleteAlertAfter: number;
  },
  excessiveEmojis: {
    enabled: boolean,
    action: 'warn' | 'timeout' | 'kick'| 'ban' | 'none',
    duration: string,
    alert: boolean,
    deleteAlertAfter: number;
    percentage: number;
  },
}

export interface IAutomodStrike {
  guildId: Snowflake;
  userId: Snowflake;
  type: 'invite';
  date: string;
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
  levelupCardContent: string;
  message: Message;

  dmEnabled: boolean;
  dmType: MessageTypeWithCard;
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
  rewardDmMessage: Message;

  viewCard: boolean;
  leaderboardPublic: boolean;
}

export interface ILoggingConfig {
  guildId: Snowflake;
  enabled: boolean;
  excludedChannels?: Types.Array<Snowflake>;
  excludedCategories?: Types.Array<Snowflake>;
  events?: Types.Array<{ enabled: boolean; event: string; channelId: string }>;
  logBotActions: boolean;
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

  reportEnabled: boolean;
  reportChannelId: string;

  appealEnabled: boolean;
  appealChannelId: string;
  appealTypes: Types.Array<string> | string[];
  appealQuestions: Types.Array<string> | string[];
}

export interface IPunishmentAppeal {
  guildId: Snowflake;
  userId: Snowflake;
  type: string;
  punishmentId: string;
  answers: Types.Array<string> | string[];
  state: Status;
  response?: string;
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
      embed?: any; //? Should be added in v7.2.0
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
  time: number;

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

export type ReactionRoleType = 'normal' | 'verify' | 'drop' | 'reversed' | 'unique' | string;
export interface IReactionRoles {
  guildId: string;
  type: 'reaction' | 'button' | 'dropdown' | string;
  name: string;
  messageId: string;
  channelId: string;
  active: boolean; // does it work rn

  buttons?: ReactionRoleButtonType[] | any | Types.Array<string>; //

  dropdown?: ReactionRoleDropdownType[] | any | Types.Array<string>; //
  dropdownPlaceholder?: string; // dropdown placeholder
  dropdownMin?: number; // minimum amount of roles that can be selected
  dropdownMax?: number;

  reactions?: ReactionRoleReactionType[] | any | Types.Array<string>; // the actual reaction role emojis/options//

  mode: ReactionRoleType;
  allowedRoles: string[] | Types.Array<string>;
  ignoredRoles: string[] | Types.Array<string>;
}

export type ReactionRoleReactionType = {
  emoji: string;
  role: string;
};
export type ReactionRoleButtonType = {
  emoji: string;
  label: string;
  role: string;
};
export type ReactionRoleDropdownType = {
  emoji: string;
  label: string;
  description?: string;
  role: string;
};

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
  roles?: Types.Array<Snowflake>;
  staff: Snowflake;
}

export interface ITicketConfig {
  guildId: Snowflake;

  enabled: boolean;
  openCategory: Snowflake | 'none';
  closedCategory: Snowflake | 'none';

  staffRoles?: Types.Array<Snowflake>;
  staffPing: Snowflake | 'none';
  topicButton: boolean;

  topicRequired: boolean;

  logChannel: Snowflake | 'none';
  logEnabled: boolean;
  logEvents: LogEvents[];

  autoDeleteOnClose: boolean;
  ticketLimitUser: number;
  ticketLimitGlobal: number;

  dmEnabled: boolean;
  dmEvents: LogEvents[];

  autoClose: boolean;
  autoCloseDays: number;

  autoRemind: boolean;
  autoRemindDays: number;
}

export type LogEvents =
  | 'close'
  | 'delete'
  | 'reopen'
  | 'create'
  | 'add'
  | 'remove'
  | 'claim'
  | 'unclaim'
  | 'updated'
  | 'transfer';

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
