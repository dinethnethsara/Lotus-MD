/**
 * Ping plugin for Lotus MD
 * Checks bot response time
 */

const config = require('../config')
const chalk = require('chalk')

// Export plugin info
module.exports = {
    name: 'ping',
    description: 'Check bot response time',
    commands: ['ping', 'speed', 'response'],
    usage: '.ping',
    category: 'core',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Record start time
            const start = new Date().getTime()
            
            // Send initial message
            const sentMsg = await bot.sendMessage(m.key.remoteJid, { text: '🔄 Testing ping...' })
            
            // Calculate response time
            const end = new Date().getTime()
            const responseTime = end - start
            
            // Create response message
            let pingResponse
            
            if (responseTime < 300) {
                pingResponse = `⚡ *PING: ${responseTime}ms*\n\n*Status:* Excellent`
            } else if (responseTime < 600) {
                pingResponse = `🚀 *PING: ${responseTime}ms*\n\n*Status:* Good`
            } else if (responseTime < 1000) {
                pingResponse = `🟢 *PING: ${responseTime}ms*\n\n*Status:* Fair`
            } else {
                pingResponse = `🔴 *PING: ${responseTime}ms*\n\n*Status:* Poor`
            }
            
            // Send response with ping time
            await bot.sendMessage(m.key.remoteJid, { 
                text: pingResponse,
                edit: sentMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in ping plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: config.errorReply })
        }
    }
}