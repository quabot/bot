const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

const selectRole = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '📝 Main Role',
                    description: 'The main role that users can recieve when joining the server, and used for /lock.',
                    value: 'main_role',
                },
            ]),
    );

const selectOther = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '👋 Welcome message',
                    description: 'Change the server\'s leave message.',
                    value: 'welcome_msg',
                },
                {
                    label: '🙋‍♂️ Leave message',
                    description: 'Change the server\'s welcome message.',
                    value: 'leave_msg',
                },
                {
                    label: '💸 Economy Prefix',
                    description: 'Change the economy prefix.',
                    value: 'eco_prefix',
                },
            ]),
    );

const selectToggle = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '🎚️ Levels',
                    description: 'Enable or disable the levels system.',
                    value: 'levels_toggle',
                },
                {
                    label: '📄 Event Logging',
                    description: 'Enable or disable events logging.',
                    value: 'log_toggle',
                },
                {
                    label: '👋 Join Roles',
                    description: 'Enable or disable join roles.',
                    value: 'role_toggle',
                },
                {
                    label: '🎵 Music',
                    description: 'Enable or disable all music related commands.',
                    value: 'music_toggle',
                },
                {
                    label: '📰 Reports',
                    description: 'Enable or disable reports for your guild.',
                    value: 'report_toggle',
                },
                {
                    label: '💡 Suggestions',
                    description: 'Enable or disable the suggestions system.',
                    value: 'suggest_toggle',
                },
                {
                    label: '🎫 Tickets',
                    description: 'Enable or disable the tickets system.',
                    value: 'tickets_toggle',
                },
                {
                    label: '👋 Welcome Messages',
                    description: 'Enable or disable welcome messages.',
                    value: 'welcome_toggle',
                },
                {
                    label: '📈 Polls',
                    description: 'Enable or disable the polls system.',
                    value: 'poll_toggle',
                },
                {
                    label: '🤬 Swear Filter',
                    description: 'Enable the automated deletion of words like fuck, n word and more.',
                    value: 'swear_toggle',
                },
            ]),
    );

const selectChannel = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '📝 Log Channel',
                    description: 'The channel that guild and command events are sent in.',
                    value: 'log_channel',
                },
                {
                    label: '🔨 Report Channel',
                    description: 'The public channel that user reports are sent in.',
                    value: 'report_channel',
                },
                {
                    label: '💡 Suggest Channel',
                    description: 'The public channel that suggestions are sent in.',
                    value: 'suggest_channel',
                },
                {
                    label: '👋 Welcome Channel',
                    description: 'The channel that welcome messages are sent in.',
                    value: 'welcome_channel',
                },
                {
                    label: '🎫 Ticket Category',
                    description: 'The name of the category where tickets are stored.',
                    value: 'ticket_channel',
                },
                {
                    label: '🎫 Closed Tickets Category',
                    description: 'The name of the category where closed tickets are stored.',
                    value: 'closedticket_channel',
                },
                {
                    label: '🎚️ Level Up Channel',
                    description: 'The name of the channel used to send level-up messages.',
                    value: 'levelup_channel',
                },
                {
                    label: '📈 Polls Channel',
                    description: 'The name of the channel used to send poll messages.',
                    value: 'poll_channel',
                },
                {
                    label: '📄 Transcripts Channel',
                    description: 'The name of the channel used to send ticket transcripts.',
                    value: 'transcript_channel',
                },
            ]),
    );


const disabled = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('enable')
            .setLabel('Enable')
            .setDisabled(true)
            .setStyle('SUCCESS'),
        new MessageButton()
            .setCustomId('disable')
            .setLabel('Disable')
            .setDisabled(true)
            .setStyle('DANGER'),
    );

const buttonsLevel = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('disablelevel')
            .setLabel('Disable Level Channel')
            .setStyle('DANGER'),
    );

const toggleEventsSelect = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '➕ Join Messages',
                    description: 'Toggle join message logging to the logging channel and welcome channel.',
                    value: 'join_messages',
                },
                {
                    label: '➖ Leave Messages',
                    description: 'Toggle leave message logging to the logging channel and welcome channel.',
                    value: 'leave_messages',
                },
                {
                    label: '💬 Channel creation and deletion',
                    description: 'Toggle channel create and delete logging to the logging channel.',
                    value: 'channel_logging',
                },
                {
                    label: '📝 Channel updates',
                    description: 'Toggle channel updates logging to the logging channel.',
                    value: 'channel_updates',
                },
                {
                    label: '😀 Emoji creation and deletion',
                    description: 'Toggle emoji creation and deletion logging to the logging channel.',
                    value: 'emoji_cd',
                },
                {
                    label: '😊 Emoji updates',
                    description: 'Toggle emoji updates logging to the logging channel.',
                    value: 'emoji_update',
                },
                {
                    label: '👋 Invite creation and deletion',
                    description: 'Toggle invite creation and deletion logging to the logging channel.',
                    value: 'invite_cd',
                },
                {
                    label: '🗑️ Message deletion',
                    description: 'Toggle message deletion logging to the logging channel.',
                    value: 'message_delete',
                },
                {
                    label: '📄 Message updates',
                    description: 'Toggle message updates logging to the logging channel.',
                    value: 'message_update',
                },
                {
                    label: '🙋‍♂️ Role creation and deletion',
                    description: 'Toggle role creation and deletion logging to the logging channel.',
                    value: 'role_create',
                },
                {
                    label: '🚧 Role updates',
                    description: 'Toggle role updates logging to the logging channel.',
                    value: 'role_update',
                },
                {
                    label: '🔉 Voice Joining and leaving',
                    description: 'Toggle voice joins and leaves logging to the logging channel.',
                    value: 'voice_join',
                },
                {
                    label: '🔇 Voice Movement',
                    description: 'Toggle voice moves logging to the logging channel.',
                    value: 'voice_move',
                },
                {
                    label: "👤 Member Updates",
                    description: "Toggle nickname changes and role additions logging to the logging channel.",
                    value: 'member_update',
                },
                {
                    label: '🤖 QuaBot Logging',
                    description: 'Toggle quabot command usage (/ban, not /info type commands) logging to the logging channel.',
                    value: 'log_bot',
                },
            ]),
    );


module.exports = { buttonsLevel, disabled, toggleEventsSelect, selectRole, selectOther, selectToggle, disabled, selectChannel, buttonsLevel };