/**
 * Owner plugin for Lotus MD
 * Commands that can only be used by the bot owner
 */

const chalk = require('chalk')
const config = require('../config')
const { isOwner } = require('../lib/utils')
const fs = require('fs-extra')
const path = require('path')
const { reloadPlugin } = require('../lib/pluginLoader')

// Export plugin info
module.exports = {
    name: 'owner',
    description: 'Commands that can only be used by the bot owner',
    commands: ['owner', 'restart', 'shutdown', 'eval', 'block', 'unblock', 'reload'],
    usage: '.owner',
    category: 'owner',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if user is the owner for restricted commands
            const userIsOwner = isOwner(sender)
            
            // Owner-only commands
            if (['restart', 'shutdown', 'eval', 'block', 'unblock', 'reload'].includes(command)) {
                if (!userIsOwner) {
                    await bot.sendMessage(m.key.remoteJid, { text: '⚠️ This command can only be used by the bot owner.' })
                    return
                }
            }
            
            // Handle different owner commands
            switch (command) {
                case 'owner':
                    // Display owner information
                    const ownerNumber = config.owner[0].split('@')[0]
                    
                    // In a real implementation, we would send owner contact or an image
                    // For this demo, we'll just send text
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `📱 *Bot Owner*\n\n@${ownerNumber}\n\nContact the owner for any issues or inquiries about the bot.`,
                        mentions: config.owner
                    })
                    break
                    
                case 'restart':
                    // Restart the bot
                    await bot.sendMessage(m.key.remoteJid, { text: '🔄 Restarting bot...' })
                    
                    // In a real implementation, this would actually restart the bot
                    // For this demo, we'll just simulate a restart
                    
                    setTimeout(() => {
                        bot.sendMessage(m.key.remoteJid, { text: '✅ Bot restarted successfully!' })
                    }, 3000)
                    break
                    
                case 'shutdown':
                    // Shutdown the bot
                    await bot.sendMessage(m.key.remoteJid, { text: '🛑 Shutting down bot...' })
                    
                    // In a real implementation, this would actually shut down the bot process
                    // For this demo, we'll just send a message
                    
                    await bot.sendMessage(m.key.remoteJid, { text: '✅ Bot shutdown command received. In a real implementation, the bot would now be offline.' })
                    break
                    
                case 'eval':
                    // Evaluate JavaScript code (dangerous but useful for debugging)
                    if (!text) {
                        await bot.sendMessage(m.key.remoteJid, { text: 'Please provide code to evaluate.' })
                        return
                    }
                    
                    await bot.sendMessage(m.key.remoteJid, { text: '⚙️ Evaluating code...' })
                    
                    let result
                    try {
                        // In a real implementation, this would actually evaluate code
                        // For this demo, we'll just pretend to evaluate
                        
                        // !!! WARNING: eval() is dangerous and should be used with extreme caution
                        // result = eval(text)
                        
                        result = `[DEMO] Evaluation result would appear here.\nCode: ${text}`
                    } catch (err) {
                        result = `Error: ${err}`
                    }
                    
                    await bot.sendMessage(m.key.remoteJid, { text: result })
                    break
                    
                case 'block':
                    // Block a user
                    // Get user to block
                    let userToBlock
                    
                    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                        // User was mentioned
                        userToBlock = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
                    } else if (args.length > 0) {
                        // User ID provided as argument
                        let phone = args[0].replace(/[^0-9]/g, '')
                        if (!phone.startsWith('1') && phone.length === 10) phone = '1' + phone
                        userToBlock = phone + '@s.whatsapp.net'
                    } else {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please specify a user to block.\n\nExample: ${prefix}block @user or ${prefix}block 1234567890` })
                        return
                    }
                    
                    // Block the user
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Blocking @${userToBlock.split('@')[0]}...`, mentions: [userToBlock] })
                    
                    // In a real implementation, we would use bot.updateBlockStatus() here
                    // For this demo, we'll just show a success message
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ @${userToBlock.split('@')[0]} has been blocked.`, mentions: [userToBlock] })
                    break
                    
                case 'unblock':
                    // Unblock a user
                    // Get user to unblock
                    let userToUnblock
                    
                    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                        // User was mentioned
                        userToUnblock = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
                    } else if (args.length > 0) {
                        // User ID provided as argument
                        let phone = args[0].replace(/[^0-9]/g, '')
                        if (!phone.startsWith('1') && phone.length === 10) phone = '1' + phone
                        userToUnblock = phone + '@s.whatsapp.net'
                    } else {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please specify a user to unblock.\n\nExample: ${prefix}unblock @user or ${prefix}unblock 1234567890` })
                        return
                    }
                    
                    // Unblock the user
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Unblocking @${userToUnblock.split('@')[0]}...`, mentions: [userToUnblock] })
                    
                    // In a real implementation, we would use bot.updateBlockStatus() here
                    // For this demo, we'll just show a success message
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ @${userToUnblock.split('@')[0]} has been unblocked.`, mentions: [userToUnblock] })
                    break
                    
                case 'reload':
                    // Reload a plugin
                    if (args.length === 0) {
                        await bot.sendMessage(m.key.remoteJid, { text: `Please specify a plugin to reload.\n\nExample: ${prefix}reload help` })
                        return
                    }
                    
                    const pluginName = args[0].toLowerCase()
                    
                    await bot.sendMessage(m.key.remoteJid, { text: `⏳ Reloading plugin: ${pluginName}...` })
                    
                    // In a real implementation, this would actually reload the plugin
                    // For this demo, we'll just simulate success
                    
                    // This would call the reloadPlugin function from pluginLoader.js
                    // const plugin = await reloadPlugin(pluginName, './plugins')
                    
                    await bot.sendMessage(m.key.remoteJid, { text: `✅ Plugin "${pluginName}" reloaded successfully!` })
                    break
                    
                default:
                    await bot.sendMessage(m.key.remoteJid, { text: `Unknown owner command. Use ${prefix}help owner for available commands.` })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in owner plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to process owner command: ' + error.message })
        }
    }
}