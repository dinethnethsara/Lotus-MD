/**
 * Utility functions for Lotus MD
 * Powered by Lotus Mansion
 */

const axios = require('axios')
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment-timezone')
const { jidDecode } = require('@whiskeysockets/baileys')
const config = require('../config')

/**
 * Format a phone number into a WhatsApp JID
 * @param {string} number - Phone number
 * @returns {string} - Formatted JID
 */
const formatNumber = (number) => {
    let formatted = number.replace(/\\D/g, '')
    
    // Add the suffix if not present
    if (!formatted.endsWith('@s.whatsapp.net')) {
        formatted += '@s.whatsapp.net'
    }
    
    return formatted
}

/**
 * Get username from a JID
 * @param {string} jid - WhatsApp JID
 * @returns {string} - Username
 */
const getUserName = (jid) => {
    const decoded = jidDecode(jid)
    return decoded?.user || jid
}

/**
 * Check if JID is a group
 * @param {string} jid - WhatsApp JID
 * @returns {boolean} - True if group
 */
const isGroup = (jid) => {
    return jid.endsWith('@g.us')
}

/**
 * Generate a random ID
 * @param {number} length - Length of ID
 * @returns {string} - Random ID
 */
const generateRandomId = (length = 10) => {
    return crypto.randomBytes(length).toString('hex')
}

/**
 * Get current time in specified format
 * @param {string} format - Time format
 * @returns {string} - Formatted time
 */
const getTime = (format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment().tz('Asia/Kolkata').format(format)
}

/**
 * Download media from message
 * @param {Object} message - Message object
 * @param {Object} bot - Bot instance
 * @returns {Promise<string>} - Path to saved media
 */
const downloadMedia = async (message, bot) => {
    try {
        const mediaType = message.mtype
        
        // Check media type
        if (!mediaType || !['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(mediaType)) {
            throw new Error('Invalid media type')
        }
        
        // Create directory if it doesn't exist
        const directory = path.join(process.cwd(), 'temp')
        await fs.ensureDir(directory)
        
        // Generate filename
        const filename = `${generateRandomId()}.${getExtension(mediaType)}`
        const filepath = path.join(directory, filename)
        
        // Download and save the media
        const buffer = await bot.downloadMediaMessage(message)
        await fs.writeFile(filepath, buffer)
        
        return filepath
    } catch (error) {
        console.error('Error downloading media:', error)
        throw error
    }
}

/**
 * Get file extension for media type
 * @param {string} mediaType - Type of media
 * @returns {string} - File extension
 */
const getExtension = (mediaType) => {
    switch (mediaType) {
        case 'imageMessage':
            return 'jpg'
        case 'videoMessage':
            return 'mp4'
        case 'audioMessage':
            return 'mp3'
        case 'stickerMessage':
            return 'webp'
        case 'documentMessage':
            return 'bin'
        default:
            return 'bin'
    }
}

/**
 * Format seconds to human readable time
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    seconds -= days * 24 * 60 * 60
    
    const hours = Math.floor(seconds / (60 * 60))
    seconds -= hours * 60 * 60
    
    const minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60
    
    let result = ''
    if (days) result += `${days}d `
    if (hours) result += `${hours}h `
    if (minutes) result += `${minutes}m `
    if (seconds) result += `${seconds}s`
    
    return result.trim()
}

/**
 * Parse command arguments
 * @param {string} text - Command text
 * @returns {Object} - Parsed arguments
 */
const parseArgs = (text) => {
    const args = text.split(' ')
    const command = args.shift().toLowerCase()
    
    return { command, args, text: args.join(' ') }
}

/**
 * Download file from URL
 * @param {string} url - URL to download
 * @param {string} filename - Filename to save as
 * @returns {Promise<string>} - Path to saved file
 */
const downloadFile = async (url, filename) => {
    try {
        const response = await axios({
            method: 'GET',
            url,
            responseType: 'arraybuffer'
        })
        
        const filepath = path.join(process.cwd(), 'temp', filename)
        await fs.writeFile(filepath, response.data)
        
        return filepath
    } catch (error) {
        console.error('Error downloading file:', error)
        throw error
    }
}

/**
 * Check if user is bot owner
 * @param {string} jid - User JID
 * @returns {boolean} - True if owner
 */
const isOwner = (jid) => {
    return config.owner.includes(jid)
}

module.exports = {
    formatNumber,
    getUserName,
    isGroup,
    generateRandomId,
    getTime,
    downloadMedia,
    formatTime,
    parseArgs,
    downloadFile,
    isOwner
}