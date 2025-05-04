/**
 * Sticker to Image converter plugin for Lotus MD
 * Convert stickers to images
 */

const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId, downloadMedia } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'toimg',
    description: 'Convert sticker to image',
    commands: ['toimg', 'toimage', 'unsticker'],
    usage: '.toimg (reply to a sticker)',
    category: 'converter',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if replying to a sticker
            if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please reply to a sticker to convert it to an image.\n\nExample: ${prefix}toimg (reply to a sticker)` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔄 Converting sticker to image...` 
            })
            
            // Download the sticker
            const stickerPath = await downloadMedia(m.quoted, bot)
            
            // Convert sticker to image (this would be a real implementation in a full bot)
            const imagePath = await convertStickerToImage(stickerPath)
            
            // Send the converted image
            await bot.sendMessage(m.key.remoteJid, {
                image: { url: imagePath },
                caption: `✅ *Sticker Converted to Image*\n\n*Lotus MD* • Sticker Converter`
            })
            
            // Delete the processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
            // Clean up temporary files
            if (fs.existsSync(stickerPath)) {
                await fs.unlink(stickerPath)
            }
            
            if (fs.existsSync(imagePath)) {
                await fs.unlink(imagePath)
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in toimg plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to convert sticker to image: ' + error.message })
        }
    }
}

/**
 * Convert sticker to image
 * @param {string} stickerPath - Path to sticker file
 * @returns {Promise<string>} - Path to converted image
 */
async function convertStickerToImage(stickerPath) {
    try {
        // This is a placeholder for the actual conversion
        // In a real implementation, this would use a library like sharp or ffmpeg
        
        // Create temp directory if it doesn't exist
        const directory = path.join(process.cwd(), 'temp')
        await fs.ensureDir(directory)
        
        // Generate a filename
        const filename = `converted_${generateRandomId()}.png`
        const outputPath = path.join(directory, filename)
        
        // In a real implementation, the conversion would happen here
        // For example, with sharp:
        /*
        const sharp = require('sharp')
        await sharp(stickerPath)
            .toFormat('png')
            .toFile(outputPath)
        */
        
        // For this demo, we'll just copy the sticker file
        await fs.copyFile(stickerPath, outputPath)
        
        return outputPath
    } catch (error) {
        console.error('Error converting sticker to image:', error)
        throw error
    }
}