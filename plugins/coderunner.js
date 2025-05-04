/**
 * Code Runner plugin for Lotus MD
 * Run code snippets in various programming languages
 */

const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId } = require('../lib/utils')
const { exec } = require('child_process')
const util = require('util')

// Promisify exec
const execAsync = util.promisify(exec)

// Export plugin info
module.exports = {
    name: 'coderunner',
    description: 'Run code snippets in various programming languages',
    commands: ['run', 'code', 'exec', 'eval', 'execute'],
    usage: '.run [language] [code]',
    category: 'developer',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's code to run
            if (!text || args.length < 2) {
                const supportedLangs = 'js (JavaScript), py (Python), java, cpp (C++), c, php, go, rb (Ruby)'
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a language and code to run.\n\nSupported languages: ${supportedLangs}\n\nExample:\n${prefix}run js console.log("Hello, World!");\n\nYou can also use code blocks:\n${prefix}run py \`\`\`\nprint("Hello, World!")\n\`\`\``
                })
                return
            }
            
            // Parse language and code
            const language = args[0].toLowerCase()
            let code = args.slice(1).join(' ')
            
            // Check if code is in a code block (```code```)
            const codeBlockRegex = /```(?:\w+)?\s*\n?([\s\S]+?)```/
            const match = code.match(codeBlockRegex)
            
            if (match) {
                code = match[1].trim()
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `⚙️ Running ${getLanguageName(language)} code...` 
            })
            
            // Map language aliases to actual language
            const langMap = {
                'js': 'javascript',
                'py': 'python',
                'rb': 'ruby',
                'cpp': 'cpp',
                'c': 'c',
                'java': 'java',
                'php': 'php',
                'go': 'go'
            }
            
            const actualLang = langMap[language] || language
            
            // Check if language is supported
            if (!Object.values(langMap).includes(actualLang)) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Unsupported language: ${language}. Use one of: ${Object.keys(langMap).join(', ')}`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Run the code (this would be a real implementation in a full bot)
            const result = await runCode(code, actualLang)
            
            // Format and send the result
            const responseText = `
💻 *Code Execution*

*Language:* ${getLanguageName(actualLang)}
*Status:* ${result.success ? '✅ Success' : '❌ Error'}

*Input:*
\`\`\`${actualLang}
${code}
\`\`\`

*Output:*
\`\`\`
${result.output.trim() || 'No output'}
\`\`\`

${result.error ? `*Error:*\n\`\`\`\n${result.error}\n\`\`\`\n` : ''}*Execution Time:* ${result.executionTime}ms

*Lotus MD* • Code Runner
`.trim()
            
            // Send the result
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in code runner plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to run code: ' + error.message })
        }
    }
}

/**
 * Run code in specified language
 * @param {string} code - Code to run
 * @param {string} language - Programming language
 * @returns {Promise<Object>} - Execution result
 */
async function runCode(code, language) {
    try {
        // This is a placeholder for the actual code execution
        // In a real implementation, this would use a secure code execution environment
        // WARNING: Executing arbitrary code is extremely dangerous and should be done in a sandbox
        
        // For demo purposes, we'll return simulated results
        const startTime = Date.now()
        
        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
        
        const executionTime = Date.now() - startTime
        
        // Simulate outputs for different languages
        if (language === 'javascript') {
            // Simple JS evaluation simulation
            if (code.includes('console.log')) {
                return {
                    success: true,
                    output: code.includes('Hello') ? 'Hello, World!' : 'Output of your JavaScript code would appear here',
                    error: null,
                    executionTime
                }
            } else if (code.includes('Error') || code.includes('throw')) {
                return {
                    success: false,
                    output: '',
                    error: 'ReferenceError: Something is not defined',
                    executionTime
                }
            } else {
                return {
                    success: true,
                    output: 'undefined',
                    error: null,
                    executionTime
                }
            }
        } else if (language === 'python') {
            // Simple Python evaluation simulation
            if (code.includes('print')) {
                return {
                    success: true,
                    output: code.includes('Hello') ? 'Hello, World!' : 'Output of your Python code would appear here',
                    error: null,
                    executionTime
                }
            } else if (code.includes('error') || code.includes('raise')) {
                return {
                    success: false,
                    output: '',
                    error: 'NameError: name \'something\' is not defined',
                    executionTime
                }
            } else {
                return {
                    success: true,
                    output: '',
                    error: null,
                    executionTime
                }
            }
        } else {
            // Generic response for other languages
            return {
                success: true,
                output: `This is a simulated output for ${language} code.\nIn a real implementation, your code would be executed in a secure environment.`,
                error: null,
                executionTime
            }
        }
    } catch (error) {
        console.error('Error running code:', error)
        return {
            success: false,
            output: '',
            error: error.message,
            executionTime: 0
        }
    }
}

/**
 * Get language name from code
 * @param {string} code - Language code
 * @returns {string} - Language name
 */
function getLanguageName(code) {
    const languages = {
        'javascript': 'JavaScript',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C++',
        'c': 'C',
        'php': 'PHP',
        'go': 'Go',
        'ruby': 'Ruby'
    }
    
    return languages[code] || code
}