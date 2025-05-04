/**
 * Lotus MD Bot Starter Script
 * Powered by Lotus Mansion
 */

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')

// Welcome banner
console.log(chalk.bold.cyan(`
╭────────────────────────────────────────────────────╮
│                                                    │
│             █▓▒▒░░░ LOTUS MD ░░░▒▒▓█               │
│                                                    │
│          Powered By Lotus Mansion                  │
│                                                    │
╰────────────────────────────────────────────────────╯
`))

// Ensure necessary directories exist
fs.ensureDirSync('./auth_info_baileys')
fs.ensureDirSync('./plugins')
fs.ensureDirSync('./temp')

// Function to start the bot
function start() {
    const args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)]
    
    console.log(chalk.cyan('Starting Lotus MD...'))
    
    const p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })
    
    p.on('message', data => {
        if (data === 'reset') {
            console.log(chalk.yellow('Restarting bot...'))
            p.kill()
            start()
        }
    })
    
    p.on('exit', code => {
        const reason = code ? `with code ${code}` : 'without code'
        console.log(chalk.red(`Bot exited ${reason}`))
        
        if (code === 0) return
        
        // If not exited normally, restart after 2 seconds
        console.log(chalk.yellow('Trying to restart...'))
        setTimeout(() => {
            start()
        }, 2000)
    })
}

// Start the bot
start()