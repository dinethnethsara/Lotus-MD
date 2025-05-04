/**
 * Translator plugin for Lotus MD
 * Translate text between different languages
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'translate',
    description: 'Translate text between different languages',
    commands: ['translate', 'tr', 'tl'],
    usage: '.translate [target language] [text]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's text to translate
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide text to translate.\n\nExamples:\n${prefix}translate es Hello, how are you?\n${prefix}tr ja Good morning!` 
                })
                return
            }
            
            // Parse target language and text
            let targetLang, textToTranslate
            
            if (args.length >= 2) {
                targetLang = args[0].toLowerCase()
                textToTranslate = args.slice(1).join(' ')
            } else {
                targetLang = 'en' // Default to English
                textToTranslate = text
            }
            
            // Check if it's a quoted message
            if (m.quoted && !textToTranslate) {
                textToTranslate = m.quoted.text || ''
            }
            
            if (!textToTranslate) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide text to translate.` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔄 Translating to ${getLanguageName(targetLang)}...` 
            })
            
            // Translate the text (this would be a real API call in a full implementation)
            const translation = await translateText(textToTranslate, targetLang)
            
            if (!translation) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Failed to translate text. Please check the language code and try again.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format and send the translation
            const responseText = `
🌐 *Translation*

*Original (${translation.sourceLang}):*
${textToTranslate}

*${getLanguageName(targetLang)}:*
${translation.translatedText}

*Powered by Lotus MD Translator*
`.trim()
            
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in translate plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to translate: ' + error.message })
        }
    }
}

/**
 * Translate text to target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} - Translation result
 */
async function translateText(text, targetLang) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a translation API like Google Translate
        
        // Detect source language (simulated)
        const sourceLang = detectLanguage(text)
        
        // For demo purposes, return a simulated translation
        if (targetLang === 'es') {
            return {
                translatedText: 'Hola, ¿cómo estás?',
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        } else if (targetLang === 'fr') {
            return {
                translatedText: 'Bonjour, comment allez-vous?',
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        } else if (targetLang === 'de') {
            return {
                translatedText: 'Hallo, wie geht es dir?',
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        } else if (targetLang === 'ja') {
            return {
                translatedText: 'こんにちは、お元気ですか？',
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        } else if (targetLang === 'zh') {
            return {
                translatedText: '你好，你好吗？',
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        } else {
            return {
                translatedText: 'Hello, how are you?',
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        }
    } catch (error) {
        console.error('Error translating text:', error)
        return null
    }
}

/**
 * Detect language of text (simplified)
 * @param {string} text - Text to detect
 * @returns {string} - Language code
 */
function detectLanguage(text) {
    // This is a very simplified language detection
    // In a real implementation, you would use a proper detection library
    
    const sample = text.toLowerCase().substring(0, 10)
    
    if (/[¿¡áéíóúüñ]/.test(sample)) return 'es'
    if (/[àâçéèêëîïôùûüÿ]/.test(sample)) return 'fr'
    if (/[äöüß]/.test(sample)) return 'de'
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(sample)) return 'ja'
    if (/[\u4E00-\u9FFF]/.test(sample)) return 'zh'
    if (/[а-яА-Я]/.test(sample)) return 'ru'
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(sample)) return 'ko'
    
    return 'en' // Default to English
}

/**
 * Get language name from code
 * @param {string} code - Language code
 * @returns {string} - Language name
 */
function getLanguageName(code) {
    const languages = {
        'af': 'Afrikaans',
        'ar': 'Arabic',
        'bn': 'Bengali',
        'bs': 'Bosnian',
        'ca': 'Catalan',
        'cs': 'Czech',
        'da': 'Danish',
        'de': 'German',
        'el': 'Greek',
        'en': 'English',
        'es': 'Spanish',
        'fi': 'Finnish',
        'fr': 'French',
        'he': 'Hebrew',
        'hi': 'Hindi',
        'hr': 'Croatian',
        'hu': 'Hungarian',
        'id': 'Indonesian',
        'is': 'Icelandic',
        'it': 'Italian',
        'ja': 'Japanese',
        'km': 'Khmer',
        'ko': 'Korean',
        'la': 'Latin',
        'lv': 'Latvian',
        'mk': 'Macedonian',
        'ml': 'Malayalam',
        'mr': 'Marathi',
        'my': 'Myanmar',
        'ne': 'Nepali',
        'nl': 'Dutch',
        'no': 'Norwegian',
        'pl': 'Polish',
        'pt': 'Portuguese',
        'ro': 'Romanian',
        'ru': 'Russian',
        'si': 'Sinhala',
        'sk': 'Slovak',
        'sq': 'Albanian',
        'sr': 'Serbian',
        'su': 'Sundanese',
        'sv': 'Swedish',
        'sw': 'Swahili',
        'ta': 'Tamil',
        'te': 'Telugu',
        'th': 'Thai',
        'tl': 'Filipino',
        'tr': 'Turkish',
        'uk': 'Ukrainian',
        'ur': 'Urdu',
        'vi': 'Vietnamese',
        'zh': 'Chinese'
    }
    
    return languages[code] || code
}