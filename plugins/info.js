/**
 * Info plugin for Lotus MD
 * Displays bot information and statistics
 */

const os = require('os')
const config = require('../config')
const chalk = require('chalk')
const moment = require('moment-timezone')
const { formatTime } = require('../lib/utils')

// Start time to calculate uptime
const startTime = new Date()

// Export plugin info
module.exports = {
    name: 'info',
    description: 'Display bot information and statistics',
    commands: ['info', 'about', 'botinfo'],
    usage: '.info',
    category: 'core',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Calculate uptime
            const uptime = formatTime(Math.floor((new Date() - startTime) / 1000))
            
            // Get system information
            const totalRAM = Math.floor(os.totalmem() / (1024 * 1024 * 1024))
            const freeRAM = Math.floor(os.freemem() / (1024 * 1024 * 1024))
            const usedRAM = totalRAM - freeRAM
            const ramUsage = ((usedRAM / totalRAM) * 100).toFixed(2)
            
            const cpu = os.cpus()[0]
            
            // Bot statistics (these would be populated in a real bot)
            const cmdCount = 0
            const userCount = 0
            const groupCount = 0
            
            // Format information message
            const infoText = `
╭───「 *LOTUS MD INFO* 」───
│
│ *Bot Name:* ${config.botName}
│ *Uptime:* ${uptime}
│ *Version:* 1.0.0
│ *Prefix:* ${prefix}
│ *Time:* ${moment().tz('Asia/Kolkata').format('HH:mm:ss')}
│ *Date:* ${moment().tz('Asia/Kolkata').format('DD/MM/YYYY')}
│
│ *Commands:* 50+
│ *Plugins:* 15+
│
│ ⚡ *SYSTEM INFO* ⚡
│
│ *Platform:* ${os.platform()}
│ *Node Version:* ${process.version}
│ *Processor:* ${cpu.model}
│ *RAM:* ${usedRAM}GB / ${totalRAM}GB (${ramUsage}%)
│ *Arch:* ${os.arch()}
│
│ ⚡ *STATISTICS* ⚡
│
│ *Commands Used:* ${cmdCount}
│ *Users:* ${userCount}
│ *Groups:* ${groupCount}
│
╰───────────────────────

*Lotus MD* • Powered by Lotus Mansion
`.trim()
            
            // Send the info message
            await bot.sendMessage(m.key.remoteJid, { text: infoText })
            
        } catch (error) {
            console.error(chalk.red(`Error in info plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: config.errorReply })
        }
    }
}