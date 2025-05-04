/**
 * Website Screenshot plugin for Lotus MD
 * Take screenshots of websites
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'screenshot',
    description: 'Take screenshots of websites',
    commands: ['ss', 'screenshot', 'webss', 'capture'],
    usage: '.ss [URL]',
    category: 'tools',
    
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
                    text: `Please provide a URL to take screenshot of.\n\nExample: ${prefix}ss https://example.com` 
                })
                return
            }
            
            // Validate URL
            let url = text.trim()
            if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
                // Try adding https:// if not present
                if (!url.startsWith('http')) {
                    url = 'https://' + url
                } else {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `Invalid URL. Please provide a valid URL.` 
                    })
                    return
                }
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `📸 Taking screenshot of ${url}...` 
            })
            
            // Get website screenshot (this would be a real implementation in a full bot)
            const screenshotPath = await captureWebsite(url)
            
            if (!screenshotPath) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Failed to take screenshot. Please check the URL and try again.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Send the screenshot
            await bot.sendMessage(m.key.remoteJid, {
                image: { url: screenshotPath },
                caption: `📸 *Website Screenshot*\n\n*URL:* ${url}\n\n*Lotus MD* • Website Screenshot`
            })
            
            // Delete the processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
            // Clean up
            if (fs.existsSync(screenshotPath)) {
                await fs.unlink(screenshotPath)
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in screenshot plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to take screenshot: ' + error.message })
        }
    }
}

/**
 * Capture website screenshot
 * @param {string} url - Website URL
 * @returns {Promise<string>} - Path to screenshot image
 */
async function captureWebsite(url) {
    try {
        // This is a placeholder for the actual screenshot capture
        // In a real implementation, this would use a library like puppeteer
        
        // Create temp directory if it doesn't exist
        const directory = path.join(process.cwd(), 'temp')
        await fs.ensureDir(directory)
        
        // Generate a filename
        const filename = `screenshot_${generateRandomId()}.png`
        const outputPath = path.join(directory, filename)
        
        // In a real implementation, the screenshot capture would happen here
        // For example, with puppeteer:
        /*
        const puppeteer = require('puppeteer')
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
        await page.setViewport({ width: 1280, height: 800 })
        await page.screenshot({ path: outputPath, fullPage: false })
        await browser.close()
        */
        
        // For this demo, we'll just return the path (the file wouldn't actually exist)
        return outputPath
    } catch (error) {
        console.error('Error capturing website screenshot:', error)
        return null
    }
}