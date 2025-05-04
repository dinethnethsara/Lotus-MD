/**
 * Plugin Loader for Lotus MD
 * Handles loading and managing plugins from the plugins directory
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

/**
 * Load all plugins from the plugins directory
 * @param {string} pluginsDir - Path to the plugins directory
 * @returns {Array} - Array of loaded plugin objects
 */
async function loadPlugins(pluginsDir) {
    try {
        // Create plugins directory if it doesn't exist
        await fs.ensureDir(pluginsDir)
        
        // Get all plugin files
        const files = await fs.readdir(pluginsDir)
        const plugins = []
        
        for (const file of files) {
            // Only load JavaScript files
            if (!file.endsWith('.js')) continue
            
            try {
                // Full path to the plugin file
                const pluginPath = path.join(pluginsDir, file)
                
                // Clear require cache to allow reloading
                delete require.cache[require.resolve(pluginPath)]
                
                // Load the plugin
                const plugin = require(pluginPath)
                
                // Validate plugin structure
                if (!plugin.name) {
                    console.log(chalk.yellow(`Warning: Plugin ${file} is missing name property`))
                    plugin.name = path.basename(file, '.js')
                }
                
                if (!plugin.commands || !Array.isArray(plugin.commands) || plugin.commands.length === 0) {
                    console.log(chalk.yellow(`Warning: Plugin ${plugin.name} has no commands defined`))
                    plugin.commands = []
                }
                
                if (!plugin.handler || typeof plugin.handler !== 'function') {
                    console.log(chalk.red(`Error: Plugin ${plugin.name} missing handler function`))
                    continue
                }
                
                // Add plugin to list
                plugins.push(plugin)
                console.log(chalk.green(`Loaded plugin: ${plugin.name} with commands: ${plugin.commands.join(', ')}`))
                
            } catch (error) {
                console.error(chalk.red(`Failed to load plugin ${file}: ${error.message}`))
            }
        }
        
        return plugins
    } catch (error) {
        console.error(chalk.red(`Error loading plugins: ${error.message}`))
        return []
    }
}

/**
 * Reload a specific plugin
 * @param {string} pluginName - Name of the plugin to reload
 * @param {string} pluginsDir - Path to the plugins directory
 * @returns {Object|null} - Reloaded plugin or null if not found
 */
async function reloadPlugin(pluginName, pluginsDir) {
    try {
        const pluginPath = path.join(pluginsDir, `${pluginName}.js`)
        
        if (!await fs.pathExists(pluginPath)) {
            return null
        }
        
        // Clear require cache to force reload
        delete require.cache[require.resolve(pluginPath)]
        
        // Load the plugin
        const plugin = require(pluginPath)
        
        // Validate plugin structure
        if (!plugin.name) {
            plugin.name = pluginName
        }
        
        if (!plugin.commands || !Array.isArray(plugin.commands)) {
            plugin.commands = []
        }
        
        if (!plugin.handler || typeof plugin.handler !== 'function') {
            return null
        }
        
        return plugin
    } catch (error) {
        console.error(chalk.red(`Error reloading plugin ${pluginName}: ${error.message}`))
        return null
    }
}

module.exports = {
    loadPlugins,
    reloadPlugin
}