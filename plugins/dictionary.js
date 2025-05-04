/**
 * Dictionary & Encyclopedia plugin for Lotus MD
 * Lookup words, terms, and concepts
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'dictionary',
    description: 'Lookup words, terms, and concepts',
    commands: ['define', 'dict', 'dictionary', 'meaning', 'encyclopedia', 'encyclo'],
    usage: '.define [word]',
    category: 'research',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's a word to define
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a word or term to look up.\n\nExamples:\n${prefix}define quantum\n${prefix}meaning ecosystem\n${prefix}dict democracy` 
                })
                return
            }
            
            // Determine if this is a dictionary or encyclopedia lookup
            const isEncyclopedia = ['encyclopedia', 'encyclo'].includes(command)
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Looking up ${isEncyclopedia ? 'encyclopedia entry' : 'definition'} for "${text}"...` 
            })
            
            // Look up the word (this would be a real API call in a full implementation)
            const result = isEncyclopedia ? 
                await lookupEncyclopedia(text) : 
                await lookupDictionary(text)
            
            if (!result) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ No ${isEncyclopedia ? 'encyclopedia entry' : 'definition'} found for "${text}".`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format the result
            let responseText
            
            if (isEncyclopedia) {
                // Encyclopedia format
                responseText = `
📚 *Encyclopedia: ${result.title}*

${result.summary}

${result.details ? `*Details:*\n${result.details}\n\n` : ''}${result.relatedTopics ? `*Related Topics:* ${result.relatedTopics.join(', ')}` : ''}

*Lotus MD* • Encyclopedia
`.trim()
            } else {
                // Dictionary format
                responseText = `
📖 *Dictionary: ${result.word}*

*Pronunciation:* ${result.pronunciation}
${result.partOfSpeech ? `*Part of Speech:* ${result.partOfSpeech}` : ''}

*Definitions:*
${result.definitions.map((def, i) => `${i+1}. ${def}`).join('\n')}

${result.examples.length > 0 ? `*Examples:*\n${result.examples.map(ex => `• ${ex}`).join('\n')}\n\n` : ''}${result.synonyms.length > 0 ? `*Synonyms:* ${result.synonyms.join(', ')}\n\n` : ''}${result.antonyms.length > 0 ? `*Antonyms:* ${result.antonyms.join(', ')}` : ''}

*Lotus MD* • Dictionary
`.trim()
            }
            
            // Send the result
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in dictionary plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to look up definition: ' + error.message })
        }
    }
}

/**
 * Look up word in dictionary
 * @param {string} word - Word to look up
 * @returns {Promise<Object>} - Dictionary result
 */
async function lookupDictionary(word) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a dictionary API
        
        // For demo purposes, return simulated results for common words
        const term = word.toLowerCase()
        
        if (term === 'quantum') {
            return {
                word: 'quantum',
                pronunciation: '/ˈkwɒntəm/',
                partOfSpeech: 'noun',
                definitions: [
                    'A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents.',
                    'The smallest amount of a physical quantity that can exist independently, especially a discrete quantity of electromagnetic radiation.',
                    'A required or allowed amount, especially in a system of regulations or restrictions.'
                ],
                examples: [
                    'Light behaves as a stream of quanta (photons).',
                    'He explained the concept of quantum mechanics to the students.',
                    'There was a quantum leap in our understanding of the disease.'
                ],
                synonyms: ['particle', 'unit', 'increment', 'amount', 'portion'],
                antonyms: ['whole', 'entirety', 'continuum']
            }
        } else if (term === 'democracy') {
            return {
                word: 'democracy',
                pronunciation: '/dɪˈmɒkrəsi/',
                partOfSpeech: 'noun',
                definitions: [
                    'A system of government by the whole population or all eligible members of a state, typically through elected representatives.',
                    'Control of an organization or group by the majority of its members.',
                    'The practice or principles of social equality.'
                ],
                examples: [
                    'The spread of democracy in Eastern Europe.',
                    'Industrial democracy gives workers a say in their company's future.',
                    'A multiparty democracy was established after the war.'
                ],
                synonyms: ['republic', 'self-government', 'representative government', 'egalitarianism'],
                antonyms: ['dictatorship', 'totalitarianism', 'autocracy', 'monarchy']
            }
        } else {
            // Generic response for any word
            return {
                word: term,
                pronunciation: `/simulation/`,
                partOfSpeech: 'various',
                definitions: [
                    'This is a simulated dictionary entry for demonstration purposes.',
                    'In a full implementation, this would contain actual definitions from a dictionary API.'
                ],
                examples: [
                    `Example usage of the word "${term}".`,
                    `Another context where "${term}" might be used.`
                ],
                synonyms: ['similar1', 'similar2', 'similar3'],
                antonyms: ['opposite1', 'opposite2']
            }
        }
    } catch (error) {
        console.error('Error looking up dictionary:', error)
        return null
    }
}

/**
 * Look up term in encyclopedia
 * @param {string} term - Term to look up
 * @returns {Promise<Object>} - Encyclopedia result
 */
async function lookupEncyclopedia(term) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call an encyclopedia API
        
        // For demo purposes, return simulated results for common terms
        const query = term.toLowerCase()
        
        if (query.includes('ecosystem')) {
            return {
                title: 'Ecosystem',
                summary: 'An ecosystem is a community of living organisms in conjunction with the nonliving components of their environment, interacting as a system. These biotic and abiotic components are linked together through nutrient cycles and energy flows. Ecosystems can be of any size but usually encompass specific, limited spaces.',
                details: 'Ecosystems contain biotic or living parts, as well as abiotic factors, or nonliving parts. Biotic factors include plants, animals, and other organisms. Abiotic factors include rocks, temperature, and humidity. Energy enters the system through photosynthesis and is incorporated into plant tissue. By feeding on plants and on one another, animals play an important role in the movement of matter and energy through the system. They also influence the quantity of plant and microbial biomass present.',
                relatedTopics: ['Biodiversity', 'Ecology', 'Food web', 'Habitat', 'Biome']
            }
        } else if (query.includes('quantum computing')) {
            return {
                title: 'Quantum Computing',
                summary: 'Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. The devices that perform quantum computations are known as quantum computers.',
                details: 'Quantum computers are believed to be able to solve certain computational problems, such as integer factorization (which underlies RSA encryption), substantially faster than classical computers. The study of quantum computing is a subfield of quantum information science. It uses quantum bits or qubits, which can be in superpositions of states. Quantum computers can process massive and complex datasets more efficiently than classical computers.',
                relatedTopics: ['Quantum mechanics', 'Qubit', 'Quantum entanglement', 'Quantum supremacy', 'Quantum algorithms']
            }
        } else {
            // Generic response for any term
            return {
                title: term.charAt(0).toUpperCase() + term.slice(1),
                summary: `This is a simulated encyclopedia entry for "${term}". In a full implementation, this would contain actual information from an encyclopedia or knowledge base API.`,
                details: `The entry would typically include historical context, significance, applications, and other relevant information about ${term}. This demonstration shows the structure of how such information would be presented.`,
                relatedTopics: ['Related1', 'Related2', 'Related3', 'Related4']
            }
        }
    } catch (error) {
        console.error('Error looking up encyclopedia:', error)
        return null
    }
}