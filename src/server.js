const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// read the client html file into memory
const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html'});
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

// io Server
const io = socketio(app);

// iterator for updating text
let iterator = 0;

io.on('connection', (socket) => {
   // Join the Room
   socket.join('room1');
   
   // When they increment, increase the iterator and broadcast it
   socket.on('increment', (data) => {
      iterator += data;
      io.sockets.in('room1').emit('iterate', iterator);
   });
   
   // When they disconnect, leave the room
   socket.on('disconnect', () => {
      socket.leave('room1'); 
   });
});