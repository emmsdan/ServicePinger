const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
let selfUrl = process.env.SERVICE_URL || ''
// Define a route that triggers an API call after 4 seconds
app.get('/api/ping', (req, res) => {
    // Send an immediate response to the client
    res.send('Ping request received. API call will be made in 4 seconds.');
    const fullUrl = req.protocol + '://' + req.get('host') ;//+ req.originalUrl;
    const count = Number(req.query.count || 0);
    // Set a delay of 4 seconds before making the API call
     // 4000 milliseconds = 4 seconds
    let timeout = 4000 - (count)
    timeout = timeout < 1500 ? 6000: timeout
    recurringAPI(fullUrl, count+1, timeout)
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function recurringAPI(fullUrl,count, timeout=4000) {
    setTimeout(() => {
        selfUrl = selfUrl || fullUrl;
        axios.get(`${selfUrl}/api/ping?count=${count}`)
            .then(() => {
                console.log('API call to /api/ping was made.', { count, timeout });
            })
            .catch(error => {
                console.error('Error during API call:', {selfUrl, count, timeout});
            });
    }, timeout);
}