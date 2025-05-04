/**
 * Instagram Downloader plugin for Lotus MD
 * Download posts, reels, and stories from Instagram
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'igdl',
    description: 'Download content from Instagram',
    commands: ['igdl', 'ig', 'instagram', 'igreels', 'igstory'],
    usage: '.igdl [Instagram URL]',
    category: 'downloader',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Determine download type based on command
            const isReels = command === 'igreels'
            const isStory = command === 'igstory'
            
            // Check if there's a URL or username to process
            if (!text) {
                let usage
                
                if (isStory) {
                    usage = `Please provide an Instagram username to download story.\n\nExample: ${prefix}igstory username`
                } else {
                    usage = `Please provide an Instagram URL to download.\n\nExamples:\n${prefix}igdl https://www.instagram.com/p/ABC123\n${prefix}igreels https://www.instagram.com/reels/ABC123`
                }
                
                await bot.sendMessage(m.key.remoteJid, { text: usage })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `📥 Processing ${isStory ? 'story from ' + text : 'Instagram download'}...` 
            })
            
            let downloadResult
            
            if (isStory) {
                // Download story (username provided)
                const username = text.replace('@', '').trim()
                downloadResult = await downloadIGStory(username)
            } else {
                // Download post or reel (URL provided)
                const url = text.trim()
                
                // Basic validation
                if (!url.includes('instagram.com')) {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `Invalid Instagram URL. Please provide a valid Instagram link.`,
                        edit: processingMsg.key
                    })
                    return
                }
                
                downloadResult = await downloadInstagram(url)
            }
            
            if (!downloadResult || downloadResult.medias.length === 0) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Failed to download content. Please check the URL/username and try again.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Update message with download count
            await bot.sendMessage(m.key.remoteJid, { 
                text: `✅ Found ${downloadResult.medias.length} media item${downloadResult.medias.length > 1 ? 's' : ''}. Sending...`,
                edit: processingMsg.key
            })
            
            // Send each media
            for (let i = 0; i < downloadResult.medias.length; i++) {
                const media = downloadResult.medias[i]
                const caption = i === 0 ? 
                    `*Instagram ${isStory ? 'Story' : isReels ? 'Reel' : 'Post'}*\n\n${downloadResult.caption || ''}\n\n${media.type} ${i + 1}/${downloadResult.medias.length}` : 
                    `${media.type} ${i + 1}/${downloadResult.medias.length}`
                
                if (media.type === 'image') {
                    await bot.sendMessage(m.key.remoteJid, {
                        image: { url: media.url },
                        caption: caption
                    })
                } else if (media.type === 'video') {
                    await bot.sendMessage(m.key.remoteJid, {
                        video: { url: media.url },
                        caption: caption
                    })
                }
                
                // Add a small delay between messages to prevent flooding
                if (downloadResult.medias.length > 1 && i < downloadResult.medias.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }
            }
            
            // Delete the processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in Instagram downloader plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to download from Instagram: ' + error.message })
        }
    }
}

/**
 * Download Instagram post or reel
 * @param {string} url - Instagram URL
 * @returns {Promise<Object>} - Download result with media URLs
 */
async function downloadInstagram(url) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call an Instagram downloader API
        
        // Simulate successful download
        const isReel = url.includes('/reels/')
        
        return {
            caption: 'This is an Instagram ' + (isReel ? 'reel' : 'post') + ' caption. #instagram #lotus #download',
            medias: isReel ? 
                [{ type: 'video', url: 'https://example.com/video.mp4' }] : 
                [
                    { type: 'image', url: 'https://example.com/image1.jpg' },
                    { type: 'image', url: 'https://example.com/image2.jpg' },
                    { type: 'video', url: 'https://example.com/video.mp4' }
                ]
        }
    } catch (error) {
        console.error('Error downloading from Instagram:', error)
        return null
    }
}

/**
 * Download Instagram story
 * @param {string} username - Instagram username
 * @returns {Promise<Object>} - Download result with media URLs
 */
async function downloadIGStory(username) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call an Instagram story downloader API
        
        // Simulate successful download
        return {
            caption: `Stories from @${username}`,
            medias: [
                { type: 'image', url: 'https://example.com/story1.jpg' },
                { type: 'video', url: 'https://example.com/story2.mp4' }
            ]
        }
    } catch (error) {
        console.error('Error downloading Instagram story:', error)
        return null
    }
}