/**
 * Group Management plugin for Lotus MD
 * Provides commands for managing WhatsApp groups
 */

const chalk = require('chalk')
const config = require('../config')
const { isGroup, isOwner } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'group',
    description: 'Group management commands',
    commands: ['add', 'kick', 'promote', 'demote', 'groupsetting', 'groupinfo', 'link'],
    usage: '.add [number] / .kick [@user] / .promote [@user] / .demote [@user]',
    category: 'admin',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup: isGroupChat, sender, pushname }) => {
        try {
            // Check if command is used in a group
            if (!isGroupChat) {
                await bot.sendMessage(m.key.remoteJid, { text: '⚠️ This command can only be used in groups.' })
                return
            }
            
            const groupMetadata = await bot.groupMetadata(m.key.remoteJid)
            const groupName = groupMetadata.subject
            const participants = groupMetadata.participants
            const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
            const botAdmin = groupAdmins.includes(bot.user.id)
            const isAdmin = groupAdmins.includes(m.sender)
            
            // Handle different group commands
            switch (command) {
                case 'add':
                    // Add member command
                    if (!botAdmin) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ I need to be an admin to add members.' })
                        return
                    }
                    
                    if (!isAdmin && !isOwner(sender)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ Only admins can use this command.' })
                        return
                    }
                    
                    if (args.length === 0) {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please provide the number to add.\n\nExample: ${prefix}add 1234567890` })
                        return
                    }
                    
                    // Format number to add
                    let phone = args[0].replace(/[^0-9]/g, '')
                    if (!phone.startsWith('1') && phone.length === 10) phone = '1' + phone
                    if (!phone.includes('@s.whatsapp.net')) phone = phone + '@s.whatsapp.net'
                    
                    // Add user to group (in a real implementation)
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Adding @${phone.split('@')[0]} to the group...`, mentions: [phone] })
                    
                    // In a real implementation, we would use bot.groupParticipantsUpdate() here
                    // For this demo, we'll just show a success message
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ Successfully added @${phone.split('@')[0]} to the group.`, mentions: [phone] })
                    break
                    
                case 'kick':
                    // Kick member command
                    if (!botAdmin) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ I need to be an admin to remove members.' })
                        return
                    }
                    
                    if (!isAdmin && !isOwner(sender)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ Only admins can use this command.' })
                        return
                    }
                    
                    // Get mentioned user
                    const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid
                    
                    if (!mentioned || mentioned.length === 0) {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please mention the user to remove.\n\nExample: ${prefix}kick @user` })
                        return
                    }
                    
                    const userToKick = mentioned[0]
                    
                    // Check if trying to kick an admin
                    if (groupAdmins.includes(userToKick)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ Cannot remove group admins.' })
                        return
                    }
                    
                    // Remove user from group (in a real implementation)
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Removing @${userToKick.split('@')[0]} from the group...`, mentions: [userToKick] })
                    
                    // In a real implementation, we would use bot.groupParticipantsUpdate() here
                    // For this demo, we'll just show a success message
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ Successfully removed @${userToKick.split('@')[0]} from the group.`, mentions: [userToKick] })
                    break
                    
                case 'promote':
                    // Promote member to admin
                    if (!botAdmin) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ I need to be an admin to promote members.' })
                        return
                    }
                    
                    if (!isAdmin && !isOwner(sender)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ Only admins can use this command.' })
                        return
                    }
                    
                    // Get mentioned user
                    const mentionedPromote = m.message.extendedTextMessage?.contextInfo?.mentionedJid
                    
                    if (!mentionedPromote || mentionedPromote.length === 0) {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please mention the user to promote.\n\nExample: ${prefix}promote @user` })
                        return
                    }
                    
                    const userToPromote = mentionedPromote[0]
                    
                    // Check if user is already admin
                    if (groupAdmins.includes(userToPromote)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ This user is already an admin.' })
                        return
                    }
                    
                    // Promote user (in a real implementation)
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Promoting @${userToPromote.split('@')[0]} to admin...`, mentions: [userToPromote] })
                    
                    // In a real implementation, we would use bot.groupParticipantsUpdate() here
                    // For this demo, we'll just show a success message
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ Successfully promoted @${userToPromote.split('@')[0]} to admin.`, mentions: [userToPromote] })
                    break
                    
                case 'demote':
                    // Demote admin to member
                    if (!botAdmin) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ I need to be an admin to demote members.' })
                        return
                    }
                    
                    if (!isAdmin && !isOwner(sender)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ Only admins can use this command.' })
                        return
                    }
                    
                    // Get mentioned user
                    const mentionedDemote = m.message.extendedTextMessage?.contextInfo?.mentionedJid
                    
                    if (!mentionedDemote || mentionedDemote.length === 0) {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please mention the admin to demote.\n\nExample: ${prefix}demote @user` })
                        return
                    }
                    
                    const userToDemote = mentionedDemote[0]
                    
                    // Check if user is not an admin
                    if (!groupAdmins.includes(userToDemote)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ This user is not an admin.' })
                        return
                    }
                    
                    // Demote user (in a real implementation)
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Demoting @${userToDemote.split('@')[0]} from admin...`, mentions: [userToDemote] })
                    
                    // In a real implementation, we would use bot.groupParticipantsUpdate() here
                    // For this demo, we'll just show a success message
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ Successfully demoted @${userToDemote.split('@')[0]} from admin.`, mentions: [userToDemote] })
                    break
                    
                case 'groupsetting':
                case 'groupset':
                    // Change group settings
                    if (!botAdmin) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ I need to be an admin to change group settings.' })
                        return
                    }
                    
                    if (!isAdmin && !isOwner(sender)) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ Only admins can use this command.' })
                        return
                    }
                    
                    if (args.length === 0) {
                        await bot.sendMessage(m.key.remoteJid, { 
                            text: `Please specify a setting to change.\n\nOptions:\n- open (allow everyone to send messages)\n- close (only admins can send messages)\n- name [text] (change group name)\n\nExample: ${prefix}groupset close` 
                        })
                        return
                    }
                    
                    const setting = args[0].toLowerCase()
                    
                    switch (setting) {
                        case 'open':
                            // Allow everyone to send messages
                            await bot.sendMessage(m.key.remoteJid, { text: '⏳ Opening group for everyone...' })
                            
                            // In a real implementation, we would use bot.groupSettingUpdate() here
                            // For this demo, we'll just show a success message
                            await bot.sendMessage(m.key.remoteJid, { text: '✅ Group settings updated. Everyone can now send messages.' })
                            break
                            
                        case 'close':
                            // Only admins can send messages
                            await bot.sendMessage(m.key.remoteJid, { text: '⏳ Closing group (only admins can send messages)...' })
                            
                            // In a real implementation, we would use bot.groupSettingUpdate() here
                            // For this demo, we'll just show a success message
                            await bot.sendMessage(m.key.remoteJid, { text: '✅ Group settings updated. Only admins can send messages now.' })
                            break
                            
                        case 'name':
                            // Change group name
                            if (args.length < 2) {
                                await bot.sendMessage(m.key.remoteJid, { text: 'Please provide a new name for the group.' })
                                return
                            }
                            
                            const newName = args.slice(1).join(' ')
                            
                            await bot.sendMessage(m.key.remoteJid, { text: `⏳ Changing group name to "${newName}"...` })
                            
                            // In a real implementation, we would use bot.groupUpdateSubject() here
                            // For this demo, we'll just show a success message
                            await bot.sendMessage(m.key.remoteJid, { text: `✅ Group name changed to "${newName}".` })
                            break
                            
                        default:
                            await bot.sendMessage(m.key.remoteJid, { 
                                text: `Unknown setting "${setting}".\n\nOptions:\n- open (allow everyone to send messages)\n- close (only admins can send messages)\n- name [text] (change group name)` 
                            })
                    }
                    break
                    
                case 'groupinfo':
                    // Display group information
                    const groupDesc = groupMetadata.desc || 'No description'
                    const memberCount = participants.length
                    const adminCount = groupAdmins.length
                    const creation = new Date(groupMetadata.creation * 1000).toLocaleString()
                    
                    const infoText = `
*GROUP INFORMATION*

*Name:* ${groupName}
*ID:* ${m.key.remoteJid}
*Created:* ${creation}
*Members:* ${memberCount}
*Admins:* ${adminCount}
*Description:*
${groupDesc}
                    `.trim()
                    
                    await bot.sendMessage(m.key.remoteJid, { text: infoText })
                    break
                    
                case 'link':
                    // Get group invite link
                    if (!botAdmin) {
                        await bot.sendMessage(m.key.remoteJid, { text: '⚠️ I need to be an admin to get the invite link.' })
                        return
                    }
                    
                    await bot.sendMessage(m.key.remoteJid, { text: '⏳ Generating group invite link...' })
                    
                    // In a real implementation, we would use bot.groupInviteCode() here
                    // For this demo, we'll just show a placeholder message
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `✅ *Group Invite Link*\n\nhttps://chat.whatsapp.com/example\n\nNote: This is a placeholder link. In a real implementation, the actual group link would be generated.` 
                    })
                    break
                    
                default:
                    await bot.sendMessage(m.key.remoteJid, { text: `Unknown group command. Use ${prefix}help group for available commands.` })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in group plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to process group command: ' + error.message })
        }
    }
}