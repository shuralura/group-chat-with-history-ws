const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const crypto = require('crypto');

const server = http.createServer();
server.listen(webSocketsServerPort);

console.log('Starting server on port ' + webSocketsServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};
const messages = [];

const getUniqueUserID = () => {
    return `${crypto.randomUUID()}`;
};

wsServer.on('request', function (request) {
    var userID = getUniqueUserID();
    console.log((new Date()) + ' New connection ' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID);

    clients[userID].sendUTF(JSON.stringify({type:'auth-ack', userID: userID}));

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            try {
                let data = JSON.parse(message.utf8Data);
                console.log('Received Message: ', message.utf8Data);

                if (data.type === 'history') {
                    // broadcasting message to all connected clients
                    for (msg of messages) {
                        clients[data.userID].sendUTF(msg);
                        console.log('sent history to: ', message._client);
                    }
                }else if (data.type === 'message') {
                    // save then broadcast message to all connected clients
                    messages.push(message.utf8Data);
                    for (key in clients) {
                        clients[key].sendUTF(message.utf8Data);
                        console.log('sent Message to: ', key);
                    }
                }

            } catch (e) {
                // nothing
            }
        }
    });

});
