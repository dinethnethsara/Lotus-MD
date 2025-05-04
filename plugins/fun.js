/**
 * Fun plugin for Lotus MD
 * Provides fun commands like jokes, quotes, and memes
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'fun',
    description: 'Fun commands for entertainment',
    commands: ['joke', 'quote', 'fact', 'meme', 'advice', 'fortune'],
    usage: '.joke / .quote / .fact / .meme / .advice / .fortune',
    category: 'fun',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Handle different fun commands
            switch (command) {
                case 'joke':
                    // Get a random joke
                    const waitingJoke = await bot.sendMessage(m.key.remoteJid, { text: '🤣 Getting a joke...' })
                    
                    const joke = await getRandomJoke()
                    
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `*Random Joke*\n\n${joke}`,
                        edit: waitingJoke.key
                    })
                    break
                    
                case 'quote':
                    // Get a random inspirational quote
                    const waitingQuote = await bot.sendMessage(m.key.remoteJid, { text: '✨ Finding inspiration...' })
                    
                    const quote = await getRandomQuote()
                    
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `*${quote.text}*\n\n- ${quote.author || 'Unknown'}`,
                        edit: waitingQuote.key
                    })
                    break
                    
                case 'fact':
                    // Get a random fact
                    const waitingFact = await bot.sendMessage(m.key.remoteJid, { text: '🧠 Finding a random fact...' })
                    
                    const fact = await getRandomFact()
                    
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `*Did You Know?*\n\n${fact}`,
                        edit: waitingFact.key
                    })
                    break
                    
                case 'meme':
                    // Get a random meme
                    const waitingMeme = await bot.sendMessage(m.key.remoteJid, { text: '🎭 Fetching a meme...' })
                    
                    // In a real implementation, we would actually fetch and send an image
                    // For this demo, just show a message that this is where the meme would be sent
                    
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `*Random Meme*\n\nNote: This is a demonstration plugin. In a real implementation, a meme image would be sent here.`,
                        edit: waitingMeme.key
                    })
                    break
                    
                case 'advice':
                    // Get random advice
                    const waitingAdvice = await bot.sendMessage(m.key.remoteJid, { text: '🤔 Thinking of some advice...' })
                    
                    const advice = await getRandomAdvice()
                    
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `*Advice of the Day*\n\n${advice}`,
                        edit: waitingAdvice.key
                    })
                    break
                    
                case 'fortune':
                    // Get a fortune cookie message
                    const waitingFortune = await bot.sendMessage(m.key.remoteJid, { text: '🥠 Opening a fortune cookie...' })
                    
                    const fortune = await getFortune()
                    
                    await bot.sendMessage(m.key.remoteJid, { 
                        text: `*Your Fortune*\n\n${fortune}`,
                        edit: waitingFortune.key
                    })
                    break
                    
                default:
                    await bot.sendMessage(m.key.remoteJid, { text: `Unknown fun command. Use ${prefix}help fun for available commands.` })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in fun plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to process fun command: ' + error.message })
        }
    }
}

/**
 * Get a random joke
 * @returns {Promise<string>} - Random joke text
 */
async function getRandomJoke() {
    try {
        // In a real implementation, this would call a joke API
        // For this demo, we'll use predefined jokes
        
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "What do you call a fake noodle? An impasta!",
            "Why did the bicycle fall over? Because it was two-tired!",
            "How do you organize a space party? You planet!",
            "I have a fear of elevators, but I'm taking steps to avoid it.",
            "What's the best thing about Switzerland? I don't know, but the flag is a big plus!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised!"
        ]
        
        return jokes[Math.floor(Math.random() * jokes.length)]
    } catch (error) {
        console.error('Error getting random joke:', error)
        return "Why did the joke fail? Because the API had a meltdown!"
    }
}

/**
 * Get a random inspirational quote
 * @returns {Promise<Object>} - Quote object with text and author
 */
async function getRandomQuote() {
    try {
        // In a real implementation, this would call a quote API
        // For this demo, we'll use predefined quotes
        
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
            { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
            { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
            { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas A. Edison" },
            { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
            { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
            { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" }
        ]
        
        return quotes[Math.floor(Math.random() * quotes.length)]
    } catch (error) {
        console.error('Error getting random quote:', error)
        return { text: "The server said no, but keep your spirits up!", author: "Error Handling System" }
    }
}

/**
 * Get a random fact
 * @returns {Promise<string>} - Random fact text
 */
async function getRandomFact() {
    try {
        // In a real implementation, this would call a fact API
        // For this demo, we'll use predefined facts
        
        const facts = [
            "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
            "The shortest war in history was between Britain and Zanzibar in 1896. It lasted only 38 minutes.",
            "A group of flamingos is called a 'flamboyance'.",
            "The world's oldest known living tree is over 5,000 years old.",
            "Octopuses have three hearts, nine brains, and blue blood.",
            "Cows have best friends and can become stressed when they are separated.",
            "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once on its axis, but only 225 Earth days to go around the Sun.",
            "Bananas are berries, but strawberries aren't.",
            "The average person will spend six months of their life waiting for red lights to turn green.",
            "The fingerprints of koalas are so similar to humans that they have on occasion been confused at crime scenes."
        ]
        
        return facts[Math.floor(Math.random() * facts.length)]
    } catch (error) {
        console.error('Error getting random fact:', error)
        return "Here's a fact: Sometimes APIs don't respond, just like my ex!"
    }
}

/**
 * Get random advice
 * @returns {Promise<string>} - Random advice text
 */
async function getRandomAdvice() {
    try {
        // In a real implementation, this would call an advice API
        // For this demo, we'll use predefined advice
        
        const advice = [
            "Take a deep breath before responding to something that makes you angry.",
            "Always keep learning. Read books, take courses, and explore new hobbies.",
            "Drink more water than you think you need.",
            "Be kind to yourself. Self-compassion is just as important as compassion for others.",
            "Save at least 20% of your income for the future.",
            "Listen to understand, not to respond.",
            "Take care of your body. It's the only place you have to live.",
            "The most important relationship in your life is the one you have with yourself.",
            "Don't compare your beginning to someone else's middle or end.",
            "When you're feeling overwhelmed, focus on just the next small step."
        ]
        
        return advice[Math.floor(Math.random() * advice.length)]
    } catch (error) {
        console.error('Error getting random advice:', error)
        return "When life gets tough, just remember: at least you're not trying to debug a chat bot at 3 AM!"
    }
}

/**
 * Get a fortune cookie message
 * @returns {Promise<string>} - Fortune message
 */
async function getFortune() {
    try {
        // In a real implementation, this might call an API
        // For this demo, we'll use predefined fortunes
        
        const fortunes = [
            "A beautiful, smart, and loving person will be coming into your life.",
            "Your creativity will make you successful in a project soon.",
            "Your hard work is about to pay off. Remember, dreams are the seeds of reality.",
            "You will travel to many exotic places in your lifetime.",
            "Someone from your past will return to surprise you!",
            "Your talents will be recognized and suitably rewarded.",
            "Your ability to see the silver lining in everything is a gift.",
            "A lifetime of happiness awaits you.",
            "An important person will offer you support.",
            "Your next adventure is just around the corner."
        ]
        
        return fortunes[Math.floor(Math.random() * fortunes.length)]
    } catch (error) {
        console.error('Error getting fortune:', error)
        return "Fortune not found. Try another cookie!"
    }
}