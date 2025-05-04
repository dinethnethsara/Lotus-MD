const { 
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode
} = require('@whiskeysockets/baileys')
const fs = require('fs-extra')
const pino = require('pino')
const qrcode = require('qrcode-terminal')
const chalk = require('chalk')
const path = require('path')
const { Boom } = require('@hapi/boom')
const moment = require('moment-timezone')
const axios = require('axios')

// Plugin loader
const { loadPlugins } = require('./lib/pluginLoader')

// Store system
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

// Config
const config = require('./config')

async function startLotus() {
    console.log(chalk.bold.cyan(`
    ╭────────────────────────────────────────────────────╮
    │                                                    │
    │             █▓▒▒░░░ LOTUS MD ░░░▒▒▓█               │
    │                                                    │
    │          Powered By Lotus Mansion                  │
    │                                                    │
    ╰────────────────────────────────────────────────────╯
    `))
    
    // Create necessary directories
    await fs.ensureDir('./lotus-md/auth_info_baileys')
    await fs.ensureDir('./lotus-md/plugins')
    await fs.ensureDir('./lotus-md/temp')
    
    // Load authentication info
    const { state, saveCreds } = await useMultiFileAuthState('./lotus-md/auth_info_baileys')
    
    // Fetch latest version of Baileys
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(chalk.cyan(`Using Baileys version ${version}, isLatest: ${isLatest}`))
    
    // Create WA Socket connection
    const lotus = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['Lotus MD', 'Chrome', '1.0.0'],
        getMessage: async key => {
            return { conversation: 'Hello!' }
        }
    })
    
    // Bind store to connection
    store.bind(lotus.ev)
    
    // Handle connection updates
    lotus.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom &&
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut)
            
            console.log(chalk.red('Connection closed due to '), chalk.yellow(lastDisconnect.error))
            
            if (shouldReconnect) {
                console.log(chalk.green('Reconnecting...'))
                startLotus()
            } else {
                console.log(chalk.red('Connection closed. You are logged out.'))
            }
        }
        
        if (connection === 'open') {
            console.log(chalk.green('Lotus MD Connected!'))
            
            // Welcome message
            console.log(chalk.cyan(`
            ╭────────────────────────────────╮
            │                                │
            │   Lotus MD is now online! 🌸   │
            │                                │
            ╰────────────────────────────────╯
            `))
        }
    })
    
    // Save authentication credentials
    lotus.ev.on('creds.update', saveCreds)
    
    // Load plugins
    const plugins = await loadPlugins('./lotus-md/plugins')
    console.log(chalk.cyan(`Loaded ${plugins.length} plugins`))
    
    // Handle messages
    lotus.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            if (!chatUpdate.messages) return
            var m = chatUpdate.messages[0]
            if (!m.message) return
            
            m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
            
            if (m.key && m.key.remoteJid === 'status@broadcast') return
            
            if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
            
            const type = Object.keys(m.message)[0]
            const body = (type === 'conversation') ? 
                m.message.conversation : 
                (type == 'imageMessage') ? 
                    m.message.imageMessage.caption : 
                    (type == 'videoMessage') ? 
                        m.message.videoMessage.caption : 
                        (type == 'extendedTextMessage') ? 
                            m.message.extendedTextMessage.text : ''
            
            // Get command and arguments
            const prefix = config.prefix
            const isCmd = body.startsWith(prefix)
            const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : ''
            const args = body.trim().split(/ +/).slice(1)
            const text = args.join(' ')
            
            // Prepare sender information
            const sender = m.key.remoteJid
            const isGroup = sender.endsWith('@g.us')
            const pushname = m.pushName || "No Name"
            
            // Execute matching plugin command
            if (isCmd) {
                for (let plugin of plugins) {
                    if (plugin.commands && plugin.commands.includes(command)) {
                        try {
                            await plugin.handler(lotus, m, { command, args, text, prefix, isGroup, sender, pushname })
                            console.log(chalk.green(`[COMMAND] ${command} from ${pushname}`))
                        } catch (error) {
                            console.error(chalk.red(`Error executing plugin ${plugin.name}: ${error}`))
                            await lotus.sendMessage(sender, { text: `Error executing command: ${error.message}` })
                        }
                        break
                    }
                }
            }
            
        } catch (error) {
            console.error(chalk.red(`Error processing message: ${error}`))
        }
    })
    
    // Handle group participants update
    lotus.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update
            
            // Welcome and goodbye messages can be implemented here
            if (action === 'add') {
                await lotus.sendMessage(id, { 
                    text: `Welcome @${participants[0].split('@')[0]} to the group!`,
                    mentions: participants
                })
            } else if (action === 'remove') {
                await lotus.sendMessage(id, { 
                    text: `Goodbye @${participants[0].split('@')[0]}!`,
                    mentions: participants
                })
            }
            
        } catch (error) {
            console.error(chalk.red(`Error handling group update: ${error}`))
        }
    })
    
    return lotus
}

// Start the bot
startLotus()