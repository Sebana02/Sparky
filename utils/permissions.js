const { PermissionsBitField } = require('discord.js')

/**
 * Permissions object that contains all the permissions available in Discord
 * You can use this object to set the permissions needed to run a command or use it as a reference
 */
const permissions = {
    CreateInstantInvite: PermissionsBitField.Flags.CreateInstantInvite, // Allows creation of instant invites
    KickMembers: PermissionsBitField.Flags.KickMembers, // Allows kicking members
    BanMembers: PermissionsBitField.Flags.BanMembers, // Allows banning members
    Administrator: PermissionsBitField.Flags.Administrator, // Allows all permissions and bypasses channel permission overwrites
    ManageChannels: PermissionsBitField.Flags.ManageChannels, // Allows management and editing of channels
    ManageGuild: PermissionsBitField.Flags.ManageGuild, // Allows management and editing of the guild
    AddReactions: PermissionsBitField.Flags.AddReactions, // Allows for the addition of reactions to messages
    ViewAuditLog: PermissionsBitField.Flags.ViewAuditLog, // Allows for viewing of audit logs
    PrioritySpeaker: PermissionsBitField.Flags.PrioritySpeaker, // Allows for using priority speaker in a voice channel
    Stream: PermissionsBitField.Flags.Stream, // Allows the user to go live
    ViewChannel: PermissionsBitField.Flags.ViewChannel, // Allows guild members to view a channel, which includes reading messages in text channels
    SendMessages: PermissionsBitField.Flags.SendMessages, // Allows for sending messages in a channel
    SendTTSMessages: PermissionsBitField.Flags.SendTTSMessages, // Allows for sending of /tts messages
    ManageMessages: PermissionsBitField.Flags.ManageMessages, // Allows for deletion of other users messages
    EmbedLinks: PermissionsBitField.Flags.EmbedLinks, // Links sent by users with this permission will be auto-embedded
    AttachFiles: PermissionsBitField.Flags.AttachFiles, // Allows for uploading images and files
    ReadMessageHistory: PermissionsBitField.Flags.ReadMessageHistory, // Allows for reading of message history
    MentionEveryone: PermissionsBitField.Flags.MentionEveryone, // Allows for using the @everyone tag to notify all users in a channel, and the @here tag to notify all online users in a channel
    UseExternalEmojis: PermissionsBitField.Flags.UseExternalEmojis, // Allows the usage of custom emojis from other servers
    ViewGuildInsights: PermissionsBitField.Flags.ViewGuildInsights, // Allows for viewing guild insights
    Connect: PermissionsBitField.Flags.Connect, // Allows for joining of a voice channel
    Speak: PermissionsBitField.Flags.Speak, // Allows for speaking in a voice channel
    MuteMembers: PermissionsBitField.Flags.MuteMembers, // Allows for muting members in a voice channel
    DeafenMembers: PermissionsBitField.Flags.DeafenMembers, // Allows for deafening of members in a voice channel
    MoveMembers: PermissionsBitField.Flags.MoveMembers, // Allows for moving of members between voice channels
    UseVAD: PermissionsBitField.Flags.UseVAD, // Allows for using voice-activity-detection in a voice channel
    ChangeNickname: PermissionsBitField.Flags.ChangeNickname, // Allows for modification of own nickname
    ManageNicknames: PermissionsBitField.Flags.ManageNicknames, // Allows for modification of other users nicknames
    ManageRoles: PermissionsBitField.Flags.ManageRoles, // Allows management and editing of roles
    ManageWebhooks: PermissionsBitField.Flags.ManageWebhooks, // Allows management and editing of webhooks
    ManageGuildExpressions: PermissionsBitField.Flags.ManageGuildExpressions, // Allows management and editing of guild expressions
    UseApplicationCommands: PermissionsBitField.Flags.UseApplicationCommands, // Allows the use of application commands
    RequestToSpeak: PermissionsBitField.Flags.RequestToSpeak, // Allows for requesting to speak in stage channels
    ManageEvents: PermissionsBitField.Flags.ManageEvents, // Allows management and editing of events
    ManageThreads: PermissionsBitField.Flags.ManageThreads, // Allows management and editing of threads
    CreatePublicThreads: PermissionsBitField.Flags.CreatePublicThreads, // Allows for creating public threads
    CreatePrivateThreads: PermissionsBitField.Flags.CreatePrivateThreads, // Allows for creating private threads
    UseExternalStickers: PermissionsBitField.Flags.UseExternalStickers, // Allows the usage of custom stickers from other servers
    SendMessagesInThreads: PermissionsBitField.Flags.SendMessagesInThreads, // Allows for sending messages in threads
    UseEmbeddedActivities: PermissionsBitField.Flags.UseEmbeddedActivities, // Allows the usage of embedded activities
    ModerateMembers: PermissionsBitField.Flags.ModerateMembers, // Allows for moderation of the membership of a user in a guild
    ViewCreatorMonetizationAnalytics: PermissionsBitField.Flags.ViewCreatorMonetizationAnalytics, // Allows for viewing of guild insights
    UseSoundboard: PermissionsBitField.Flags.UseSoundboard, // Allows the usage of soundboard
    CreateGuildExpressions: PermissionsBitField.Flags.CreateGuildExpressions, // Allows for creating guild expressions
    CreateEvents: PermissionsBitField.Flags.CreateEvents, // Allows for creating events
    UseExternalSounds: PermissionsBitField.Flags.UseExternalSounds, // Allows the usage of custom sounds from other servers
    SendVoiceMessages: PermissionsBitField.Flags.SendVoiceMessages, // Allows for sending voice messages
    SendPolls: PermissionsBitField.Flags.SendPolls, // Allows for sending polls
    UseExternalApps: PermissionsBitField.Flags.UseExternalApps, // Allows the usage of external applications
}

/**
 * Export the permissions object, so it can be used in other files
 */
module.exports = { permissions }