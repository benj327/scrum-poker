const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from "public"
app.use(express.static('public'));

// In-memory rooms
// rooms = { roomCode: { users: {socketId: {name, estimate}}, reveal: bool } }
const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  function removeUserFromRoom(roomCode) {
    if (!rooms[roomCode]) return;
    delete rooms[roomCode].users[socket.id];
    if (Object.keys(rooms[roomCode].users).length === 0) {
      delete rooms[roomCode];
      console.log(`Room ${roomCode} removed (empty).`);
    }
  }

  // Join room
  socket.on('joinRoom', ({ roomCode, userName }, callback) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = { users: {}, reveal: false };
    }
    // Limit 20 users
    if (Object.keys(rooms[roomCode].users).length >= 20) {
      return callback({ error: 'Room is full (max 20 users).' });
    }
    rooms[roomCode].users[socket.id] = { name: userName, estimate: null };
    socket.join(roomCode);
    callback({ success: true });
    io.to(roomCode).emit('roomUpdated', {
      users: rooms[roomCode].users,
      reveal: rooms[roomCode].reveal,
    });
  });

  // Estimate
  socket.on('estimate', ({ roomCode, estimate }) => {
    if (!rooms[roomCode] || !rooms[roomCode].users[socket.id]) return;
    rooms[roomCode].users[socket.id].estimate = estimate;
    io.to(roomCode).emit('roomUpdated', {
      users: rooms[roomCode].users,
      reveal: rooms[roomCode].reveal,
    });
  });

  // Reveal
  socket.on('reveal', (roomCode) => {
    if (!rooms[roomCode]) return;
    rooms[roomCode].reveal = true;
    io.to(roomCode).emit('roomUpdated', {
      users: rooms[roomCode].users,
      reveal: rooms[roomCode].reveal,
    });
  });

  // Reset
  socket.on('reset', (roomCode) => {
    if (!rooms[roomCode]) return;
    Object.values(rooms[roomCode].users).forEach((u) => { u.estimate = null; });
    rooms[roomCode].reveal = false;
    io.to(roomCode).emit('roomUpdated', {
      users: rooms[roomCode].users,
      reveal: rooms[roomCode].reveal,
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (const [code, roomData] of Object.entries(rooms)) {
      if (roomData.users[socket.id]) {
        removeUserFromRoom(code);
        if (rooms[code]) {
          io.to(code).emit('roomUpdated', {
            users: rooms[code].users,
            reveal: rooms[code].reveal,
          });
        }
        break;
      }
    }
  });
});

// Start
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Scrum Poker server running on port ${PORT}`);
});
