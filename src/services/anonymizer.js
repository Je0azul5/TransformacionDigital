const crypto = require('crypto');
const Token = require('../models/Token');

// Regular expressions for identifying PII
const PII_PATTERNS = {
    // Matches common Spanish/English name formats
    name: /\b[A-ZÀ-ÿ][a-zÀ-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zÀ-ÿ]+)+\b/g,
    
    // Matches email addresses
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    
    // Matches phone numbers (adjust as needed for your specific format)
    phone: /\b\d{10}\b/g
};

/**
 * Generates a consistent token for a given value
 * @param {string} value - The value to tokenize
 * @param {string} type - The type of PII (for salt purposes)
 * @returns {string} - The generated token
 */
async function generateToken(value, type) {
    const hash = crypto.createHash('sha256');
    // Add a type-specific salt to ensure different tokens for same values in different contexts
    hash.update(`${value}-${type}-${process.env.HASH_SALT || 'default-salt'}`);
    const tokenValue = `${type.toUpperCase()}_${hash.digest('hex').substring(0, 12)}`;
    
    try {
        // Check if token already exists
        let token = await Token.findOne({ token: tokenValue });
        
        if (!token) {
            // Create new token if it doesn't exist
            token = await Token.create({
                token: tokenValue,
                originalValue: value,
                type
            });
        }
        
        return tokenValue;
    } catch (error) {
        console.error('Error storing token:', error);
        throw error;
    }
}

/**
 * Anonymizes a message by replacing PII with tokens
 * @param {string} message - The message containing PII
 * @returns {string} - The anonymized message
 */
async function anonymizeMessage(message) {
    let anonymizedMessage = message;
    
    // Process each PII type
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
        // Use a for...of loop to handle async operations
        const matches = message.match(pattern) || [];
        for (const match of matches) {
            const token = await generateToken(match, type);
            anonymizedMessage = anonymizedMessage.replace(match, token);
        }
    }
    
    return anonymizedMessage;
}

/**
 * Deanonymizes a message by replacing tokens with original values
 * @param {string} anonymizedMessage - The message containing tokens
 * @returns {string} - The original message
 */
async function deanonymizeMessage(anonymizedMessage) {
    let deanonymizedMessage = anonymizedMessage;
    
    // Match any token pattern (TYPE_hexvalue)
    const tokenPattern = /([A-Z]+_[a-f0-9]{12})/g;
    const tokens = anonymizedMessage.match(tokenPattern) || [];
    
    for (const token of tokens) {
        const tokenDoc = await Token.findOne({ token });
        if (!tokenDoc) {
            throw new Error(`Token not found: ${token}`);
        }
        deanonymizedMessage = deanonymizedMessage.replace(token, tokenDoc.originalValue);
    }
    
    return deanonymizedMessage;
}

module.exports = {
    anonymizeMessage,
    deanonymizeMessage
}; 