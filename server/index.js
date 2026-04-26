const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// In-memory room storage
const rooms = {};

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

app.get('/health', (req, res) => res.json({ status: 'ok', rooms: Object.keys(rooms).length }));

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new game room
  socket.on('create_room', ({ playerName, characterData }) => {
    let code = generateRoomCode();
    while (rooms[code]) code = generateRoomCode();

    rooms[code] = {
      code,
      players: {
        [socket.id]: { id: socket.id, name: playerName, character: characterData, isHost: true }
      },
      createdAt: Date.now()
    };

    socket.join(code);
    socket.roomCode = code;
    socket.emit('room_created', { code, playerId: socket.id });
    console.log(`Room ${code} created by ${playerName}`);
  });

  // Join an existing room
  socket.on('join_room', ({ code, playerName, characterData }) => {
    const room = rooms[code.toUpperCase()];
    if (!room) {
      socket.emit('join_error', { message: 'Room not found. Check the code!' });
      return;
    }
    const playerCount = Object.keys(room.players).length;
    if (playerCount >= 2) {
      socket.emit('join_error', { message: 'Room is full (2 players max).' });
      return;
    }

    room.players[socket.id] = { id: socket.id, name: playerName, character: characterData, isHost: false };
    socket.join(code.toUpperCase());
    socket.roomCode = code.toUpperCase();

    // Get the host player info
    const hostPlayer = Object.values(room.players).find(p => p.isHost);

    socket.emit('room_joined', {
      code: code.toUpperCase(),
      playerId: socket.id,
      friendData: hostPlayer
    });

    // Notify host that friend joined
    socket.to(code.toUpperCase()).emit('friend_joined', {
      friendId: socket.id,
      friendName: playerName,
      character: characterData
    });
    console.log(`${playerName} joined room ${code.toUpperCase()}`);
  });

  // Update character data (called on age up, activity, etc.)
  socket.on('update_character', ({ characterData }) => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    if (rooms[code].players[socket.id]) {
      rooms[code].players[socket.id].character = characterData;
    }
    // Broadcast to the other player in the room
    socket.to(code).emit('friend_character_updated', { character: characterData });
  });

  // Broadcast a life event to friend
  socket.on('broadcast_event', ({ event, characterSnapshot }) => {
    const code = socket.roomCode;
    if (!code) return;
    socket.to(code).emit('friend_event', { event, character: characterSnapshot });
  });

  // Send a reaction to a friend's event
  socket.on('send_reaction', ({ eventId, reaction }) => {
    const code = socket.roomCode;
    if (!code) return;
    socket.to(code).emit('receive_reaction', { eventId, reaction, fromId: socket.id });
  });

  // Send a direct message or gift
  socket.on('send_gift', ({ amount, message }) => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    const sender = rooms[code].players[socket.id];
    socket.to(code).emit('receive_gift', {
      amount,
      message,
      fromName: sender?.name || 'Your Friend'
    });
  });

  // Send a chat/taunt message
  socket.on('send_message', ({ text }) => {
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    const sender = rooms[code].players[socket.id];
    socket.to(code).emit('receive_message', {
      text,
      fromName: sender?.name || 'Friend',
      fromId: socket.id,
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    const code = socket.roomCode;
    if (code && rooms[code]) {
      delete rooms[code].players[socket.id];
      socket.to(code).emit('friend_disconnected', { playerId: socket.id });
      if (Object.keys(rooms[code].players).length === 0) {
        delete rooms[code];
        console.log(`Room ${code} deleted (empty)`);
      }
    }
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Clean up old empty rooms every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(rooms).forEach(code => {
    if (now - rooms[code].createdAt > 24 * 60 * 60 * 1000) delete rooms[code];
  });
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`LifeSim server running on port ${PORT}`));
