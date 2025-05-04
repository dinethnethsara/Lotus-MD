/**
 * Calculator plugin for Lotus MD
 * Perform mathematical calculations
 */

const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'calculator',
    description: 'Perform mathematical calculations',
    commands: ['calc', 'calculate', 'math'],
    usage: '.calc [expression]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's an expression to calculate
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a mathematical expression to calculate.\n\nExamples:\n${prefix}calc 2+2\n${prefix}calc 5*9-3\n${prefix}calc sin(30)` 
                })
                return
            }
            
            // Parse and sanitize the expression
            let expression = text.trim()
            
            // Evaluate the expression (with security checks)
            const result = safeEvaluate(expression)
            
            if (result.error) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Error: ${result.error}`
                })
                return
            }
            
            // Format and send the result
            const responseText = `
🧮 *Calculator*

*Expression:* ${expression}
*Result:* ${result.value}

*Lotus MD* • Calculator
`.trim()
            
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in calculator plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to calculate: ' + error.message })
        }
    }
}

/**
 * Safely evaluate a mathematical expression
 * @param {string} expression - Mathematical expression
 * @returns {Object} - Result with value or error
 */
function safeEvaluate(expression) {
    try {
        // Security check: Only allow safe characters
        if (!/^[0-9+\-*/().,%^e\s\t\n\rsqrtlogsincostan]+$/i.test(expression)) {
            return { error: 'Invalid expression. Only mathematical operations are allowed.' }
        }
        
        // Replace common mathematical functions with their JavaScript equivalents
        expression = expression
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sin\(/g, 'Math.sin(Math.PI/180*')
            .replace(/cos\(/g, 'Math.cos(Math.PI/180*')
            .replace(/tan\(/g, 'Math.tan(Math.PI/180*')
            .replace(/pi/gi, 'Math.PI')
            .replace(/e(?![a-z0-9])/gi, 'Math.E')
            .replace(/\\^/g, '**')
        
        // Evaluate the expression
        // WARNING: eval() is dangerous and should be used with caution
        // This is a simplified example, in a real implementation you would use a proper math library
        const result = eval(expression)
        
        // Check if result is a valid number
        if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
            return { error: 'Invalid result' }
        }
        
        // Format the result (handle decimal precision)
        const formatted = Number.isInteger(result) ? 
            result.toString() : 
            result.toPrecision(10).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
        
        return { value: formatted }
    } catch (error) {
        return { error: 'Invalid expression: ' + error.message }
    }
}