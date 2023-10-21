import { type Snowflake } from 'discord.js';

export interface PollData {
  channel: Snowflake;
  role: `<@&${string}>` | null;
  duration: string;
  choices: number;
}
