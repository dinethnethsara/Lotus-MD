/**
 * Help plugin for Lotus MD
 * Displays available commands and their usage
 */

const config = require('../config')
const chalk = require('chalk')

// Export plugin info
module.exports = {
    name: 'help',
    description: 'Display help menu and command information',
    commands: ['help', 'menu', 'commands'],
    usage: '.help [command]',
    category: 'core',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // If specific command help is requested
            if (args.length > 0) {
                const cmdName = args[0].toLowerCase()
                
                // This would be implemented to search through all loaded plugins
                // For now, let's return a simple message
                return await bot.sendMessage(m.key.remoteJid, {
                    text: `*Command: ${prefix}${cmdName}*\n\nDetailed help for specific commands will be implemented soon.`
                })
            }
            
            // Main help menu
            const helpText = `
╭───「 *LOTUS MD BOT* 」───
│
│ Hello ${pushname}!
│
│ *Prefix:* ${prefix}
│ *User:* @${m.sender.split('@')[0]}
│
│ ⚡ *CORE COMMANDS* ⚡
│
│ ▢ ${prefix}help - Shows this menu
│ ▢ ${prefix}menu - Displays menu with all commands
│ ▢ ${prefix}ping - Check bot speed
│ ▢ ${prefix}info - Bot information
│
│ ⚡ *STICKER COMMANDS* ⚡
│
│ ▢ ${prefix}sticker - Create sticker
│ ▢ ${prefix}toimg - Sticker to image
│
│ ⚡ *DOWNLOAD COMMANDS* ⚡
│
│ ▢ ${prefix}yta - YouTube audio
│ ▢ ${prefix}ytv - YouTube video
│ ▢ ${prefix}igdl - Instagram download
│ ▢ ${prefix}tiktok - TikTok download
│
│ ⚡ *GROUP COMMANDS* ⚡
│
│ ▢ ${prefix}add - Add member
│ ▢ ${prefix}kick - Remove member
│ ▢ ${prefix}promote - Promote to admin
│ ▢ ${prefix}demote - Demote from admin
│ ▢ ${prefix}groupset - Group settings
│
│ ⚡ *RESEARCH COMMANDS* ⚡
│
│ ▢ ${prefix}scrape - Extract text from website
│ ▢ ${prefix}readpdf - Extract text from PDF
│ ▢ ${prefix}scholar - Search academic papers
│ ▢ ${prefix}define - Dictionary lookup
│ ▢ ${prefix}encyclopedia - Lookup encyclopedia
│ ▢ ${prefix}news - Get latest news
│ ▢ ${prefix}archive - Web archive search
│ ▢ ${prefix}wiki - Wikipedia search
│
│ ⚡ *SEARCH COMMANDS* ⚡
│
│ ▢ ${prefix}google - Google search
│ ▢ ${prefix}lyrics - Find song lyrics
│ ▢ ${prefix}movie - Get movie info
│ ▢ ${prefix}tv - Get TV show info
│
│ ⚡ *TOOLS COMMANDS* ⚡
│
│ ▢ ${prefix}tts - Text to speech
│ ▢ ${prefix}translate - Translate text
│ ▢ ${prefix}weather - Weather info
│ ▢ ${prefix}calc - Calculator
│ ▢ ${prefix}currency - Currency converter
│ ▢ ${prefix}ocr - Extract text from image
│ ▢ ${prefix}qr - Generate QR code
│ ▢ ${prefix}readqr - Read QR code
│ ▢ ${prefix}shorten - Shorten URL
│ ▢ ${prefix}ss - Take website screenshot
│ ▢ ${prefix}detectlang - Detect language
│
│ ⚡ *FUN COMMANDS* ⚡
│
│ ▢ ${prefix}meme - Random meme
│ ▢ ${prefix}joke - Random joke
│ ▢ ${prefix}quote - Inspirational quote
│
│ ⚡ *AI COMMANDS* ⚡
│
│ ▢ ${prefix}ai - Chat with AI
│ ▢ ${prefix}imagine - Generate image
│
│ ⚡ *DEVELOPER COMMANDS* ⚡
│
│ ▢ ${prefix}run - Execute code
│ ▢ ${prefix}truecaller - Phone lookup
│
╰───────────────────────
            
_Type ${prefix}help <command> for detailed information_

*Lotus MD* • Powered by Lotus Mansion
`.trim()
            
            // Send the help menu
            await bot.sendMessage(m.key.remoteJid, {
                text: helpText,
                mentions: [m.sender]
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in help plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: config.errorReply })
        }
    }
}