import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();

game.subscribe(command => sockets.emit(command.type, command));

sockets.on('connection', socket => {
  const playerId = socket.id;

  game.addPlayer({ playerId })
  socket.emit('setup', game.state);

  socket.on('disconnect', socket => {
    game.removePlayer({ playerId })
  });
});

server.listen(3000, () => console.log('> Server listening on port: 3000'));