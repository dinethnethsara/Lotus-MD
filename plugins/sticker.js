/**
 * Sticker plugin for Lotus MD
 * Creates stickers from images, videos and URLs
 */

const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path')
const { downloadMedia } = require('../lib/utils')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'sticker',
    description: 'Create stickers from images, videos, or URLs',
    commands: ['sticker', 's', 'stiker'],
    usage: '.sticker [pack name|author name]',
    category: 'media',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Reply with process message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { text: '⏳ Creating sticker...' })
            
            // Handle different message types
            const messageType = Object.keys(m.message)[0]
            
            // Check if message contains media
            let mediaPath
            
            if (messageType === 'imageMessage' || messageType === 'videoMessage') {
                // Download the media
                mediaPath = await downloadMedia(m, bot)
            } else if (messageType === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo?.quotedMessage) {
                // Handle quoted media
                const quotedMsg = m.message.extendedTextMessage.contextInfo.quotedMessage
                const quotedType = Object.keys(quotedMsg)[0]
                
                if (quotedType === 'imageMessage' || quotedType === 'videoMessage') {
                    // Create a new message object for the quoted message
                    const quotedM = {
                        message: quotedMsg,
                        mtype: quotedType
                    }
                    
                    // Download the quoted media
                    mediaPath = await downloadMedia(quotedM, bot)
                } else {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: 'Please send or quote an image or video to convert to sticker',
                        edit: processingMsg.key
                    })
                    return
                }
            } else {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: 'Please send or quote an image or video to convert to sticker',
                    edit: processingMsg.key
                })
                return
            }
            
            // Process sticker options from args
            let packname = config.stickerPackname
            let author = config.stickerAuthor
            
            if (text) {
                const splits = text.split('|')
                if (splits.length >= 1) packname = splits[0].trim()
                if (splits.length >= 2) author = splits[1].trim()
            }
            
            // Create sticker
            const sticker = await createSticker(mediaPath, { packname, author })
            
            // Send the sticker
            await bot.sendMessage(m.key.remoteJid, { 
                sticker: sticker
            })
            
            // Delete processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
            // Clean up temporary files
            if (fs.existsSync(mediaPath)) {
                await fs.unlink(mediaPath)
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in sticker plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to create sticker: ' + error.message })
        }
    }
}

/**
 * Create sticker from media
 * @param {string} media - Path to media file
 * @param {Object} options - Sticker options
 * @returns {Buffer} - Sticker buffer
 */
async function createSticker(media, options = {}) {
    // This is a placeholder function that would normally use sticker-creating libraries
    // In a real implementation, this would use libraries like sharp, ffmpeg, and exif
    // to create webp stickers with metadata
    
    // For now, let's just return the media file buffer
    // In a real implementation, this would convert the media to webp format
    return await fs.readFile(media)
}