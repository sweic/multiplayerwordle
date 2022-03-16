const express = require('express');
const webSocketServer = require('websocket').server
const {randomString} = require('./helper/index.js');
const {initWebSocket} = require('./ws/index.js');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 80;

const clients = {};
const games = {};
app.use(cors({origin: "http://192.168.1.67"}));
app.use(express.json());

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}
)
const wss = new webSocketServer({
    httpServer: server
})
initWebSocket(wss, clients, games);





