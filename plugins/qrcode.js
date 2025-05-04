/**
 * QR Code plugin for Lotus MD
 * Generate and read QR codes
 */

const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId, downloadMedia } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'qrcode',
    description: 'Generate and read QR codes',
    commands: ['qr', 'qrcode', 'createqr', 'readqr'],
    usage: '.qr [text/url] or .readqr (reply to QR image)',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Determine whether to generate or read QR code
            const isReader = command === 'readqr'
            
            if (isReader) {
                // Reading QR code from image
                if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `Please reply to an image containing a QR code to read it.\n\nExample: ${prefix}readqr (reply to QR image)` 
                    })
                    return
                }
                
                // Send processing message
                const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                    text: `🔍 Reading QR code...` 
                })
                
                // Download the image
                const imagePath = await downloadMedia(m.quoted, bot)
                
                // Read QR code (this would be a real implementation in a full bot)
                const qrContent = await readQRCode(imagePath)
                
                if (!qrContent) {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `❌ Could not detect any QR code in the image. Please make sure the QR code is clear and try again.`,
                        edit: processingMsg.key
                    })
                    
                    // Clean up
                    if (fs.existsSync(imagePath)) {
                        await fs.unlink(imagePath)
                    }
                    
                    return
                }
                
                // Format and send the result
                const responseText = `
📱 *QR Code Content*

${qrContent}

${isUrl(qrContent) ? `🔗 [URL Detected] You can click or copy the link above.` : ''}

*Lotus MD* • QR Code Reader
`.trim()
                
                // Send the result
                await bot.sendMessage(m.key.remoteJid, { 
                    text: responseText,
                    edit: processingMsg.key
                })
                
                // Clean up
                if (fs.existsSync(imagePath)) {
                    await fs.unlink(imagePath)
                }
                
            } else {
                // Generating QR code
                
                // Check if there's content to encode
                if (!text) {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `Please provide text or URL to generate a QR code.\n\nExample: ${prefix}qr https://example.com`
                    })
                    return
                }
                
                // Send processing message
                const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                    text: `⚙️ Generating QR code...` 
                })
                
                // Generate QR code (this would be a real implementation in a full bot)
                const qrPath = await generateQRCode(text)
                
                if (!qrPath) {
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `❌ Failed to generate QR code. Please try again.`,
                        edit: processingMsg.key
                    })
                    return
                }
                
                // Send the QR code image
                await bot.sendMessage(m.key.remoteJid, {
                    image: { url: qrPath },
                    caption: `✅ *QR Code Generated*\n\n*Content:* ${text.length > 50 ? text.substring(0, 50) + '...' : text}\n\n*Lotus MD* • QR Code Generator`
                })
                
                // Delete the processing message
                await bot.sendMessage(m.key.remoteJid, { 
                    delete: processingMsg.key
                })
                
                // Clean up
                if (fs.existsSync(qrPath)) {
                    await fs.unlink(qrPath)
                }
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in QR code plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to process QR code: ' + error.message })
        }
    }
}

/**
 * Generate QR code from text
 * @param {string} text - Text to encode in QR code
 * @returns {Promise<string>} - Path to generated QR code image
 */
async function generateQRCode(text) {
    try {
        // This is a placeholder for the actual QR code generation
        // In a real implementation, this would use a library like qrcode
        
        // Create temp directory if it doesn't exist
        const directory = path.join(process.cwd(), 'temp')
        await fs.ensureDir(directory)
        
        // Generate a filename
        const filename = `qr_${generateRandomId()}.png`
        const outputPath = path.join(directory, filename)
        
        // In a real implementation, the QR code generation would happen here
        // For example, with qrcode library:
        /*
        const qrcode = require('qrcode')
        await qrcode.toFile(outputPath, text, {
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            width: 500,
            margin: 1
        })
        */
        
        // For this demo, we'll just return the path (the file wouldn't actually exist)
        return outputPath
    } catch (error) {
        console.error('Error generating QR code:', error)
        return null
    }
}

/**
 * Read QR code from image
 * @param {string} imagePath - Path to image containing QR code
 * @returns {Promise<string>} - QR code content
 */
async function readQRCode(imagePath) {
    try {
        // This is a placeholder for the actual QR code reading
        // In a real implementation, this would use a library like jimp and qrcode-reader
        
        // For demo purposes, return simulated content
        return "https://example.com/qr-example"
    } catch (error) {
        console.error('Error reading QR code:', error)
        return null
    }
}

/**
 * Check if text is a URL
 * @param {string} text - Text to check
 * @returns {boolean} - Whether the text is a URL
 */
function isUrl(text) {
    // Simple URL validation
    const urlRegex = /^(http|https):\/\/[^ "]+$/
    return urlRegex.test(text)
}