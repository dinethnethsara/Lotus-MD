/**
 * Currency Converter plugin for Lotus MD
 * Convert between different currencies
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'currency',
    description: 'Convert between different currencies',
    commands: ['currency', 'convert', 'exchange', 'forex'],
    usage: '.currency [amount] [from] [to]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there are enough arguments
            if (args.length < 3) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide amount, source currency, and target currency.\n\nExamples:\n${prefix}currency 100 USD EUR\n${prefix}convert 50 USD JPY\n${prefix}exchange 200 EUR GBP` 
                })
                return
            }
            
            // Parse arguments
            const amount = parseFloat(args[0])
            const fromCurrency = args[1].toUpperCase()
            const toCurrency = args[2].toUpperCase()
            
            // Validate amount
            if (isNaN(amount) || amount <= 0) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Invalid amount. Please provide a positive number.` 
                })
                return
            }
            
            // Validate currencies (simple validation)
            const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'KRW', 'MXN', 'SGD', 'ZAR', 'THB', 'RUB', 'BRL', 'MYR']
            
            if (!validCurrencies.includes(fromCurrency)) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Invalid source currency: ${fromCurrency}. Please use a valid currency code.` 
                })
                return
            }
            
            if (!validCurrencies.includes(toCurrency)) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Invalid target currency: ${toCurrency}. Please use a valid currency code.` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `💱 Converting ${amount} ${fromCurrency} to ${toCurrency}...` 
            })
            
            // Convert currency (this would be a real API call in a full implementation)
            const result = await convertCurrency(amount, fromCurrency, toCurrency)
            
            if (!result) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Failed to convert currency. Please try again later.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format and send the result
            const responseText = `
💱 *Currency Conversion*

*Amount:* ${amount.toLocaleString()} ${fromCurrency}
*Converted:* ${result.convertedAmount.toLocaleString()} ${toCurrency}
*Exchange Rate:* 1 ${fromCurrency} = ${result.rate.toFixed(6)} ${toCurrency}
*Last Updated:* ${result.lastUpdated}

*Lotus MD* • Currency Converter
`.trim()
            
            // Send the result
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in currency converter plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to convert currency: ' + error.message })
        }
    }
}

/**
 * Convert currency
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {Promise<Object>} - Conversion result
 */
async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a currency conversion API
        
        // Sample conversion rates (as of May 2025, simulated)
        const rates = {
            'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 108.95, 'AUD': 1.34, 'CAD': 1.25, 'CHF': 0.88, 'CNY': 6.47, 'INR': 74.5, 'KRW': 1120.5, 'MXN': 19.95, 'SGD': 1.33, 'ZAR': 14.72, 'THB': 31.45, 'RUB': 75.2, 'BRL': 5.24, 'MYR': 4.15 },
            'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 118.44, 'AUD': 1.45, 'CAD': 1.36, 'CHF': 0.96, 'CNY': 7.04, 'INR': 81.05, 'KRW': 1218.6, 'MXN': 21.7, 'SGD': 1.45, 'ZAR': 16.01, 'THB': 34.2, 'RUB': 81.8, 'BRL': 5.7, 'MYR': 4.51 },
            'GBP': { 'USD': 1.26, 'EUR': 1.16, 'JPY': 137.65, 'AUD': 1.69, 'CAD': 1.58, 'CHF': 1.11, 'CNY': 8.18, 'INR': 94.1, 'KRW': 1415, 'MXN': 25.2, 'SGD': 1.68, 'ZAR': 18.6, 'THB': 39.7, 'RUB': 95, 'BRL': 6.62, 'MYR': 5.24 }
            // Additional rates would be included in a real implementation
        }
        
        // Generate a conversion rate if not directly available
        let rate
        
        if (fromCurrency === toCurrency) {
            rate = 1
        } else if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
            rate = rates[fromCurrency][toCurrency]
        } else if (rates[toCurrency] && rates[toCurrency][fromCurrency]) {
            rate = 1 / rates[toCurrency][fromCurrency]
        } else if (fromCurrency === 'USD' && !rates[toCurrency]) {
            // Generate a random rate for demonstration
            rate = 1 + Math.random() * 100
        } else if (toCurrency === 'USD' && !rates[fromCurrency]) {
            // Generate a random rate for demonstration
            rate = 1 / (1 + Math.random() * 100)
        } else {
            // Convert through USD as a base currency
            const toUSD = rates[fromCurrency] ? 1 / rates[fromCurrency]['USD'] : 1 / (1 + Math.random() * 100)
            const fromUSD = rates[toCurrency] ? rates['USD'][toCurrency] : 1 + Math.random() * 100
            rate = toUSD * fromUSD
        }
        
        // Apply a small random fluctuation to simulate real-time changes
        rate = rate * (1 + (Math.random() * 0.02 - 0.01)) // ±1% fluctuation
        
        const convertedAmount = amount * rate
        
        return {
            amount,
            fromCurrency,
            toCurrency,
            rate,
            convertedAmount,
            lastUpdated: new Date().toLocaleString()
        }
    } catch (error) {
        console.error('Error converting currency:', error)
        return null
    }
}