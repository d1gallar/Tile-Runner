const { RSA_NO_PADDING } = require('constants');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
// const url = "http://localhost:3000/";
const url = "http://192.168.1.121:3000/";
const io = require('socket.io')(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
    transports: ['websocket']
  }
});
const Board = require('./public/js/multiplayer/multi_board');
const port = 3000;
const rooms = io.of("/").adapter.rooms;
let boardMap = {};

//Prints how many users are online every 30s
// setInterval(()=>{
//   let userCount = io.engine.clientsCount;
//   console.log(`Users online: ${userCount}`);
//   console.log(rooms)
// }, 3000);

io.on("connection", (socket) =>{
  // console.log('Connected:',socket.id);
  socket.leaveAll();
  socket.join("global");

  socket.on("disconnect", ()=>{
    // console.log('Disconnected:',socket.id);
  });

  socket.on("check-room", room => {
    let roomExists = false;
    let error = "";
    for(let roomKey of rooms.keys()){
      if(roomKey == room){
        let count = rooms.get(room).size;
        console.log("room size:", count)
        if(count >= 2){
          console.log("Room is full:", room, count);
          error = "The room you are trying to join is full."+
            " Please try again later.";
        } else {
          console.log("Joining room:", room, socket.id);
        }
        roomExists = true;
      }
    }
    socket.emit("join-room-code", roomExists, error);
  });

  socket.on("join-room", room =>{
    console.log("[Joining room]", room, socket.id);
    socket.join(room);
  })
  
  socket.on("leave-room", room =>{
    socket.leave(room);
    console.log("[Left room]", room, socket.id);
  });

  socket.on("leave-all", () =>{
    socket.leaveAll();
  });
  
  socket.on("check-player-count", (room) =>{
    const clientRoom = io.sockets.adapter.rooms.get(room);
    let numClients = 0;
    if(clientRoom){
      numClients = clientRoom.size;
      if(numClients === 2) {
        socket.to(room).emit("full-lobby", true);
      }
    }
    socket.emit('player-count', numClients);
  });

  socket.on("join-game-room", (room) =>{
    let clientRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientRoom ? clientRoom.size : 0;
    
    console.log('[Join Attempt]', socket.id, numClients)
    if(numClients >= 2){
      console.log('\t[Failed]', room, numClients, socket.id);
      socket.emit('error-full-lobby', 'This room is currently full!');
    } else {
      socket.join(room);
      clientRoom = io.sockets.adapter.rooms.get(room);
      console.log('\t[Success]', room, clientRoom, clientRoom.size);
    }

    if(!boardMap[room]){
      let board = new Board();
      board.randomFill();
      board = board.getBoard();
      boardMap[room] = board;
    } 
    console.log(boardMap)
    socket.to(room).emit('players-ready', clientRoom.size,boardMap[room]);
    console.log('room size:', clientRoom.size)
  });

  socket.on('game-finished', room =>{
    console.log('Game ended in', room,'for user',socket.id);
    socket.to(room).emit('display-end-game');
  });
});

app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));

const indexRouter = require('./routes/index');
const singlePlayRouter = require('./routes/single');
const roomRouter = require('./routes/room');

app.use('/', indexRouter);
app.use('/singleplayer', singlePlayRouter);
app.use('/room', roomRouter);

server.listen(3000, () => {
  console.log(`Listening on ${url} !`);
});