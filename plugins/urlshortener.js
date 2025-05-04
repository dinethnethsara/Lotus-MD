/**
 * URL Shortener plugin for Lotus MD
 * Shorten URLs and expand shortened links
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'urlshortener',
    description: 'Shorten URLs and expand shortened links',
    commands: ['shorten', 'shorturl', 'tinyurl', 'expandurl', 'unshorten'],
    usage: '.shorten [url] or .expandurl [shortened url]',
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
                const usage = ['shorten', 'shorturl', 'tinyurl'].includes(command) ?
                    `${prefix}${command} https://example.com/very/long/url` :
                    `${prefix}${command} https://tinyurl.com/abcdef`
                
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a URL to ${command}.\n\nExample: ${usage}` 
                })
                return
            }
            
            // Determine operation
            const isShorten = ['shorten', 'shorturl', 'tinyurl'].includes(command)
            
            // Basic URL validation
            const url = text.trim()
            if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Invalid URL. Please provide a valid URL starting with http:// or https://` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: isShorten ? `🔄 Shortening URL...` : `🔄 Expanding shortened URL...` 
            })
            
            // Process URL (this would be a real API call in a full implementation)
            const result = isShorten ? 
                await shortenUrl(url) : 
                await expandUrl(url)
            
            if (!result) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Failed to ${isShorten ? 'shorten' : 'expand'} URL. Please try again.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format and send the result
            const responseText = isShorten ?
                `
🔗 *URL Shortened*

*Original URL:*
${url}

*Shortened URL:*
${result}

*Lotus MD* • URL Shortener
`.trim() :
                `
🔗 *URL Expanded*

*Shortened URL:*
${url}

*Expanded URL:*
${result}

*Lotus MD* • URL Expander
`.trim()
            
            // Send the result
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in URL shortener plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to process URL: ' + error.message })
        }
    }
}

/**
 * Shorten a URL
 * @param {string} url - URL to shorten
 * @returns {Promise<string>} - Shortened URL
 */
async function shortenUrl(url) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a URL shortening API like TinyURL or Bitly
        
        // For demo purposes, create a simulated short URL
        const domain = 'tinyurl.com'
        const hash = generateRandomHash(6)
        
        return `https://${domain}/${hash}`
    } catch (error) {
        console.error('Error shortening URL:', error)
        return null
    }
}

/**
 * Expand a shortened URL
 * @param {string} url - Shortened URL to expand
 * @returns {Promise<string>} - Expanded URL
 */
async function expandUrl(url) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would follow redirects to get the final URL
        
        // For demo purposes, return a simulated expanded URL
        if (url.includes('tinyurl.com') || url.includes('bit.ly') || url.includes('goo.gl')) {
            return 'https://example.com/this/would/be/the/original/long/url/that/was/shortened/with/many/parameters?id=123&session=abc&user=example&token=xyz123'
        } else {
            // If it's not obviously a shortened URL, just return it
            return url
        }
    } catch (error) {
        console.error('Error expanding URL:', error)
        return null
    }
}

/**
 * Generate a random hash for URL shortening
 * @param {number} length - Length of hash
 * @returns {string} - Random hash
 */
function generateRandomHash(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    return result
}