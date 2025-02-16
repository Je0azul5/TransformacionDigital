require('dotenv').config();
console.log('MongoDB URI:', process.env.MONGODB_URI);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { anonymizeMessage, deanonymizeMessage } = require('./services/anonymizer');
const OpenAIService = require('./services/OpenAIService');

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize OpenAI service
const openAIService = new OpenAIService();

// Anonymization endpoint
app.post('/anonymize', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid input. Message must be a string.' 
            });
        }

        const anonymizedMessage = await anonymizeMessage(message);
        
        res.json({ anonymizedMessage });
    } catch (error) {
        console.error('Anonymization error:', error);
        res.status(500).json({ 
            error: 'An error occurred during anonymization' 
        });
    }
});

// Deanonymization endpoint
app.post('/deanonymize', async (req, res) => {
    try {
        const { anonymizedMessage } = req.body;
        
        if (!anonymizedMessage || typeof anonymizedMessage !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid input. Anonymized message must be a string.' 
            });
        }

        const message = await deanonymizeMessage(anonymizedMessage);
        
        res.json({ message });
    } catch (error) {
        console.error('Deanonymization error:', error);
        res.status(500).json({ 
            error: 'An error occurred during deanonymization' 
        });
    }
});

// Update the complete endpoint
app.post('/complete', async (req, res) => {
    try {
        const { prompt, options } = req.body;
        
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid input. Prompt must be a string.' 
            });
        }

        console.log('Received completion request:', { prompt, options });

        const completion = await openAIService.generateCompletion(prompt, options);
        
        res.json({ completion });
    } catch (error) {
        console.error('Text completion error:', error);
        res.status(500).json({ 
            error: error.message || 'An error occurred during text completion',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 