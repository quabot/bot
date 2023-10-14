import { CategoryChannel, ForumChannel, NewsChannel, StageChannel, TextChannel, VoiceChannel } from 'discord.js';

export type GuildChannel = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StageChannel | ForumChannel;
