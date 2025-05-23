import type { EmbedField } from 'discord.js';
import type { Document as MongooseDoc, Types } from 'mongoose';

//* The return type of Mongoose function like 'findOne' and 'save'
export type MongooseReturn<T> = NonNullMongooseReturn<T> | null;

//* The return type of Mongoose function like 'findOne' and 'save' when it may not be null
export type NonNullMongooseReturn<T> = MongooseDoc<unknown, any, T> &
  Omit<
    T & {
      _id: Types.ObjectId;
    },
    never
  >;

export type ReactionRoleType = 'normal' | 'verify' | 'drop' | 'reversed' | 'unique' | 'binding';

export type Status = 'pending' | 'approved' | 'denied';

export type MessageTypeWithCard = MessageType | 'card';
export type MessageType = 'embed' | 'text';

export interface Message {
  content: string;
  title: string;
  color: string;
  timestamp: boolean;
  footer: { text: string; icon: string };
  author: { text: string; icon: string; url: string };
  description: string;
  fields: EmbedField[];
  url: string;
  thumbnail: string;
  image: string;
  buttons?: string[],
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
    rounded: boolean; //! Option not implemented in Dashboard
  };
}

export interface WelcomeCard {
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

  welcomeTxt: {
    enabled: boolean;
    value: string;
    color: Color;
    weight: FontWeight;
  };

  memberTxt: {
    enabled: boolean;
    value: string;
    color: Color;
    weight: FontWeight;
  };

  customTxt: {
    enabled: boolean;
    value: string;
    color: Color;
    weight: FontWeight;
  };

  pfp: {
    rounded: boolean; //! Option not implemented in Dashboard
  };
}

export type Color =
  | `#${string}`
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`;

export type FontWeight = 'Bold' | 'SemiBold' | 'Medium' | 'Normal';



export interface IStarMessagesConfig {
  guildId: string;
  enabled: boolean;
  channel: string;
  minStars: number;
  emoji: string;
  message: Message;
  notifyUser: boolean;
  ignoredChannels: Types.Array<string> | string[];
}
export interface IStarMessage {
  guildId: string;
  channelId: string;
  userId: string;
  messageId: string;
  stars: number;
  starboardId: string;
  starboardMessageId: string;
  date: number;
}