<div align="center">
  <img src="./logo.png" alt="Lotus MD Logo" width="200">
  <h1>Lotus MD WhatsApp Bot</h1>
  <p>A powerful, feature-rich WhatsApp bot with plugin architecture.</p>
  
  <p><b>Powered by Lotus Mansion</b></p>
</div>

## ✨ Features

Lotus MD is a multi-device WhatsApp bot built with the Baileys API, offering a robust plugin system and over 50 useful features:

- **🛠️ Plugin Architecture**: Easily extend functionality with a modular plugin system
- **🎭 Fun Commands**: Jokes, quotes, memes, fortune cookies, and more
- **📱 Group Management**: Admin tools for group moderation including add, kick, promote, demote
- **🖼️ Media Conversion**: Create stickers from images, videos, and URLs
- **⬇️ Downloaders**: Support for YouTube, Instagram, TikTok, and many other platforms
- **🤖 AI Features**: Chat with AI assistant and generate images with AI
- **🔍 Search Tools**: Google, lyrics, weather, and more
- **🧰 Utility Tools**: Text-to-speech, translation, calculators, etc.

## 📋 Requirements

- Node.js v14 or higher
- A WhatsApp account
- Internet connection

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinethnethsara/lotus-md.git
   cd lotus-md
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   - Edit `config.js` with your preferences
   - Update the owner number
   - Add API keys for premium features (optional)

4. **Start the bot**
   ```bash
   npm start
   ```

5. **Scan the QR code** with your WhatsApp to link the bot

## 🛠️ Commands

Lotus MD comes with over 50 commands across various categories:

### Core Commands
- `.help` - Shows command list
- `.menu` - Displays menu with all commands
- `.info` - Bot information and stats
- `.ping` - Checks bot response time

### Sticker Commands
- `.sticker` - Create sticker from media
- `.toimg` - Convert sticker to image

### Downloader Commands
- `.ytv` - Download YouTube videos
- `.yta` - Download YouTube audio
- `.tiktok` - Download TikTok videos
- `.igdl` - Download Instagram content

### Group Commands
- `.add` - Add member to group
- `.kick` - Remove member from group
- `.promote` - Promote member to admin
- `.demote` - Demote admin to member
- `.groupset` - Change group settings

### AI Commands
- `.ai` - Chat with AI assistant
- `.imagine` - Generate images with AI

### Fun Commands
- `.joke` - Get random jokes
- `.quote` - Inspirational quotes
- `.meme` - Random memes
- `.fact` - Interesting facts
- `.advice` - Get life advice
- `.fortune` - Fortune cookie messages

### And many more!

## 🧩 Plugin Development

Lotus MD has a plugin architecture that makes it easy to add new features:

1. Create a new JavaScript file in the `plugins` folder
2. Use the following template:

```javascript
module.exports = {
    name: 'plugin-name',
    description: 'Plugin description',
    commands: ['command1', 'command2'],
    usage: '.command1 [args]',
    category: 'category',
    
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        // Plugin logic here
    }
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Credits

- **Lotus Mansion** - For creating and maintaining Lotus MD
- **WhiskeySockets/Baileys** - For the WhatsApp Web API
- **Contributors** - All who have contributed to the project

---

<div align="center">
  <h3>Lotus MD • Elegance in Automation</h3>
  <p>Made with ❤️ by Lotus Mansion</p>
</div>
