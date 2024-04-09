const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Create Express app and server
const app = express();
const server = http.createServer(app);

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// Create WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'client')));

// Array to store connected users
let connectedUsers = [];

// Event handler for WebSocket connections
wss.on('connection', (ws, req) => {
    console.log('A client connected');

    // Assign a unique ID to the user
    const userId = req.headers['sec-websocket-key'];

    // Store user connection information
    connectedUsers.push({ userId, status: 'active' });

    // Notify other clients about the new user
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'userConnected', userId }));
        }
    });

    // Handle messages from clients
    ws.on('message', (message) => {
        console.log('Received message:', message);

        // Broadcast the received message to all clients (excluding the sender)
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        // (Additional message handling logic can be added here)
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('A client disconnected');
        const index = connectedUsers.findIndex(user => user.userId === userId);
        if (index !== -1) {
            const disconnectedUser = connectedUsers.splice(index, 1)[0];
            // Notify other clients about the disconnected user
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'userDisconnected', userId: disconnectedUser.userId }));
                }
            });
        }
    });
});

// Check user activity periodically and update status
setInterval(() => {
    const now = Date.now();
    connectedUsers.forEach(user => {
        // Update user status based on activity
        // For example, mark as idle if no activity for a certain period
        const lastActivityTime = user.lastActivityTime || 0;
        if (now - lastActivityTime > 60000) { // Idle if no activity for 60 seconds
            user.status = 'idle';
        } else {
            user.status = 'active';
        }
        user.lastActivityTime = now;
    });
}, 30000); // Check every 30 seconds

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
