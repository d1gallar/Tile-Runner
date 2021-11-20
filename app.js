const { RSA_NO_PADDING } = require('constants');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const url = "http://localhost:3000/";
const io = require('socket.io')(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
    transports: ['websocket']
  }
});
const port = 3000;
const rooms = io.of("/").adapter.rooms;

//Prints how many users are online every 30s
// setInterval(()=>{
//   let userCount = io.engine.clientsCount;
//   console.log(`Users online: ${userCount}`);
//   console.log(rooms)
// }, 3000);

io.on("connection", (socket) =>{
  console.log('Connected:',socket.id);
  socket.leaveAll(socket.id);
  socket.join("global");

  socket.on("disconnect", ()=>{
    console.log('Disconnected:',socket.id);
  });
  
  socket.on("create-room", (room, cb) =>{
    console.log('Created room:',room, socket.id)
    socket.join(room);
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
    socket.emit("join-room", roomExists, error);
  });
  
  socket.on("leave-room", room =>{
    socket.leave(room);
    console.log("Left room:", room, socket.id);
  });
  
  socket.on("check-player-count", (room) =>{
    let count = 0;
    if(rooms.get(room)){
      count = rooms.get(room).size;
    }
    socket.emit('player-count', count);
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