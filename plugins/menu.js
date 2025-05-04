/**
 * Menu plugin for Lotus MD
 * Display stylish and organized bot commands menu
 */

const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { loadPlugins } = require('../lib/pluginLoader')

// Export plugin info
module.exports = {
    name: 'menu',
    description: 'Display complete bot commands in a stylish menu',
    commands: ['menu', 'list', 'commands', 'dashboard'],
    usage: '.menu [category]',
    category: 'core',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Load all plugins to get commands
            const plugins = await loadPlugins('./plugins')
            
            // Group plugins by category
            const categories = {}
            
            plugins.forEach(plugin => {
                const category = plugin.category || 'misc'
                
                if (!categories[category]) {
                    categories[category] = []
                }
                
                categories[category].push(plugin)
            })
            
            // Check if specific category is requested
            if (text && categories[text.toLowerCase()]) {
                // Show specific category
                const categoryName = text.toLowerCase()
                const categoryPlugins = categories[categoryName]
                
                const categoryEmoji = getCategoryEmoji(categoryName)
                
                const header = `
╭───「 ${categoryEmoji} *LOTUS MD - ${categoryName.toUpperCase()}* 」───
│
│ Hello ${pushname}!
│
│ *Prefix:* ${prefix}
│ *User:* @${m.sender.split('@')[0]}
│
│ *${categoryName.toUpperCase()} COMMANDS*
│`.trim()
                
                let commandsList = ''
                
                categoryPlugins.forEach(plugin => {
                    commandsList += `│\n│ ▢ *${prefix}${plugin.commands[0]}*`
                    
                    if (plugin.usage) {
                        const shortUsage = plugin.usage.split('\n')[0].replace(prefix, '')
                        commandsList += ` - ${shortUsage}`
                    } else if (plugin.description) {
                        commandsList += ` - ${plugin.description}`
                    }
                })
                
                const footer = `│
│
╰───────────────────────

_Type ${prefix}help <command> for detailed information_

*Lotus MD* • Powered by Lotus Mansion
`.trim()
                
                const menuText = `${header}${commandsList}\n${footer}`
                
                await bot.sendMessage(m.key.remoteJid, {
                    text: menuText,
                    mentions: [m.sender]
                })
                
            } else {
                // Show all categories in a compact menu
                const header = `
╭───「 🌸 *LOTUS MD MENU* 」───
│
│ Hello ${pushname}!
│
│ *Prefix:* ${prefix}
│ *User:* @${m.sender.split('@')[0]}
│ *Time:* ${new Date().toLocaleTimeString()}
│
│ *COMMAND CATEGORIES*
│`.trim()
                
                let categoriesList = ''
                
                // Sort categories alphabetically but put core and research first
                const sortedCategories = Object.keys(categories).sort((a, b) => {
                    if (a === 'core') return -1
                    if (b === 'core') return 1
                    if (a === 'research') return -1
                    if (b === 'research') return 1
                    return a.localeCompare(b)
                })
                
                sortedCategories.forEach(category => {
                    const emoji = getCategoryEmoji(category)
                    const count = categories[category].length
                    categoriesList += `│\n│ ${emoji} *${category.toUpperCase()}* - ${count} command${count > 1 ? 's' : ''}`
                })
                
                const footer = `│
│
│ Send *${prefix}menu <category>* to see specific commands
│ Example: *${prefix}menu research*
│
│ *Total Commands:* ${plugins.length}
│ *Bot Version:* 1.0.0
│
╰───────────────────────

*Lotus MD* • Powered by Lotus Mansion
`.trim()
                
                const menuText = `${header}${categoriesList}\n${footer}`
                
                // Get the bot's profile picture if available
                let ppUrl
                try {
                    ppUrl = './logo.png' // Use the bot logo as fallback
                } catch (error) {
                    console.log('Error getting profile picture:', error)
                    ppUrl = './logo.png'
                }
                
                // Send menu with profile picture
                await bot.sendMessage(m.key.remoteJid, {
                    image: { url: ppUrl },
                    caption: menuText,
                    mentions: [m.sender]
                })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in menu plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: config.errorReply })
        }
    }
}

/**
 * Get emoji for category
 * @param {string} category - Command category
 * @returns {string} - Category emoji
 */
function getCategoryEmoji(category) {
    const emojis = {
        'core': '⚙️',
        'admin': '👑',
        'group': '👥',
        'downloader': '📥',
        'media': '📷',
        'tools': '🔧',
        'fun': '🎮',
        'games': '🎲',
        'ai': '🤖',
        'creator': '🎨',
        'search': '🔍',
        'owner': '👤',
        'info': 'ℹ️',
        'misc': '🔮',
        'anime': '🌸',
        'internet': '🌐',
        'sticker': '🖼️',
        'converter': '🔄',
        'education': '📚',
        'research': '🔬',
        'developer': '👨‍💻'
    }
    
    return emojis[category] || '🔹'
}