const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;
// BACKEND_URL will be set by the Kubernetes service discovery later
const BACKEND_URL = process.env.BACKEND_SERVICE_URL || 'http://localhost:8000';

app.get('/', async (req, res) => {
    let backendStatus = 'Unknown';
    let backendMessage = 'Attempting connection...';

    try {
        // Fetch data from the internal backend API
        const response = await fetch(`${BACKEND_URL}/api/v1/status`);
        const data = await response.json();
        backendStatus = data.status;
        backendMessage = data.message;
    } catch (error) {
        // Handle connection failure gracefully (Enterprise Standard)
        console.error('Error calling backend:', error.message);
        backendStatus = 'DEGRADED';
        backendMessage = `[CRITICAL] Failed to connect to Backend Service. Error: ${error.message.substring(0, 50)}...`;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>OrionOps Dashboard</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
                h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 15px; margin-bottom: 25px; }
                h2 { color: #34495e; margin-top: 25px; }
                .status { padding: 15px; margin-top: 15px; border-radius: 6px; font-weight: bold; font-size: 1.1em; }
                .operational { background-color: #e6ffe6; color: #27ae60; border: 1px solid #2ecc71; }
                .degraded { background-color: #ffe6e6; color: #c0392b; border: 1px solid #e74c3c; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>OrionOps Mission Control (Frontend)</h1>
                <p>The Frontend (Node.js) is successfully running.</p>
                
                <h2>Backend Service Health Check</h2>
                <div class="status ${backendStatus.toLowerCase()}">
                    Service Status: ${backendStatus}
                </div>
                <p><strong>Message:</strong> ${backendMessage}</p>
                <p style="font-size: 0.8em; color: #7f8c8d;">Internal Target URL for Backend: <code>${BACKEND_URL}/api/v1/status</code></p>
            </div>
        </body>
        </html>
    `;
    res.send(htmlContent);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`OrionOps Frontend service listening on port ${PORT}`);
});