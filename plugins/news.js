/**
 * News plugin for Lotus MD
 * Fetch latest news from various sources
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')
const moment = require('moment-timezone')

// Export plugin info
module.exports = {
    name: 'news',
    description: 'Fetch latest news from various sources',
    commands: ['news', 'headlines', 'topnews', 'latestnews'],
    usage: '.news [category/country]',
    category: 'research',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Default category
            let category = 'general'
            let country = 'us'
            
            // Check if a category or country is specified
            if (text) {
                const input = text.toLowerCase()
                
                // Check if input is a valid category
                const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
                if (validCategories.includes(input)) {
                    category = input
                }
                
                // Check if input is a valid country code
                const validCountries = ['us', 'gb', 'au', 'ca', 'in', 'sg', 'za', 'nz', 'jp']
                if (validCountries.includes(input)) {
                    country = input
                }
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `📰 Fetching latest ${category} news from ${getCountryName(country)}...` 
            })
            
            // Fetch news (this would be a real API call in a full implementation)
            const newsResults = await fetchNews(category, country)
            
            if (!newsResults || newsResults.length === 0) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Could not fetch news. Please try again later.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format the news results
            const currentDate = moment().format('MMMM D, YYYY')
            
            let resultText = `
📰 *Top ${category.charAt(0).toUpperCase() + category.slice(1)} News*
🌍 *${getCountryName(country)}*
📅 *${currentDate}*

`.trim()
            
            newsResults.forEach((article, index) => {
                resultText += `\n*${index + 1}. ${article.title}*\n`
                
                if (article.description) {
                    // Truncate description if too long
                    const shortenedDesc = article.description.length > 100 ? 
                        article.description.substring(0, 100) + '...' : 
                        article.description
                        
                    resultText += `${shortenedDesc}\n`
                }
                
                resultText += `*Source:* ${article.source}\n`
                
                if (article.publishedAt) {
                    resultText += `*Published:* ${formatTimeAgo(article.publishedAt)}\n`
                }
                
                resultText += `*Link:* ${article.url}\n`
            })
            
            resultText += `\n*Lotus MD* • News Service`
            
            // Check if result is too long
            if (resultText.length > 4000) {
                resultText = resultText.substring(0, 4000) + '...\n\n_Results truncated due to length_'
            }
            
            // Send the news results
            await bot.sendMessage(m.key.remoteJid, { 
                text: resultText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in news plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to fetch news: ' + error.message })
        }
    }
}

/**
 * Fetch news articles
 * @param {string} category - News category
 * @param {string} country - Country code
 * @returns {Promise<Array>} - News articles
 */
async function fetchNews(category, country) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a news API like NewsAPI.org
        
        // For demo purposes, return simulated news results
        return [
            {
                title: "Global Tech Giants Announce Collaboration on AI Ethics Standards",
                description: "Major technology companies have agreed to a common framework for ethical AI development and deployment.",
                url: "https://example.com/tech-ai-ethics",
                source: "Tech Chronicle",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            {
                title: "New Renewable Energy Project Sets Record for Efficiency",
                description: "A groundbreaking solar-wind hybrid installation has achieved unprecedented energy conversion rates.",
                url: "https://example.com/renewable-record",
                source: "Energy Today",
                publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
            },
            {
                title: "International Space Station Begins New Research Phase",
                description: "Astronauts have initiated a series of experiments that could pave the way for long-duration space missions.",
                url: "https://example.com/iss-research",
                source: "Space & Astronomy",
                publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
            },
            {
                title: "Global Economic Forum Predicts Strong Recovery in Emerging Markets",
                description: "Analysts project significant growth in developing economies despite ongoing supply chain challenges.",
                url: "https://example.com/economic-recovery",
                source: "Financial Review",
                publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
            },
            {
                title: "Breakthrough in Quantum Computing Announced by Research Team",
                description: "Scientists have demonstrated a new method for reducing quantum decoherence, potentially accelerating practical applications.",
                url: "https://example.com/quantum-breakthrough",
                source: "Science Daily",
                publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000) // 16 hours ago
            }
        ]
    } catch (error) {
        console.error('Error fetching news:', error)
        return null
    }
}

/**
 * Get country name from code
 * @param {string} code - Country code
 * @returns {string} - Country name
 */
function getCountryName(code) {
    const countries = {
        'us': 'United States',
        'gb': 'Great Britain',
        'au': 'Australia',
        'ca': 'Canada',
        'in': 'India',
        'sg': 'Singapore',
        'za': 'South Africa',
        'nz': 'New Zealand',
        'jp': 'Japan'
    }
    
    return countries[code] || code.toUpperCase()
}

/**
 * Format time ago from date
 * @param {Date} date - Date to format
 * @returns {string} - Formatted time ago
 */
function formatTimeAgo(date) {
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSec < 60) {
        return `${diffSec} seconds ago`
    } else if (diffMin < 60) {
        return `${diffMin} minutes ago`
    } else if (diffHours < 24) {
        return `${diffHours} hours ago`
    } else if (diffDays < 30) {
        return `${diffDays} days ago`
    } else {
        return moment(date).format('MMMM D, YYYY')
    }
}