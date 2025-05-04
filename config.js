/**
 * Lotus MD Bot Configuration
 * Powered by Lotus Mansion
 */

const config = {
    // Bot Info
    botName: "Lotus MD",
    owner: ["1234567890@s.whatsapp.net"], // Replace with actual owner number
    
    // Bot Settings
    prefix: ".",
    sessionName: "lotus-session",
    
    // Features Control
    autoRead: true,
    autoTyping: true,
    antiSpam: true,
    
    // API Keys (Replace with actual keys when available)
    openaiApiKey: "YOUR_OPENAI_API_KEY",
    removeBgApiKey: "YOUR_REMOVE_BG_API_KEY",
    googleApiKey: "YOUR_GOOGLE_API_KEY",
    omdbApiKey: "YOUR_OMDB_API_KEY",
    weatherApiKey: "YOUR_WEATHER_API_KEY",
    truecallerApiKey: "YOUR_TRUECALLER_API_KEY",
    bitlyApiKey: "YOUR_BITLY_API_KEY",
    newsApiKey: "YOUR_NEWS_API_KEY",
    
    // Sticker Settings
    stickerAuthor: "Lotus MD",
    stickerPackname: "Created by Lotus Mansion",
    
    // Message Settings
    replyText: "I am Lotus MD Bot, how can I help you today?",
    errorReply: "An error occurred while processing your request.",
    
    // Limits and Cooldowns
    maxDownloadSize: 100, // MB
    commandCooldown: 3, // seconds
    
    // Database and Storage
    dbURI: "mongodb://localhost:27017/lotusmd", // If using MongoDB
    
    // Group Settings
    groupModeOnly: false, // If true, bot only responds in groups
    
    // Logs and Debug
    debugMode: false,
    
    // Security Settings
    allowedCodeExecution: ['javascript', 'python'], // For code runner plugin
    
    // OCR Settings
    supportedOcrLanguages: ['eng', 'spa', 'fre', 'deu', 'ita', 'por', 'rus', 'jpn', 'kor', 'chi_sim', 'ara', 'hin'],
    
    // Research Settings
    maxPdfPages: 20, // Maximum pages to extract from PDF
    maxExtractLength: 5000, // Maximum text length for extractions
    
    // Footer text for responses
    footer: "Lotus MD • Powered by Lotus Mansion"
}

module.exports = config