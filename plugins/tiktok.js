/**
 * TikTok Downloader plugin for Lotus MD
 * Download videos and music from TikTok
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'tiktok',
    description: 'Download videos and music from TikTok without watermark',
    commands: ['tiktok', 'tt', 'ttdl', 'tiktoknowm', 'tiktokmusic', 'ttmusic'],
    usage: '.tiktok [TikTok URL]',
    category: 'downloader',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's a URL to process
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a TikTok URL to download.\n\nExample: ${prefix}tiktok https://vm.tiktok.com/ABCDEF/` 
                })
                return
            }
            
            // Determine if downloading music or video
            const isMusic = ['tiktokmusic', 'ttmusic'].includes(command)
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `📥 Processing TikTok ${isMusic ? 'music' : 'video'} download...` 
            })
            
            // Extract TikTok URL
            let tiktokUrl = text.trim()
            
            // Basic URL validation
            if (!tiktokUrl.match(/tiktok\.com/i)) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Invalid TikTok URL. Please provide a valid TikTok link.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Download from TikTok (this would be a real API call in a full implementation)
            const downloadResult = await downloadTikTok(tiktokUrl, isMusic)
            
            if (!downloadResult) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Failed to download from TikTok. Please check the URL and try again.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Update message with info
            await bot.sendMessage(m.key.remoteJid, { 
                text: `✅ Downloaded ${isMusic ? 'music' : 'video'} from @${downloadResult.author}. Sending...`,
                edit: processingMsg.key
            })
            
            if (isMusic) {
                // Send as audio
                await bot.sendMessage(m.key.remoteJid, {
                    audio: { url: downloadResult.music },
                    mimetype: 'audio/mp4',
                    fileName: `tiktok-${generateRandomId()}.mp3`,
                    caption: `🎵 *TikTok Music*\n\n👤 *Creator:* @${downloadResult.author}\n📝 *Description:* ${downloadResult.description}`
                })
            } else {
                // Send as video
                await bot.sendMessage(m.key.remoteJid, {
                    video: { url: downloadResult.video },
                    caption: `🎬 *TikTok Video*\n\n👤 *Creator:* @${downloadResult.author}\n❤️ *Likes:* ${downloadResult.likes}\n💬 *Comments:* ${downloadResult.comments}\n📝 *Description:* ${downloadResult.description}`,
                    gifPlayback: false
                })
            }
            
            // Delete the processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in TikTok downloader plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to download from TikTok: ' + error.message })
        }
    }
}

/**
 * Download content from TikTok
 * @param {string} url - TikTok URL
 * @param {boolean} musicOnly - Whether to download music only
 * @returns {Promise<Object>} - Download result
 */
async function downloadTikTok(url, musicOnly = false) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a TikTok downloader API
        
        // Simulate successful download
        return {
            author: 'username',
            description: 'This is a TikTok video description with #hashtags #trending',
            likes: '1.2M',
            comments: '10K',
            shares: '5.3K',
            video: 'https://example.com/tiktok-video-without-watermark.mp4',
            music: 'https://example.com/tiktok-music.mp3',
            cover: 'https://example.com/tiktok-cover.jpg'
        }
    } catch (error) {
        console.error('Error downloading from TikTok:', error)
        return null
    }
}