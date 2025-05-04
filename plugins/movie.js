/**
 * Movie & TV Info plugin for Lotus MD
 * Get information about movies and TV shows
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'movie',
    description: 'Get information about movies and TV shows',
    commands: ['movie', 'film', 'tv', 'series', 'imdb'],
    usage: '.movie [title] or .tv [series name]',
    category: 'search',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if a title is provided
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a movie or TV show title to search for.\n\nExamples:\n${prefix}movie Inception\n${prefix}tv Breaking Bad` 
                })
                return
            }
            
            // Determine if searching for movie or TV show
            const isTV = ['tv', 'series'].includes(command)
            const mediaType = isTV ? 'TV Show' : 'Movie'
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Searching for ${mediaType}: "${text}"...` 
            })
            
            // Search for movie/TV show (this would be a real API call in a full implementation)
            const searchResult = await searchMedia(text, isTV)
            
            if (!searchResult) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ No ${mediaType.toLowerCase()} found matching "${text}". Please try another title.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format and send the result
            const genreList = searchResult.genres.join(', ')
            const starList = searchResult.stars.join(', ')
            
            let ratingInfo = `⭐ *Rating:* ${searchResult.rating}/10`
            if (searchResult.votes) {
                ratingInfo += ` (${searchResult.votes} votes)`
            }
            
            let plotText = searchResult.plot
            if (plotText.length > 300) {
                plotText = plotText.substring(0, 300) + '...'
            }
            
            const responseText = `
🎬 *${mediaType}: ${searchResult.title}* (${searchResult.year})

${ratingInfo}
🌐 *Country:* ${searchResult.country}
🗣️ *Language:* ${searchResult.language}
⏱️ *Runtime:* ${searchResult.runtime}
🎭 *Genres:* ${genreList}
👨‍👩‍👧‍👦 *Cast:* ${starList}
🎬 *Director:* ${searchResult.director}

📝 *Plot:*
${plotText}

${searchResult.awards ? `🏆 *Awards:* ${searchResult.awards}\n\n` : ''}*Lotus MD* • Movie Database
`.trim()
            
            // Send the result with poster if available
            if (searchResult.poster) {
                await bot.sendMessage(m.key.remoteJid, {
                    image: { url: searchResult.poster },
                    caption: responseText
                })
                
                // Delete the processing message
                await bot.sendMessage(m.key.remoteJid, { 
                    delete: processingMsg.key
                })
            } else {
                // Send text only if no poster
                await bot.sendMessage(m.key.remoteJid, { 
                    text: responseText,
                    edit: processingMsg.key
                })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in movie info plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to get movie/TV information: ' + error.message })
        }
    }
}

/**
 * Search for movie or TV show
 * @param {string} title - Title to search for
 * @param {boolean} isTV - Whether to search for TV shows
 * @returns {Promise<Object>} - Media information
 */
async function searchMedia(title, isTV = false) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a movie database API like OMDB or TMDB
        
        // For demo purposes, return simulated results for common titles
        const query = title.toLowerCase()
        
        if (query.includes('inception') && !isTV) {
            return {
                title: 'Inception',
                year: 2010,
                rating: 8.8,
                votes: '2.2M',
                runtime: '148 min',
                genres: ['Action', 'Adventure', 'Sci-Fi'],
                director: 'Christopher Nolan',
                stars: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
                plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                language: 'English, Japanese, French',
                country: 'USA, UK',
                awards: 'Won 4 Oscars. 157 wins & 220 nominations total',
                poster: 'https://example.com/inception.jpg' // This would be an actual URL in a real implementation
            }
        } else if (query.includes('breaking bad') && isTV) {
            return {
                title: 'Breaking Bad',
                year: '2008-2013',
                rating: 9.5,
                votes: '1.8M',
                runtime: '49 min per episode',
                genres: ['Crime', 'Drama', 'Thriller'],
                director: 'Vince Gilligan (Creator)',
                stars: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris'],
                plot: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
                language: 'English, Spanish',
                country: 'USA',
                awards: 'Won 16 Primetime Emmys. 152 wins & 238 nominations total',
                poster: 'https://example.com/breakingbad.jpg' // This would be an actual URL in a real implementation
            }
        } else if (query.includes('stranger things') && isTV) {
            return {
                title: 'Stranger Things',
                year: '2016-Present',
                rating: 8.7,
                votes: '1.1M',
                runtime: '51 min per episode',
                genres: ['Drama', 'Fantasy', 'Horror'],
                director: 'The Duffer Brothers (Creators)',
                stars: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
                plot: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
                language: 'English, Russian',
                country: 'USA',
                awards: 'Won 7 Primetime Emmys. 91 wins & 238 nominations total',
                poster: 'https://example.com/strangerthings.jpg' // This would be an actual URL in a real implementation
            }
        } else if (query.includes('avatar') && !isTV) {
            return {
                title: 'Avatar',
                year: 2009,
                rating: 7.8,
                votes: '1.2M',
                runtime: '162 min',
                genres: ['Action', 'Adventure', 'Fantasy'],
                director: 'James Cameron',
                stars: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Michelle Rodriguez'],
                plot: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
                language: 'English, Spanish',
                country: 'USA',
                awards: 'Won 3 Oscars. 89 wins & 131 nominations total',
                poster: 'https://example.com/avatar.jpg' // This would be an actual URL in a real implementation
            }
        } else {
            // Generic response for any title
            return {
                title: title,
                year: isTV ? '2020-Present' : 2022,
                rating: 7.5 + Math.random() * 2, // Random rating between 7.5-9.5
                votes: Math.floor(Math.random() * 900000 + 100000) + '',
                runtime: isTV ? '45 min per episode' : Math.floor(Math.random() * 60 + 90) + ' min',
                genres: ['Drama', 'Adventure', isTV ? 'Mystery' : 'Action'],
                director: 'Example Director',
                stars: ['Actor One', 'Actor Two', 'Actor Three', 'Actor Four'],
                plot: `This is a simulated ${isTV ? 'TV show' : 'movie'} entry for demonstration purposes. In a real implementation, this would contain actual information about "${title}" from a movie database API.`,
                language: 'English',
                country: 'USA',
                awards: 'Various nominations and awards',
                poster: null // No poster for generic response
            }
        }
    } catch (error) {
        console.error('Error searching media:', error)
        return null
    }
}