# Data Privacy Vault

## Overview
Data Privacy Vault is a Node.js application that provides a secure way to handle Personally Identifiable Information (PII) through anonymization and de-anonymization services. It automatically detects and tokenizes sensitive information such as:
- Names
- Email addresses
- Phone numbers

The service maintains a secure mapping between the original data and tokenized values in MongoDB, allowing authorized services to retrieve the original information when needed.

## Features
- RESTful API endpoints for anonymization and de-anonymization
- Consistent token generation for identical PII
- MongoDB integration for token persistence
- OpenAI integration for text completion capabilities
- Token expiration management
- Error handling and validation
- CORS support

## Installation Steps

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd data-privacy-vault
```

2. **Install dependencies**
```bash
npm install express mongoose openai dotenv cors crypto
```

3. **Set up environment variables**
Create a `.env` file in the root directory with the following content:
```plaintext
PORT=3001
HASH_SALT=your-secret-salt-here
MONGODB_URI=mongodb://localhost:27017/privacy-vault
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_ORG_ID=org-9c1T2efhwEagAtsDDg3vy5Zx
```

4. **Ensure MongoDB is running**
```bash
# Start MongoDB (command may vary based on your installation)
mongod
```

5. **Start the application**
```bash
node src/server.js
```

## API Endpoints

### Anonymize Text
```bash
curl -X POST http://localhost:3001/anonymize \
-H "Content-Type: application/json" \
-d '{"message":"Mi nombre es Juan Pérez, mi email es juan.perez@gmail.com y mi teléfono es 3001234567"}'
```

### De-anonymize Text
```bash
curl -X POST http://localhost:3001/deanonymize \
-H "Content-Type: application/json" \
-d '{"anonymizedMessage":"Mi nombre es NAME_a1b2c3d4e5f6, mi email es EMAIL_f7e8d9c0b1a2 y mi teléfono es PHONE_b3c4d5e6f7a8"}'
```

### Text Completion (OpenAI)
```bash
curl -X POST http://localhost:3001/complete \
-H "Content-Type: application/json" \
-d '{
    "prompt": "Generar respuesta para oferta de trabajo",
    "options": {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are a professional HR assistant."
            },
            {
                "role": "user",
                "content": "Generar respuesta para oferta de trabajo"
            }
        ],
        "temperature": 0.7,
        "max_tokens": 150
    }
}'
```

## Project Structure
```
data-privacy-vault/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Token.js
│   ├── services/
│   │   └── anonymizer.js
│   │   └── OpenAIService.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Dependencies
- Express.js (^4.21.2)
- Mongoose (latest)
- OpenAI (latest)
- dotenv (^16.4.7)
- cors (^2.8.5)
- crypto (^1.0.1)

## Security Considerations
- Store sensitive environment variables securely
- Implement proper authentication in production
- Regular token cleanup through MongoDB TTL index
- Use HTTPS in production
- Implement rate limiting for API endpoints

## Environment Variables
- `PORT`: Server port (default: 3001)
- `HASH_SALT`: Secret salt for token generation
- `MONGODB_URI`: MongoDB connection string
- `OPENAI_API_KEY`: OpenAI API key
- `OPENAI_ORG_ID`: OpenAI Organization ID

## Error Handling
The API includes comprehensive error handling for:
- Invalid input validation
- MongoDB connection issues
- OpenAI API errors
- Token generation/retrieval errors

## Rate Limiting
Consider implementing rate limiting for production use to:
- Prevent API abuse
- Control OpenAI API costs
- Manage MongoDB load

## Contributing
[Add your contribution guidelines here]

## License
[Add your license information here]