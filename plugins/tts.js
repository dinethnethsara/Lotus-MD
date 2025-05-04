/**
 * Text-to-Speech plugin for Lotus MD
 * Convert text to speech audio
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'tts',
    description: 'Convert text to speech',
    commands: ['tts', 'say', 'speak'],
    usage: '.tts [language] [text]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's text to convert
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide text to convert to speech.\n\nExamples:\n${prefix}tts Hello world\n${prefix}tts en Hello in English\n${prefix}tts fr Bonjour en français` 
                })
                return
            }
            
            // Parse language and text
            let lang = 'en'
            let content = text
            
            // Check if first argument is a language code
            if (args.length > 1) {
                const firstArg = args[0].toLowerCase()
                
                // Check if it's a valid language code (2 characters)
                if (/^[a-z]{2}(-[a-z]{2})?$/.test(firstArg)) {
                    lang = firstArg
                    content = args.slice(1).join(' ')
                }
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔊 Converting text to speech in ${getLanguageName(lang)}...` 
            })
            
            // Convert text to speech (this would be a real API call in a full implementation)
            const audioPath = await textToSpeech(content, lang)
            
            // Send the audio message
            await bot.sendMessage(m.key.remoteJid, { 
                audio: { url: audioPath },
                mimetype: 'audio/mp4',
                ptt: true, // Send as voice message
                fileName: `tts-${lang}-${generateRandomId()}.mp3`,
                caption: `${content}\n\nLanguage: ${getLanguageName(lang)}`
            })
            
            // Delete the processing message
            await bot.sendMessage(m.key.remoteJid, { 
                delete: processingMsg.key
            })
            
            // In a real implementation, clean up the temporary file
            // await fs.unlink(audioPath)
            
        } catch (error) {
            console.error(chalk.red(`Error in TTS plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to convert text to speech: ' + error.message })
        }
    }
}

/**
 * Convert text to speech
 * @param {string} text - Text to convert
 * @param {string} lang - Language code
 * @returns {Promise<string>} - Path to audio file
 */
async function textToSpeech(text, lang) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a TTS API like Google's or AWS Polly
        
        // Create temp directory if it doesn't exist
        const directory = path.join(process.cwd(), 'temp')
        await fs.ensureDir(directory)
        
        // Generate a filename
        const filename = `tts_${generateRandomId()}.mp3`
        const filepath = path.join(directory, filename)
        
        // In a real implementation, the API call and file download would happen here
        // For this demo, we'll just return a placeholder filepath
        
        return filepath
    } catch (error) {
        console.error('Error converting text to speech:', error)
        throw error
    }
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
    
    return languages[code.split('-')[0]] || code
}