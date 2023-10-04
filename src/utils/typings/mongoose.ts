import type { ColorResolvable, EmbedField } from 'discord.js';
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
    rounded: boolean; //! Option not implemented in Dashboard
  };
}

export type Color =
  | `#${string}`
  | `rgb(${number}, ${number}, ${number})`
  | `rgba(${number}, ${number}, ${number}, ${number})`;
