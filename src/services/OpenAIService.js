const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is required in environment variables');
        }
        
        if (!process.env.OPENAI_ORGANIZATION) {
            throw new Error('OPENAI_ORGANIZATION is required in environment variables');
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            organization: process.env.OPENAI_ORGANIZATION
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
                temperature: 0.7,
                max_tokens: 150
            };

            console.log('API Key:', process.env.OPENAI_API_KEY.substring(0, 5) + '...');
            console.log('Organization:', process.env.OPENAI_ORGANIZATION);
            
            const completion = await this.openai.chat.completions.create(defaultOptions);
            
            if (!completion.choices || completion.choices.length === 0) {
                throw new Error('No completion choices returned from OpenAI');
            }

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI API Error:', {
                message: error.message,
                status: error.status,
                headers: error.response?.headers,
                data: error.response?.data
            });

            throw error;
        }
    }
}

module.exports = OpenAIService; 