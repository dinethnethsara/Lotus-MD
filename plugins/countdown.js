/**
 * Countdown plugin for Lotus MD
 * Create and track countdown timers
 */

const chalk = require('chalk')
const config = require('../config')
const moment = require('moment-timezone')

// Store active countdowns in memory
const activeCountdowns = new Map()

// Export plugin info
module.exports = {
    name: 'countdown',
    description: 'Create and track countdown timers',
    commands: ['countdown', 'timer', 'remind'],
    usage: '.countdown [time] [event name]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if the command is used with arguments
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a time and event name for countdown.\n\nExamples:\n${prefix}countdown 10m Pizza is ready\n${prefix}countdown 2h Meeting\n${prefix}countdown 30s Break time over\n\nYou can use s (seconds), m (minutes), h (hours), d (days)`
                })
                return
            }
            
            // Parse time and event name
            const timeArg = args[0].toLowerCase()
            const eventName = args.slice(1).join(' ') || 'Countdown'
            
            // Validate time format
            if (!/^\d+[smhd]$/.test(timeArg)) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Invalid time format. Use format like 10s, 5m, 2h, 1d.`
                })
                return
            }
            
            // Parse time in seconds
            const timeValue = parseInt(timeArg.slice(0, -1))
            const timeUnit = timeArg.slice(-1)
            
            let timeInSeconds = timeValue
            
            if (timeUnit === 'm') timeInSeconds = timeValue * 60
            else if (timeUnit === 'h') timeInSeconds = timeValue * 60 * 60
            else if (timeUnit === 'd') timeInSeconds = timeValue * 24 * 60 * 60
            
            // Limit to reasonable values
            if (timeInSeconds < 5) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Countdown must be at least 5 seconds.`
                })
                return
            }
            
            if (timeInSeconds > 86400) { // 1 day
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Countdown cannot exceed 1 day. Please use a shorter duration.`
                })
                return
            }
            
            // Calculate target time
            const targetTime = moment().add(timeInSeconds, 'seconds')
            
            // Create countdown object
            const countdownId = `${sender}_${Date.now()}`
            const countdown = {
                id: countdownId,
                eventName: eventName,
                targetTime: targetTime,
                duration: timeInSeconds,
                sender: sender,
                chat: m.key.remoteJid,
                active: true
            }
            
            // Store countdown
            activeCountdowns.set(countdownId, countdown)
            
            // Send confirmation message
            await bot.sendMessage(m.key.remoteJid, { 
                text: `⏰ *Countdown Started*\n\n*Event:* ${eventName}\n*Time:* ${formatTime(timeInSeconds)}\n*Ends At:* ${targetTime.format('HH:mm:ss')}\n\nYou will be notified when the countdown finishes.`
            })
            
            // Set timeout to notify when countdown finishes
            setTimeout(async () => {
                // Check if countdown is still active (not cancelled)
                const countdownData = activeCountdowns.get(countdownId)
                
                if (countdownData && countdownData.active) {
                    // Send notification
                    await bot.sendMessage(countdownData.chat, { 
                        text: `⏰ *Countdown Finished*\n\n*Event:* ${countdownData.eventName}\n*Duration:* ${formatTime(countdownData.duration)}\n\n@${countdownData.sender.split('@')[0]} Your countdown has ended!`,
                        mentions: [countdownData.sender]
                    })
                    
                    // Remove from active countdowns
                    activeCountdowns.delete(countdownId)
                }
            }, timeInSeconds * 1000)
            
        } catch (error) {
            console.error(chalk.red(`Error in countdown plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to create countdown: ' + error.message })
        }
    }
}

/**
 * Format seconds to human-readable time
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
function formatTime(seconds) {
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        
        let result = `${minutes} minute${minutes !== 1 ? 's' : ''}`
        
        if (remainingSeconds > 0) {
            result += ` ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
        }
        
        return result
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600)
        const remainingMinutes = Math.floor((seconds % 3600) / 60)
        
        let result = `${hours} hour${hours !== 1 ? 's' : ''}`
        
        if (remainingMinutes > 0) {
            result += ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
        }
        
        return result
    } else {
        const days = Math.floor(seconds / 86400)
        const remainingHours = Math.floor((seconds % 86400) / 3600)
        
        let result = `${days} day${days !== 1 ? 's' : ''}`
        
        if (remainingHours > 0) {
            result += ` ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
        }
        
        return result
    }
}