const express = require('express');
const axios = require('axios');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_URL = process.env.SERVICE_URL || '';

// Configure Winston for structured logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ],
});

// Define a route that triggers an API call after a delay
app.get('/api/ping', (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}`;
    const count = Number(req.query.count) || 0;
    const timeout = calculateTimeout(count);

    res.send('Ping request received. API call will be made in a few seconds.');

    scheduleApiCall(fullUrl, count + 1, timeout);
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});

/**
 * Calculate the timeout based on the count.
 * Ensures that the timeout does not fall below 1500ms.
 */
function calculateTimeout(count) {
    let timeout = 4000 - (count * 1000);
    return timeout < 1500 ? 6000 : timeout;
}

/**
 * Schedule an API call after a delay.
 */
function scheduleApiCall(fullUrl, count, timeout) {
    setTimeout(() => {
        const apiUrl = `${SERVICE_URL || fullUrl}/api/ping?count=${count}`;

        axios.get(apiUrl)
            .then(() => {
                logger.info('API call made successfully', { count, timeout });
            })
            .catch(error => {
                logger.error('Error during API call', { apiUrl, count, timeout, message: error.message });
            });
    }, timeout);
}
