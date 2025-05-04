/**
 * Quote Maker plugin for Lotus MD
 * Create beautiful quote images
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'quotemaker',
    description: 'Create beautiful quote images',
    commands: ['quotemaker', 'makequote', 'quotepic', 'qmaker'],
    usage: '.quotemaker [text] | [author]',
    category: 'creator',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's text to make a quote
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide text to create a quote.\n\nExamples:\n${prefix}quotemaker Life is what happens when you're busy making other plans | John Lennon\n${prefix}quotemaker The greatest glory in living lies not in never falling, but in rising every time we fall` 
                })
                return
            }
            
            // Parse quote text and author
            let quoteText, author
            
            if (text.includes('|')) {
                const parts = text.split('|').map(part => part.trim())
                quoteText = parts[0]
                author = parts[1] || 'Unknown'
            } else {
                quoteText = text
                author = 'Unknown'
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🎨 Creating quote image...` 
            })
            
            // Generate random theme/style
            const themes = ['nature', 'ocean', 'sunset', 'abstract', 'minimal', 'dark', 'light', 'vintage']
            const randomTheme = themes[Math.floor(Math.random() * themes.length)]
            
            // In a real implementation, this would call an image generation API or use canvas
            // For now, we're just simulating the process
            
            // Generate the quote image (this is a placeholder)
            const imagePath = await generateQuoteImage(quoteText, author, randomTheme)
            
            // Send the quote image
            await bot.sendMessage(m.key.remoteJid, {
                image: { url: imagePath },
                caption: `💬 *Quote by ${author}*\n\n_${quoteText}_\n\n*Theme:* ${randomTheme}\n*Created with:* Lotus MD Quote Maker`
            })
            
            // Delete the processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
            // In a real implementation, clean up the temporary file
            // await fs.unlink(imagePath)
            
        } catch (error) {
            console.error(chalk.red(`Error in Quote Maker plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to create quote image: ' + error.message })
        }
    }
}

/**
 * Generate a quote image
 * @param {string} text - Quote text
 * @param {string} author - Quote author
 * @param {string} theme - Image theme
 * @returns {Promise<string>} - Path to generated image
 */
async function generateQuoteImage(text, author, theme) {
    try {
        // This is a placeholder for the actual image generation
        // In a real implementation, this would use canvas or an external API
        
        // Create temp directory if it doesn't exist
        const directory = path.join(process.cwd(), 'temp')
        await fs.ensureDir(directory)
        
        // Generate a filename
        const filename = `quote_${generateRandomId()}.jpg`
        const filepath = path.join(directory, filename)
        
        // In a real implementation, the image generation would happen here
        // For this demo, we'll just return a placeholder path
        
        return filepath
    } catch (error) {
        console.error('Error generating quote image:', error)
        throw error
    }
}