/**
 * Wikipedia plugin for Lotus MD
 * Search for information on Wikipedia
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'wikipedia',
    description: 'Search for information on Wikipedia',
    commands: ['wiki', 'wikipedia', 'info'],
    usage: '.wiki [query]',
    category: 'search',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's a query to search for
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a search query.\n\nExample: ${prefix}wiki Albert Einstein` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Searching Wikipedia for "${text}"...` 
            })
            
            // Search Wikipedia (this would be a real API call in a full implementation)
            const searchResult = await searchWikipedia(text)
            
            if (!searchResult) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ No Wikipedia article found for "${text}". Try another search term.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format the search result
            const responseText = `
📚 *Wikipedia: ${searchResult.title}*

${searchResult.extract}

${searchResult.thumbnail ? '' : ''}
🔗 *Read more:* ${searchResult.url}

*Lotus MD* • Wikipedia Search
`.trim()
            
            // Send the search result
            if (searchResult.thumbnail) {
                // With thumbnail
                await bot.sendMessage(m.key.remoteJid, { 
                    image: { url: searchResult.thumbnail },
                    caption: responseText,
                })
                
                // Delete the processing message
                await bot.sendMessage(m.key.remoteJid, { 
                    delete: processingMsg.key
                })
            } else {
                // Without thumbnail
                await bot.sendMessage(m.key.remoteJid, { 
                    text: responseText,
                    edit: processingMsg.key
                })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in Wikipedia plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to search Wikipedia: ' + error.message })
        }
    }
}

/**
 * Search Wikipedia
 * @param {string} query - Search query
 * @returns {Promise<Object>} - Search result
 */
async function searchWikipedia(query) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call the Wikipedia API
        
        // For demo purposes, return a simulated search result
        if (query.toLowerCase().includes('einstein')) {
            return {
                title: 'Albert Einstein',
                extract: 'Albert Einstein (14 March 1879 – 18 April 1955) was a German-born theoretical physicist, widely acknowledged to be one of the greatest and most influential physicists of all time. Einstein is best known for developing the theory of relativity, but he also made important contributions to the development of the theory of quantum mechanics. Relativity and quantum mechanics are together the two pillars of modern physics. His mass–energy equivalence formula E = mc², which arises from relativity theory, has been dubbed "the world\'s most famous equation". His work is also known for its influence on the philosophy of science. He received the 1921 Nobel Prize in Physics "for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect", a pivotal step in the development of quantum theory. His intellectual achievements and originality resulted in "Einstein" becoming synonymous with "genius".',
                url: 'https://en.wikipedia.org/wiki/Albert_Einstein',
                thumbnail: 'https://example.com/einstein.jpg'
            }
        } else if (query.toLowerCase().includes('python')) {
            return {
                title: 'Python (programming language)',
                extract: 'Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented and functional programming. It is often described as a "batteries included" language due to its comprehensive standard library. Guido van Rossum began working on Python in the late 1980s as a successor to the ABC programming language and first released it in 1991 as Python 0.9.0. Python 2.0 was released in 2000 and introduced new features such as list comprehensions, cycle-detecting garbage collection, reference counting, and Unicode support. Python 3.0, released in 2008, was a major revision that is not completely backward-compatible with earlier versions. Python 2 was discontinued with version 2.7.18 in 2020.',
                url: 'https://en.wikipedia.org/wiki/Python_(programming_language)',
                thumbnail: 'https://example.com/python.jpg'
            }
        } else {
            return {
                title: query,
                extract: `This is a simulated Wikipedia extract for "${query}". In a real implementation, this would be the actual content from the Wikipedia article. The text would include information about the topic, its history, significance, and other relevant details that would be fetched from the actual Wikipedia API.`,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, '_'))}`,
                thumbnail: null
            }
        }
    } catch (error) {
        console.error('Error searching Wikipedia:', error)
        return null
    }
}