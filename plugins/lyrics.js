/**
 * Lyrics plugin for Lotus MD
 * Search for song lyrics
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'lyrics',
    description: 'Search for song lyrics',
    commands: ['lyrics', 'lyric', 'songlyrics'],
    usage: '.lyrics [song name]',
    category: 'search',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's a song to search for
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a song to search for lyrics.\n\nExample: ${prefix}lyrics Bohemian Rhapsody` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Searching for lyrics of "${text}"...` 
            })
            
            // Search for lyrics (this would be a real API call in a full implementation)
            const lyricsResult = await searchLyrics(text)
            
            if (!lyricsResult) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Could not find lyrics for "${text}". Please try with a different query.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format lyrics with proper line breaks
            const formattedLyrics = lyricsResult.lyrics
                .replace(/\\n/g, '\n')
                .replace(/\[/g, '\n\n[')
                .replace(/\]/g, ']\n')
            
            // Format and send the lyrics
            const responseText = `
🎵 *${lyricsResult.title}*
👤 *Artist:* ${lyricsResult.artist}
💿 *Album:* ${lyricsResult.album || 'Unknown'}

${formattedLyrics}

*Source:* ${lyricsResult.source}
`.trim()
            
            // Check if lyrics is too long
            if (responseText.length > 4000) {
                // Send in parts
                const firstPart = responseText.substring(0, 4000) + '\n\n... (continued)'
                const secondPart = '... (continuation)\n\n' + responseText.substring(4000)
                
                await bot.sendMessage(m.key.remoteJid, { 
                    text: firstPart,
                    edit: processingMsg.key
                })
                
                await bot.sendMessage(m.key.remoteJid, { 
                    text: secondPart
                })
            } else {
                // Send the complete lyrics
                await bot.sendMessage(m.key.remoteJid, { 
                    text: responseText,
                    edit: processingMsg.key
                })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in lyrics plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to find lyrics: ' + error.message })
        }
    }
}

/**
 * Search for song lyrics
 * @param {string} query - Song name
 * @returns {Promise<Object>} - Lyrics result
 */
async function searchLyrics(query) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a lyrics API
        
        // For demo purposes, return different lyrics based on query words
        const q = query.toLowerCase()
        
        if (q.includes('bohemian') || q.includes('rhapsody')) {
            return {
                title: 'Bohemian Rhapsody',
                artist: 'Queen',
                album: 'A Night at the Opera',
                lyrics: 
                    "[Intro]\nIs this the real life? Is this just fantasy?\nCaught in a landslide, no escape from reality\nOpen your eyes, look up to the skies and see\nI'm just a poor boy, I need no sympathy\nBecause I'm easy come, easy go, little high, little low\nAny way the wind blows doesn't really matter to me, to me\n\n[Verse 1]\nMama, just killed a man\nPut a gun against his head, pulled my trigger, now he's dead\nMama, life had just begun\nBut now I've gone and thrown it all away\nMama, ooh, didn't mean to make you cry\nIf I'm not back again this time tomorrow\nCarry on, carry on as if nothing really matters...",
                source: 'Genius Lyrics'
            }
        } else if (q.includes('imagine')) {
            return {
                title: 'Imagine',
                artist: 'John Lennon',
                album: 'Imagine',
                lyrics: 
                    "[Verse 1]\nImagine there's no heaven\nIt's easy if you try\nNo hell below us\nAbove us, only sky\nImagine all the people\nLivin' for today\n\n[Verse 2]\nImagine there's no countries\nIt isn't hard to do\nNothing to kill or die for\nAnd no religion, too\nImagine all the people\nLivin' life in peace...",
                source: 'Genius Lyrics'
            }
        } else if (q.includes('shape') || q.includes('you')) {
            return {
                title: 'Shape of You',
                artist: 'Ed Sheeran',
                album: '÷ (Divide)',
                lyrics: 
                    "[Verse 1]\nThe club isn't the best place to find a lover\nSo the bar is where I go\nMe and my friends at the table doing shots\nDrinking fast and then we talk slow\nCome over and start up a conversation with just me\nAnd trust me, I'll give it a chance now\nTake my hand, stop, put Van the Man on the jukebox\nAnd then we start to dance\nAnd now I'm singing like...",
                source: 'Genius Lyrics'
            }
        } else {
            return {
                title: query,
                artist: 'Various Artists',
                album: 'Unknown',
                lyrics: 
                    "[Verse 1]\nThis is a placeholder for lyrics that would be found\nIn a real implementation, actual lyrics would be displayed\nFrom a lyrics API or web scraping service\n\n[Chorus]\nLotus MD, finding lyrics for you\nAny song you want, we'll try to get it through\nJust ask and we'll search far and wide\nTo bring the words that artists write\n\n[Verse 2]\nMusic brings us joy and helps us feel\nThe emotions and stories that are real\nLyrics capture moments, thoughts, and dreams\nPainting pictures with words and themes",
                source: 'Lotus MD Lyrics'
            }
        }
    } catch (error) {
        console.error('Error searching lyrics:', error)
        return null
    }
}