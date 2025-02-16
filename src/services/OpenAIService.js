const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is required in environment variables');
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    /**
     * Generates a text completion using OpenAI's API
     * @param {string} prompt - The input text to complete
     * @param {Object} options - Optional parameters for the completion
     * @returns {Promise<string>} - The generated completion
     */
    async generateCompletion(prompt, options = {}) {
        try {
            console.log('Sending request to OpenAI with prompt:', prompt);
            
            const defaultOptions = {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 150
            };

            // Merge with provided options
            const finalOptions = {
                ...defaultOptions,
                ...options,
                messages: options.messages || defaultOptions.messages
            };

            console.log('Using options:', finalOptions);

            const completion = await this.openai.chat.completions.create(finalOptions);

            if (!completion.choices || completion.choices.length === 0) {
                throw new Error('No completion choices returned from OpenAI');
            }

            return completion.choices[0].message.content;
        } catch (error) {
            // Detailed error logging
            console.error('OpenAI API Error Details:', {
                message: error.message,
                type: error.type,
                status: error.status,
                stack: error.stack
            });

            if (error.response) {
                console.error('OpenAI API Response Error:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }

            // Throw a more specific error
            throw new Error(`OpenAI API Error: ${error.message}`);
        }
    }
}

module.exports = OpenAIService; 