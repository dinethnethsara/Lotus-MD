/**
 * PDF Reader plugin for Lotus MD
 * Extract text from PDF files
 */

const chalk = require('chalk')
const config = require('../config')
const fs = require('fs-extra')
const path = require('path')
const { generateRandomId, downloadMedia } = require('../lib/utils')

// Export plugin info
module.exports = {
    name: 'pdfreader',
    description: 'Extract text from PDF files',
    commands: ['readpdf', 'pdfread', 'pdftext', 'extractpdf'],
    usage: '.readpdf (reply to a PDF file)',
    category: 'research',
    
    /**
     * Plugin handler function
     * @param {Object} bot - The bot instance
     * @param {Object} m - The message object
     * @param {Object} params - Additional parameters
     */
    handler: async (bot, m, { command, args, text, prefix, isGroup, sender, pushname }) => {
        try {
            // Check if replying to a document
            if (!m.quoted || m.quoted.mtype !== 'documentMessage') {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `Please reply to a PDF document to extract text.\n\nExample: ${prefix}readpdf (reply to a PDF file)` 
                })
                return
            }
            
            // Check if the document is a PDF
            const mimetype = m.quoted.mimetype || ''
            if (mimetype !== 'application/pdf') {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `The replied document is not a PDF file. Only PDF files are supported.` 
                })
                return
            }
            
            // Send processing message
            const processingMsg = await bot.sendMessage(m.key.remoteJid, { 
                text: `📄 Processing PDF file...` 
            })
            
            // Get page range if specified
            let startPage = 1
            let endPage = 0 // 0 means all pages
            
            if (args.length > 0) {
                // Check if argument is in the format "1-5" (page range)
                const rangeMatch = args[0].match(/^(\d+)(?:-(\d+))?$/)
                if (rangeMatch) {
                    startPage = parseInt(rangeMatch[1])
                    if (rangeMatch[2]) {
                        endPage = parseInt(rangeMatch[2])
                    }
                } else {
                    // Single page number
                    const pageNum = parseInt(args[0])
                    if (!isNaN(pageNum)) {
                        startPage = pageNum
                        endPage = pageNum
                    }
                }
            }
            
            // Validate page range
            if (startPage < 1) {
                startPage = 1
            }
            
            if (endPage > 0 && endPage < startPage) {
                endPage = startPage
            }
            
            // Update processing message with page info
            let pageInfo = startPage
            if (endPage > 0) {
                pageInfo = `${startPage}-${endPage}`
            }
            
            await bot.sendMessage(m.key.remoteJid, { 
                text: `📄 Extracting text from PDF (Pages: ${pageInfo})...`,
                edit: processingMsg.key
            })
            
            // Download the PDF
            const pdfPath = await downloadMedia(m.quoted, bot)
            
            // Extract text from PDF (this would be a real implementation in a full bot)
            const extractedText = await extractTextFromPDF(pdfPath, startPage, endPage)
            
            if (!extractedText || extractedText.trim() === '') {
                await bot.sendMessage(m.key.remoteJid, { 
                    text: `❌ Could not extract text from the PDF. The file might be encrypted, scanned images, or does not contain extractable text.`,
                    edit: processingMsg.key
                })
                return
            }
            
            // Format with page info
            const pageRangeText = endPage > 0 ? 
                (startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}-${endPage}`) : 
                (startPage > 1 ? `From Page ${startPage}` : `All Pages`)
            
            const responseHeader = `
📑 *PDF Text Extraction*

*File:* ${m.quoted.fileName || 'PDF Document'}
*${pageRangeText}*

*Extracted Text:*
`.trim()
            
            // Check if the extracted text is too long
            if (extractedText.length > 3800) {
                // Send in parts
                const firstPart = responseHeader + '\n\n' + extractedText.substring(0, 3800) + '\n\n... (continued)'
                
                await bot.sendMessage(m.key.remoteJid, { 
                    text: firstPart,
                    edit: processingMsg.key
                })
                
                // Create text file for full content
                const textFilePath = path.join(process.cwd(), 'temp', `pdf_${generateRandomId()}.txt`)
                await fs.writeFile(textFilePath, extractedText)
                
                // Send the text file
                await bot.sendMessage(m.key.remoteJid, {
                    document: { url: textFilePath },
                    fileName: `${m.quoted.fileName || 'PDF'}_text.txt`,
                    mimetype: 'text/plain',
                    caption: `📄 Full extracted text (${extractedText.length} characters)`
                })
                
                // Clean up
                if (fs.existsSync(textFilePath)) {
                    await fs.unlink(textFilePath)
                }
            } else {
                // Send the complete extracted text
                await bot.sendMessage(m.key.remoteJid, { 
                    text: responseHeader + '\n\n' + extractedText,
                    edit: processingMsg.key
                })
            }
            
            // Clean up PDF file
            if (fs.existsSync(pdfPath)) {
                await fs.unlink(pdfPath)
            }
            
        } catch (error) {
            console.error(chalk.red(`Error in PDF reader plugin: ${error}`))
            await bot.sendMessage(m.key.remoteJid, { text: 'Failed to extract text from PDF: ' + error.message })
        }
    }
}

/**
 * Extract text from PDF
 * @param {string} pdfPath - Path to PDF file
 * @param {number} startPage - Starting page number
 * @param {number} endPage - Ending page number (0 for all pages)
 * @returns {Promise<string>} - Extracted text
 */
async function extractTextFromPDF(pdfPath, startPage = 1, endPage = 0) {
    try {
        // This is a placeholder for the actual PDF text extraction
        // In a real implementation, this would use a library like pdf-parse or pdfjs
        
        // For demo purposes, return a simulated extracted text
        return `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Section 1: Introduction
This is sample text that would be extracted from a PDF file in a real implementation. The text would preserve paragraphs, sections, and formatting as much as possible, depending on the PDF structure.

Section 2: Methodology
When extracting text from a PDF, the system would attempt to maintain the document's structure, including headings, paragraphs, and possibly even tables. However, complex layouts may not be perfectly preserved.

Section 3: Results
The extracted text would be useful for further processing, searching, or analysis. Users can specify page ranges to extract only the portions of the document they need.

Section 4: Conclusion
This is just a simulation of what the extracted text would look like. In a real implementation, this would be the actual content from the PDF file.`;
    } catch (error) {
        console.error('Error extracting text from PDF:', error)
        return null
    }
}