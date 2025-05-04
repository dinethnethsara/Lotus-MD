/**
 * OCR plugin for Lotus MD
 * Extract text from images
 */

const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { downloadMedia } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'ocr',
    description: 'Extract text from images using OCR',
    commands: ['ocr', 'readtext', 'textract', 'imgtotext'],
    usage: '.ocr (reply to an image)',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if replying to an image
            if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please reply to an image to extract text.\n\nExample: ${prefix}ocr (reply to an image)` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Extracting text from image...` 
            })
            
            // Get language code if specified
            let langCode = 'eng' // Default to English
            
            if (args.length > 0) {
                // Check if a valid language code is provided
                const validLangCodes = ['eng', 'spa', 'fre', 'deu', 'ita', 'por', 'rus', 'jpn', 'kor', 'chi_sim', 'ara', 'hin']
                const providedCode = args[0].toLowerCase()
                
                if (validLangCodes.includes(providedCode)) {
                    langCode = providedCode
                }
            }
            
            // Download the image
            const imagePath = await downloadMedia(m.quoted, bot)
            
            // Extract text from image (this would be a real implementation in a full bot)
            const extractedText = await extractTextFromImage(imagePath, langCode)
            
            if (!extractedText || extractedText.trim() === '') {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Could not extract any text from the image. Please make sure the image contains clear, readable text.`,
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
📝 *OCR Text Extraction*

*Language:* ${getLanguageName(langCode)}
*Confidence:* ${extractedText.confidence}%

*Extracted Text:*
${extractedText.text}

*Lotus MD* • OCR Text Recognition
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
            
        } catch (error) {
            console.error(chalk.red(`Error in OCR plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to extract text from image: ' + error.message })
        }
    }
}

/**
 * Extract text from image
 * @param {string} imagePath - Path to image
 * @param {string} langCode - Language code for OCR
 * @returns {Promise<Object>} - Extracted text and confidence
 */
async function extractTextFromImage(imagePath, langCode) {
    try {
        // This is a placeholder for the actual OCR
        // In a real implementation, this would use a library like tesseract.js
        
        // For demo purposes, return simulated results
        // In a real implementation, this would contain the actual extracted text
        return {
            text: "This is a sample text that would be extracted from the image. In a real implementation, the OCR engine would analyze the image and extract any visible text. The quality of extraction depends on the clarity of the text in the image, the font used, contrast, and other factors. Multiple languages can be supported depending on the OCR engine and language packs installed.",
            confidence: 87.5
        }
    } catch (error) {
        console.error('Error extracting text from image:', error)
        return null
    }
}

/**
 * Get language name from code
 * @param {string} code - Language code
 * @returns {string} - Language name
 */
function getLanguageName(code) {
    const languages = {
        'eng': 'English',
        'spa': 'Spanish',
        'fre': 'French',
        'deu': 'German',
        'ita': 'Italian',
        'por': 'Portuguese',
        'rus': 'Russian',
        'jpn': 'Japanese',
        'kor': 'Korean',
        'chi_sim': 'Chinese (Simplified)',
        'ara': 'Arabic',
        'hin': 'Hindi'
    }
    
    return languages[code] || code
}