const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'message') {
      messages.push(data);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, 'client', 'build')));

server.listen(3001, () => console.log('Server running on http://localhost:3001'));
