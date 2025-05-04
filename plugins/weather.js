/**
 * Weather plugin for Lotus MD
 * Get weather information for a location
 */

const axios = require('axios')
const chalk = require('chalk')
const config = require('../config')

// Export plugin info
module.exports = {
    name: 'weather',
    description: 'Get weather information for a location',
    commands: ['weather', 'forecast'],
    usage: '.weather [location]',
    category: 'tools',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if there's a location to search for
            if (!text) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please provide a location to check weather.\n\nExample: ${prefix}weather New York` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `🔍 Getting weather information for "${text}"...` 
            })
            
            // Get weather information
            const weather = await getWeather(text)
            
            if (!weather) {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Could not find weather information for "${text}". Please check the location and try again.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format and send the response
            const isDay = weather.current.is_day === 1
            const emoji = getWeatherEmoji(weather.current.condition.code, isDay)
            
            const responseText = `
${emoji} *Weather in ${weather.location.name}, ${weather.location.country}*

*Temperature:* ${weather.current.temp_c}°C / ${weather.current.temp_f}°F
*Condition:* ${weather.current.condition.text}
*Feels Like:* ${weather.current.feelslike_c}°C / ${weather.current.feelslike_f}°F
*Humidity:* ${weather.current.humidity}%
*Wind:* ${weather.current.wind_kph} km/h ${weather.current.wind_dir}
*Pressure:* ${weather.current.pressure_mb} mb
*Visibility:* ${weather.current.vis_km} km
*UV Index:* ${weather.current.uv}
*Last Updated:* ${weather.current.last_updated}

*3-Day Forecast:*
${weather.forecast.map(day => `• *${day.date}:* ${day.condition} ${day.mintemp_c}°C - ${day.maxtemp_c}°C`).join('\n')}

*Lotus MD* • Powered by Lotus Mansion
`.trim()
            
            await bot.sendMessage(m.key.remoteJid, { 
                text: responseText,
                edit: processingMsg.key
            })
            
        } catch (error) {
            console.error(chalk.red(`Error in weather plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to get weather information: ' + error.message })
        }
    }
}

/**
 * Get weather information for a location
 * @param {string} location - Location to get weather for
 * @returns {Promise<Object>} - Weather information
 */
async function getWeather(location) {
    try {
        // This is a placeholder for the actual API call
        // In a real implementation, this would call a weather API like OpenWeatherMap or WeatherAPI.com
        
        // For demo purposes, return a simulated response
        return {
            location: {
                name: location,
                region: 'New York',
                country: 'United States',
                lat: 40.71,
                lon: -74.01,
                tz_id: 'America/New_York',
                localtime: '2025-05-04 14:30'
            },
            current: {
                last_updated: '2025-05-04 14:30',
                temp_c: 22.5,
                temp_f: 72.5,
                is_day: 1,
                condition: {
                    text: 'Partly cloudy',
                    code: 1003
                },
                wind_mph: 8.1,
                wind_kph: 13.0,
                wind_dir: 'NE',
                pressure_mb: 1015,
                pressure_in: 30.0,
                precip_mm: 0.0,
                precip_in: 0.0,
                humidity: 65,
                cloud: 25,
                feelslike_c: 23.9,
                feelslike_f: 75.0,
                vis_km: 10.0,
                vis_miles: 6.2,
                uv: 5,
                gust_mph: 10.5,
                gust_kph: 16.9
            },
            forecast: [
                {
                    date: '2025-05-05',
                    maxtemp_c: 24.8,
                    maxtemp_f: 76.6,
                    mintemp_c: 18.2,
                    mintemp_f: 64.8,
                    condition: 'Sunny',
                    chance_of_rain: 0
                },
                {
                    date: '2025-05-06',
                    maxtemp_c: 26.1,
                    maxtemp_f: 79.0,
                    mintemp_c: 19.5,
                    mintemp_f: 67.1,
                    condition: 'Partly cloudy',
                    chance_of_rain: 20
                },
                {
                    date: '2025-05-07',
                    maxtemp_c: 22.3,
                    maxtemp_f: 72.1,
                    mintemp_c: 17.9,
                    mintemp_f: 64.2,
                    condition: 'Light rain',
                    chance_of_rain: 70
                }
            ]
        }
    } catch (error) {
        console.error('Error getting weather info:', error)
        return null
    }
}

/**
 * Get emoji for weather condition
 * @param {number} code - Weather condition code
 * @param {boolean} isDay - Whether it's daytime
 * @returns {string} - Weather emoji
 */
function getWeatherEmoji(code, isDay) {
    // This is a simplified version - in a real implementation, you would have more condition codes
    switch(code) {
        case 1000: // Clear/Sunny
            return isDay ? '☀️' : '🌙'
        case 1003: // Partly cloudy
            return isDay ? '⛅' : '☁️'
        case 1006: // Cloudy
        case 1009: // Overcast
            return '☁️'
        case 1030: // Mist
        case 1135: // Fog
        case 1147: // Freezing fog
            return '🌫️'
        case 1063: // Patchy rain
        case 1150: // Patchy light drizzle
        case 1153: // Light drizzle
        case 1180: // Patchy light rain
        case 1183: // Light rain
            return '🌦️'
        case 1186: // Moderate rain
        case 1189: // Moderate rain
        case 1192: // Heavy rain
        case 1195: // Heavy rain
            return '🌧️'
        case 1087: // Thundery outbreaks
        case 1273: // Patchy light rain with thunder
        case 1276: // Moderate or heavy rain with thunder
            return '⛈️'
        case 1066: // Patchy snow
        case 1114: // Blowing snow
        case 1210: // Patchy light snow
        case 1213: // Light snow
        case 1216: // Patchy moderate snow
        case 1219: // Moderate snow
            return '🌨️'
        case 1222: // Patchy heavy snow
        case 1225: // Heavy snow
        case 1237: // Ice pellets
            return '❄️'
        default:
            return '🌡️'
    }
}