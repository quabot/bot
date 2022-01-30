const discord = require('discord.js');

const selectCategory = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Toggle Features',
                    description: 'Toggle certain settings like log channels, tickets, music and more.',
                    value: 'toggle_features',
                },
                {
                    label: 'Change Channels',
                    description: 'Allows you to change log channel, welcome channel and more channel-related settings.',
                    value: 'change_channels',
                },
                {
                    label: 'Change Roles',
                    description: 'Allows you to change roles for people who are muted, on join etc.',
                    value: 'change_roles',
                },
                // {
                //     label: 'Logging Settings',
                //     description: 'Allows you to toggle logging for certain events.',
                //     value: 'event_settings',
                // },
                {
                    label: 'Other Settings',
                    description: 'Coming soon.',
                    value: 'other_settings',
                },
            ]),
    );
const otherCategory = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Welcome message',
                    description: 'Toggle certain settings like log channels, tickets, music and more.',
                    value: 'welcome_msg',
                },
                {
                    label: 'Leave message',
                    description: 'Allows you to change log channel, welcome channel and more channel-related settings.',
                    value: 'leave_msg',
                },
            ]),
    );
const MiscSupport = "a";
const HelpSelect = "a";
const toggleEventsSelect = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Join Messages',
                    description: 'Toggle join message logging to the logging channel and welcome channel.',
                    value: 'join_messages',
                },
                {
                    label: 'Leave Messages',
                    description: 'Toggle leave message logging to the logging channel and welcome channel.',
                    value: 'leave_messages',
                },
                {
                    label: 'Channel deletion and creation',
                    description: 'Toggle channel create and delete logging to the logging channel.',
                    value: 'aas',
                },
                {
                    label: 'Channel updates',
                    description: 'Toggle channel updates logging to the logging channel.',
                    value: 'asdd',
                },
                {
                    label: 'Emoji creation and deletion',
                    description: 'Toggle emoji creation and deletion logging to the logging channel.',
                    value: 'fdsf',
                },
                {
                    label: 'Emoji updates',
                    description: 'Toggle emoji updates logging to the logging channel.',
                    value: 'trhrh',
                },
                {
                    label: 'Invite creation and deletion',
                    description: 'Toggle invite creation and deletion logging to the logging channel.',
                    value: 'rthrth',
                },
                {
                    label: 'Message deletion',
                    description: 'Toggle message deletion logging to the logging channel.',
                    value: 'dgfdg',
                },
                {
                    label: 'Message updates',
                    description: 'Toggle message updates logging to the logging channel.',
                    value: 'ghgh',
                },
                {
                    label: 'Role creation and deletion',
                    description: 'Toggle role creation and deletion logging to the logging channel.',
                    value: 'dvfd',
                },
                {
                    label: 'Role updates',
                    description: 'Toggle role updates logging to the logging channel.',
                    value: 'ddfdfvfd',
                },
                {
                    label: 'Voice Joining and leaving',
                    description: 'Toggle voice joins and leaves logging to the logging channel.',
                    value: 'hgjhj',
                },
                {
                    label: 'Voice Movement',
                    description: 'Toggle voice moves logging to the logging channel.',
                    value: 'gfg',
                },
                {
                    label: "Member Updates",
                    description:"Toggle nickname changes and role additions logging to the logging channel.",
                    value: 'sdagy',
                },
                {
                    label: 'QuaBot Logging',
                    description: 'Toggle quabot command usage (/ban, not /info type commands) logging to the logging channel.',
                    value: 'aaaas',
                },
            ]),
    );
const levelsButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableLevel')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableLevel')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const logButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableLogs')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableLogs')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const roleButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableRole')
            .setLabel('Enable')
            .setDisabled(false)
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableRole')
            .setLabel('Disable')
            .setDisabled(false)
            .setStyle('DANGER'),
    );
const musicButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableMusic')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableMusic')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const reportButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableReport')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableReport')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const suggestButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableSuggest')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableSuggest')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const ticketButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableTicket')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableTicket')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const welcomeButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enableWelcome')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disableWelcome')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const pollButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('enablePoll')
            .setLabel('Enable')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disablePoll')
            .setLabel('Disable')
            .setStyle('DANGER'),
    );
const disabledToggle = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('disabledE')
            .setLabel('Enable')
            .setDisabled('true')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('disabledD')
            .setLabel('Disable')
            .setDisabled('true')
            .setStyle('DANGER'),
    );
const nextPage1 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next1')
            .setLabel('Next Page')
            .setStyle('SUCCESS'),
    );
const nextPage2 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next2')
            .setLabel('Previous Page')
            .setStyle('DANGER'),
    );
const nextPage3 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next3')
            .setLabel('Next Page')
            .setStyle('SUCCESS'),
    );
const nextPage4 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('next4')
            .setLabel('Previous Page')
            .setStyle('DANGER'),
    );
const disableLevel = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('disablelevel')
            .setLabel('Disable Level-up channel')
            .setStyle('DANGER'),
    );
const toggle = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Levels',
                    description: 'Enable or disable the levels system.',
                    value: 'levels_toggle',
                },
                {
                    label: 'Event Logging',
                    description: 'Enable or disable events logging.',
                    value: 'log_toggle',
                },
                {
                    label: 'Join Roles',
                    description: 'Enable or disable join roles.',
                    value: 'role_toggle',
                },
                {
                    label: 'Music',
                    description: 'Enable or disable all music related commands.',
                    value: 'music_toggle',
                },
                {
                    label: 'Reports',
                    description: 'Enable or disable reports for your guild.',
                    value: 'report_toggle',
                },
                {
                    label: 'Suggestions',
                    description: 'Enable or disable the suggestions system.',
                    value: 'suggest_toggle',
                },
                {
                    label: 'Tickets',
                    description: 'Enable or disable the tickets system.',
                    value: 'tickets_toggle',
                },
                {
                    label: 'Welcome Messages',
                    description: 'Enable or disable welcome messages.',
                    value: 'welcome_toggle',
                },
                {
                    label: 'Polls',
                    description: 'Enable or disable the polls system.',
                    value: 'poll_toggle',
                },
            ]),
    );
const toggle2 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Suggestions',
                    description: 'Enable or disable the suggestions system.',
                    value: 'suggest_toggle',
                },
                {
                    label: 'Tickets',
                    description: 'Enable or disable the tickets system.',
                    value: 'tickets_toggle',
                },
                {
                    label: 'Welcome Messages',
                    description: 'Enable or disable welcome messages.',
                    value: 'welcome_toggle',
                },
                {
                    label: 'Polls',
                    description: 'Enable or disable the polls system.',
                    value: 'poll_toggle',
                },
            ]),
    );
const channel = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Log Channel',
                    description: 'The channel that guild and command events are sent in.',
                    value: 'log_channel',
                },
                {
                    label: 'Report Channel',
                    description: 'The public channel that user reports are sent in.',
                    value: 'report_channel',
                },
                {
                    label: 'Suggest Channel',
                    description: 'The public channel that suggestions are sent in.',
                    value: 'suggest_channel',
                },
                {
                    label: 'Welcome Channel',
                    description: 'The channel that welcome messages are sent in.',
                    value: 'welcome_channel',
                },
                {
                    label: 'Ticket Category',
                    description: 'The name of the category where tickets are stored.',
                    value: 'ticket_channel',
                },
                {
                    label: 'Closed Tickets Category',
                    description: 'The name of the category where closed tickets are stored.',
                    value: 'closedticket_channel',
                },
                {
                    label: 'Level Up Channel',
                    description: 'The name of the channel used to send level-up messages.',
                    value: 'levelup_channel',
                },
                {
                    label: 'Polls Channel',
                    description: 'The name of the channel used to send poll messages.',
                    value: 'poll_channel',
                },
            ]),
    );
const channel2 = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Closed Tickets Category',
                    description: 'The name of the category where closed tickets are stored.',
                    value: 'closedticket_channel',
                },
                {
                    label: 'Level Up Channel',
                    description: 'The name of the channel used to send level-up messages.',
                    value: 'levelup_channel',
                },
                {
                    label: 'Polls Channel',
                    description: 'The name of the channel used to send poll messages.',
                    value: 'poll_channel',
                },
            ]),
    );
const role = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('None selected.')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: 'Main Role',
                    description: 'The main role that users get when joining the server.',
                    value: 'main_role',
                },
                {
                    label: 'Muted Role',
                    description: '/mute is no longer supported! Use /timeout instead.',
                    value: 'muted_role',
                },
            ]),
    );
const closeTicket = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('closebutton')
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('deletebutton')
            .setLabel('Delete')
            .setEmoji('🗑️')
            .setStyle('DANGER'),
    );
const closeTicketWCancel = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setEmoji('🔒')
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('cancelclose')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle('DANGER'),
    );
const closeTicketWCancelDis = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('close')
            .setLabel('Close')
            .setEmoji('🔒')
            .setDisabled(true)
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('cancelclose')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const deleteTicket = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('deleteconfirm')
            .setLabel('Delete')
            .setEmoji('🗑️')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setStyle('DANGER'),
    );
const newMeme = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('meme')
            .setLabel('Next Meme')
            .setStyle('PRIMARY'),
    );
const newCat = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('cat')
            .setLabel('Next Cat')
            .setStyle('PRIMARY'),
    );
const newDog = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('dog')
            .setLabel('Next Dog')
            .setStyle('PRIMARY'),
    );
const pictureButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('memePic')
            .setLabel('Meme')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('dogPic')
            .setLabel('Dog')
            .setStyle('PRIMARY'),
        new discord.MessageButton()
            .setCustomId('catPic')
            .setLabel('Cat')
            .setStyle('DANGER'),
    );
const pictureButtonsDisabled = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('memePic')
            .setLabel('Meme')
            .setStyle('SUCCESS')
            .setDisabled('true'),
        new discord.MessageButton()
            .setCustomId('dogPic')
            .setLabel('Dog')
            .setStyle('PRIMARY')
            .setDisabled('true'),
        new discord.MessageButton()
            .setCustomId('catPic')
            .setLabel('Cat')
            .setStyle('DANGER')
            .setDisabled('true'),
    );
const adminButtons = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('ticketmsg')
            .setLabel('Ticket Message')
            .setStyle('PRIMARY'),
    );
const ticketButton = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('ticket')
            .setLabel('Ticket')
            .setEmoji('📩')
            .setStyle('SECONDARY'),
    );
const reopenButton = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('reopen')
            .setLabel('Reopen')
            .setEmoji('🔓')
            .setStyle('SUCCESS'),
    );
const reopenButtonClosed = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('reopen')
            .setLabel('Reopen')
            .setEmoji('🔓')
            .setDisabled(true)
            .setStyle('SUCCESS'),
    );
const deleteTicketC = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('deleteconfirm')
            .setLabel('Delete')
            .setEmoji('🗑️')
            .setDisabled(true)
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setEmoji('❌')
            .setDisabled(true)
            .setStyle('DANGER'),
    );
const addbot = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setURL('https://invite.quabot.net/')
            .setLabel('Invite QuaBot')
            .setStyle('LINK'),
    );

module.exports = { otherCategory, toggleEventsSelect, addbot, MiscSupport, reopenButtonClosed, deleteTicketC, closeTicketWCancelDis, roleButtons, pictureButtonsDisabled, pictureButtons, pollButtons, reopenButton, ticketButton, adminButtons, newDog, newCat, newMeme, closeTicketWCancel, deleteTicket, closeTicket, disableLevel, role, channel, nextPage3, nextPage4, channel2, ticketButtons, welcomeButtons, suggestButtons, toggle2, nextPage2, nextPage1, reportButtons, musicButtons, toggle, logButtons, disabledToggle, levelsButtons, selectCategory, HelpSelect }