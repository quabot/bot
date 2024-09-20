import { Message } from "@typings/mongoose";

export const reqString = {
  type: String,
  required: true,
};

export const optString = {
  type: String,
};

export const reqNum = {
  type: Number,
  required: true,
  default: 0,
};

export const optObject = {
  type: Object,
};

export const optId = {
  type: Number,
  default: 1,
  required: true,
};

export const reqBool = {
  type: Boolean,
  required: true,
};

export const reqBoolDefaultOff = {
  type: Boolean,
  required: true,
  default: false,
};

export const reqObject = {
  type: Object,
  required: true,
};

export const reqDate = {
  type: Date,
  required: true,
};

export const reqArray = {
  type: Array,
  required: true,
  default: [],
};

export const automationIfArray = {
  type: Array<{
    type:
      | 'in-channel'
      | 'contains-words'
      | 'is-exactly'
      | 'has-not'
      | 'has-image'
      | 'has-text-attachment'
      | 'has-video'
      | 'is-reply'
      | 'not-reply'
      | 'is-emoji'
      | 'has-reactions'
      | 'has-role'
      | 'not-role'
      | 'gained-role'
      | 'lost-role'
      | 'click-button'
      | 'is-thread';
    channels?: string[];
    words?: string[];
    sentence?: string;
    emoji?: string;
    reactions?: string[];
    roles?: string[];
    role?: string;
    buttonId?: string[];
  }>,
  required: true,
  default: [],
};

export const automationActionArray = {
  type: Array<{
    type:
      | 'create-thread'
      | 'send-message'
      | 'reply'
      | 'repost'
      | 'pin'
      | 'delete-message'
      | 'delete-channel'
      | 'add-reaction'
      | 'remove-reaction'
      | 'remove-all-reactions'
      | 'add-role'
      | 'remove-role'
      | 'add-users-to-thread'
      | 'send-in-thread'
      | 'give-xp'
      | 'take-xp'
      | 'warn'
      | 'kick'
      | 'ban'
      | 'timeout'
      | 'send-dm';
    threadName?: string;
    message?: Message;
    channelId?: string;
    reaction?: string;
    role?: string;
    users?: string[];
    reason?: string;
    xp?: number;
    duration?: string;
  }>,
  required: true,
  default: [],
};

export const optArray = {
  type: Array,
  required: false,
  default: [],
};
