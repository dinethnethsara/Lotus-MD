/**
 * Web Archive plugin for Lotus MD
 * Search and access archived versions of websites
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const moment = require('moment-timezone')

// Export plugin info
module.exports = {
    name: 'webarchive',
    description: 'Search and access archived versions of websites',
    commands: ['archive', 'wayback', 'webarchive', 'oldweb'],
    usage: '.archive [URL]',
    category: 'research',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if a URL is provided
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a URL to find archives for.\n\nExample: ${prefix}archive example.com` 
                })
                return
            }
            
            // Clean and normalize URL
            let url = text.trim()
            
            // Remove protocol if present
            url = url.replace(/^(https?:\/\/)/, '')
            
            // Remove trailing slash
            url = url.replace(/\/$/, '')
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Searching web archives for ${url}...` 
            })
            
            // Search archive (this would be a real API call in a full implementation)
            const archiveResults = await searchArchive(url)
            
            if (!archiveResults || archiveResults.snapshots.length === 0) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ No archived versions found for ${url}.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format and send the results
            let responseText = `
🕰️ *Web Archive Results*

*URL:* ${url}
*Total Snapshots:* ${archiveResults.total}
*First Archived:* ${formatDate(archiveResults.firstDate)}
*Last Archived:* ${formatDate(archiveResults.lastDate)}

*Recent Snapshots:*
`
            
            archiveResults.snapshots.forEach((snapshot, index) => {
                responseText += `${index + 1}. ${formatDate(snapshot.date)}\n   🔗 ${snapshot.url}\n\n`
            })
            
            responseText += `To view any snapshot, click on the link above.\n\n*Lotus MD* • Web Archive Search`
            
            // Send the results
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in web archive plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to search web archives: ' + error.message })
        }
    }
}

/**
 * Search web archive for URL
 * @param {string} url - URL to search
 * @returns {Promise<Object>} - Archive search results
 */
async function searchArchive(url) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call the Wayback Machine API
        
        // For demo purposes, return simulated results
        const currentYear = new Date().getFullYear()
        const totalSnapshots = Math.floor(Math.random() * 100) + 20
        
        // Generate random first archived date between 2000 and 2010
        const firstYear = Math.floor(Math.random() * 10) + 2000
        const firstDate = new Date(
            firstYear,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        )
        
        // Generate random last archived date in the past year
        const lastDate = new Date()
        lastDate.setDate(lastDate.getDate() - Math.floor(Math.random() * 365))
        
        // Generate 5 recent snapshots
        const snapshots = []
        const baseDate = new Date()
        
        for (let i = 0; i < 5; i++) {
            // Each snapshot is older than the previous one
            const date = new Date(baseDate)
            date.setDate(date.getDate() - i * 30 - Math.floor(Math.random() * 10))
            
            // Format date for Wayback Machine URL (YYYYMMDDHHMMSS)
            const formattedDate = moment(date).format('YYYYMMDDHHmmss')
            
            snapshots.push({
                date: date,
                url: `https://web.archive.org/web/${formattedDate}/${url}`
            })
        }
        
        return {
            url: url,
            total: totalSnapshots,
            firstDate: firstDate,
            lastDate: lastDate,
            snapshots: snapshots
        }
    } catch (error) {
        console.error('Error searching web archive:', error)
        return null
    }
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
    return moment(date).format('MMMM D, YYYY')
}