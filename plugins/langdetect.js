/**
 * Language Detector plugin for Lotus MD
 * Detect language of text
 */

const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'langdetect',
    description: 'Detect language of text',
    commands: ['detectlang', 'langdetect', 'whatlang', 'identifylang'],
    usage: '.detectlang [text]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Get the text to detect
            let textToDetect = text
            
            // If no text is provided, check if it's a reply to a message
            if (!textToDetect && m.quoted && m.quoted.text) {
                textToDetect = m.quoted.text
            }
            
            // If still no text, show usage
            if (!textToDetect) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide text to detect language, or reply to a message.\n\nExample: ${prefix}detectlang Hello, how are you?`
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Detecting language...` 
            })
            
            // Detect language (this would be a real API call in a full implementation)
            const result = await detectLanguage(textToDetect)
            
            // Format and send the result
            const responseText = `
🌐 *Language Detection*

*Detected Language:* ${result.language} (${result.code})
*Confidence:* ${result.confidence}%
*Text Sample:* ${textToDetect.length > 50 ? textToDetect.substring(0, 50) + '...' : textToDetect}

${result.otherPossibilities.length > 0 ? `*Other Possibilities:*\n${result.otherPossibilities.map(lang => `- ${lang.language} (${lang.code}): ${lang.confidence}%`).join('\n')}\n\n` : ''}*Lotus MD* • Language Detector
`.trim()
            
            // Send the result
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in language detector plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to detect language: ' + error.message })
        }
    }
}

/**
 * Detect language of text
 * @param {string} text - Text to detect language
 * @returns {Promise<Object>} - Detection result
 */
async function detectLanguage(text) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a language detection API
        
        // Simple patterns for demonstration
        text = text.toLowerCase()
        
        // Simplified language detection based on character patterns
        let detectedLang = {
            language: 'English',
            code: 'en',
            confidence: 95
        }
        
        const langPatterns = [
            { regex: /[áéíóúüñ¿¡]/, language: 'Spanish', code: 'es' },
            { regex: /[àâçéèêëîïôùûüÿ]/, language: 'French', code: 'fr' },
            { regex: /[äöüß]/, language: 'German', code: 'de' },
            { regex: /[àèéìíîòóùú]/, language: 'Italian', code: 'it' },
            { regex: /[\u3040-\u309F\u30A0-\u30FF]/, language: 'Japanese', code: 'ja' },
            { regex: /[\u0400-\u04FF]/, language: 'Russian', code: 'ru' },
            { regex: /[\u0600-\u06FF]/, language: 'Arabic', code: 'ar' },
            { regex: /[\u0900-\u097F]/, language: 'Hindi', code: 'hi' },
            { regex: /[\u4E00-\u9FFF]/, language: 'Chinese', code: 'zh' },
            { regex: /[\uAC00-\uD7A3]/, language: 'Korean', code: 'ko' },
            { regex: /[şğıöüçİ]/, language: 'Turkish', code: 'tr' },
            { regex: /[ąćęłńóśźż]/, language: 'Polish', code: 'pl' },
            { regex: /[áéíóúýčďěňřšťžů]/, language: 'Czech', code: 'cs' }
        ]
        
        for (const pattern of langPatterns) {
            if (pattern.regex.test(text)) {
                detectedLang = {
                    language: pattern.language,
                    code: pattern.code,
                    confidence: 80 + Math.floor(Math.random() * 15) // Random confidence between 80-94%
                }
                break
            }
        }
        
        // Generate some other possibilities
        const otherLangs = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Japanese', 'Chinese']
            .filter(lang => lang !== detectedLang.language)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
        
        const otherPossibilities = otherLangs.map(lang => {
            const langCode = {
                'English': 'en',
                'Spanish': 'es',
                'French': 'fr',
                'German': 'de',
                'Italian': 'it',
                'Portuguese': 'pt',
                'Dutch': 'nl',
                'Russian': 'ru',
                'Japanese': 'ja',
                'Chinese': 'zh'
            }[lang]
            
            return {
                language: lang,
                code: langCode,
                confidence: Math.floor(Math.random() * 30) + 10 // Random confidence between 10-39%
            }
        }).sort((a, b) => b.confidence - a.confidence)
        
        return {
            language: detectedLang.language,
            code: detectedLang.code,
            confidence: detectedLang.confidence,
            otherPossibilities
        }
    } catch (error) {
        console.error('Error detecting language:', error)
        throw error
    }
}