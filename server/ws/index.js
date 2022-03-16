const {randomString} = require('../helper/index.js');
const {WORDS} = require('../helper/constants.js');
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

function initWebSocket(wss, clients, games) {
  wss.on('request', function (request) {
  var userID = getUniqueID();
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  connection.send(JSON.stringify({type: "initial", clientID: userID}))
  console.log(Object.keys(clients));
  console.log(Object.keys(games));


  connection.on('close', function (connection) {
      console.log((userID + "disconnected"));
      delete clients[userID]
      const gameID = Object.keys(games).find((game) =>  games[game].clientID.includes(userID))
      const targetGame = games[gameID]
      if (targetGame) {
        const idx = targetGame.clientID.indexOf(userID)
        if (idx >= 0) {
          games[gameID].clients.splice(idx, 1)
          games[gameID].clientID.splice(idx, 1)
          games[gameID].usernames.splice(idx, 1)
        }
        if (games[gameID].clients.length == 0) {
          delete games[gameID];
        }
        
      }
      console.log(Object.keys(clients));
      console.log(Object.keys(games));
  })

  connection.on('message', function (message) {
    
      console.log(`${userID} sent a message:`)
      const target = JSON.parse(message.utf8Data);
      console.log(games);
      
      
      
      if (target.type == "create") {
        console.log(target);
        const targetClient = clients[target.payload.clientID]
        if (targetClient) {
          const gameID = randomString(6)
          console.log(gameID);
          targetClient.send(JSON.stringify({type: "create", gameID: gameID, user: target.payload.username}))
          games[gameID] = {
            clientID: [target.payload.clientID], 
            clients: [targetClient], 
            usernames: [target.payload.username], 
            progress: "waiting",
            rematch: [],
            max: [],
          }
          console.log(games);
        }
        
      }

      if (target.type == "exit") {
        const gameID = target.payload.gameID
        const targetGame = games[gameID];
        if (targetGame) {
          const idx = targetGame.clientID.indexOf(userID)
          const index = targetGame.rematch.indexOf(userID)
          if (idx >= 0) {
            games[gameID].clients.splice(idx, 1)
            games[gameID].clientID.splice(idx, 1)
            games[gameID].usernames.splice(idx, 1)
            games[gameID].rematch.splice(index, 1);
          }
          if (games[gameID].clients.length == 0) {
            delete games[gameID];
          }
          
        }
        console.log(games);
      }

      if (target.type == "join") {
        const targetGame = games[target.payload.code]
        if (targetGame) {
          if (targetGame.clients.length == 1 && targetGame.progress == "waiting") {
            games[target.payload.code].clients.push(connection);
            games[target.payload.code].clientID.push(userID);
            games[target.payload.code].usernames.push(target.payload.username);
            games[target.payload.code].progress = "ingame"
            connection.send(JSON.stringify({type: "join-success", user:target.payload.username}));
            const idx = Math.floor((Math.random() * 2314) + 1);
            const wordle = WORDS[idx]
            console.log(wordle);
            const data = {
              type: "start",
              gameID: target.payload.code,
              players: games[target.payload.code].usernames,
              wordle: wordle
            }
            games[target.payload.code].clients.map((con) => {con.send(JSON.stringify(data));
            })
          } else {
            connection.send(JSON.stringify({type: "join-error", message: "full"}));
          }
        } else {
          connection.send(JSON.stringify({type: "join-error", message: "null"}));
        }
      }

      if (target.type == "winner") {
        const targetGame = games[target.payload.gameID];
        if (targetGame) {
          const data = {
            type: "winner",
            winner: target.payload.winner
          }
          targetGame.clients.map((con) => {
            con.send(JSON.stringify(data))
          })

        }
      }
      if (target.type == "update") {
        const targetGame = games[target.payload.gameID];
        console.log(target);
        if (targetGame) {
          const idx = targetGame["clientID"].findIndex((id) => id != target.payload.clientID);
          
          if (idx >= 0) {
            console.log("sent");
            const data = {
              type: "update",
              rows: target.payload.rows
            }
            targetGame["clients"][idx].send(JSON.stringify(data));
          }
        }
        
      }
      if (target.type == "rematch") {
        const targetGame = games[target.payload.gameID];
        if (targetGame) {
          if (!targetGame.rematch.includes(userID)) {
            games[target.payload.gameID].rematch.push(userID)
          }
          if (games[target.payload.gameID].rematch.length == 2) {
            const idx = Math.floor((Math.random() * 2314) + 1);
            const wordle = WORDS[idx]
            console.log(wordle);
            const data = {
              type: "rematch",
              gameID: target.payload.gameID,
              wordle: wordle,
              players: games[target.payload.gameID].usernames,

            }
            games[target.payload.gameID].clients.map((con) => {
              con.send(JSON.stringify(data));
            })
            games[target.payload.gameID].rematch = [];
            games[target.payload.gameID].max = [];
          }
        }

      }

      if (target.type == "max") {
        const targetGame = games[target.payload.gameID];
        if (targetGame) {
          if (!targetGame.max.includes(userID)) {
            games[target.payload.gameID].max.push(userID);
          }
          if (games[target.payload.gameID].max.length == 2) {
            const data = {
              type: "max",
              tie: true
            }
            games[target.payload.gameID].clients.map((con) => {
              con.send(JSON.stringify(data));
            })
          }
        }
      }
  })
})
}
module.exports = {
  initWebSocket: initWebSocket
}