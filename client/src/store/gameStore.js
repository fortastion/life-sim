import { create } from 'zustand';
import { createCharacter, processAgeUp, applyChoice, applyActivity, applyForJob } from '../engine/gameEngine';
import { connectSocket, disconnectSocket, getSocket } from '../socket';

const SAVE_KEY = 'lifesim_save';

const useGameStore = create((set, get) => ({
  // ── Game State ───────────────────────────────────────────────────────────
  phase: 'menu', // menu | create | playing | dead
  character: null,
  pendingChoices: [],
  notifications: [],
  activeTab: 'life',

  // ── Multiplayer State ────────────────────────────────────────────────────
  roomCode: null,
  isHost: false,
  friendConnected: false,
  friendName: null,
  friendCharacter: null,
  friendEvents: [],
  friendMessages: [],
  multiplayerError: null,
  socketConnected: false,

  // ── Actions ──────────────────────────────────────────────────────────────
  setPhase: (phase) => set({ phase }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  startNewGame: (config) => {
    const char = createCharacter(config);
    set({ character: char, phase: 'playing', pendingChoices: [], activeTab: 'life' });
    get().saveGame(char);
  },

  ageUp: () => {
    const { character, pendingChoices } = get();
    if (!character || !character.alive) return;
    if (pendingChoices.length > 0) {
      get().addNotification({ type: 'warning', message: 'Resolve your pending choices first!' });
      return;
    }

    const { character: newChar, choiceEvents, died } = processAgeUp(character);

    set({ character: newChar, pendingChoices: choiceEvents });

    if (died) {
      set({ phase: 'dead' });
      get().addNotification({ type: 'bad', message: `You died at age ${newChar.age}. ${newChar.deathCause}` });
    } else {
      get().addNotification({ type: 'neutral', message: `You are now ${newChar.age} years old!` });
    }

    // Broadcast to multiplayer friend
    const socket = getSocket();
    if (socket?.connected && get().roomCode) {
      const recentEvents = newChar.history.slice(-5);
      recentEvents.forEach(evt => {
        socket.emit('broadcast_event', { event: evt, characterSnapshot: { name: newChar.fullName, age: newChar.age, stats: newChar.stats } });
      });
      socket.emit('update_character', { characterData: newChar });
    }

    get().saveGame(newChar);
  },

  makeChoice: (eventId, choiceIndex) => {
    const { character, pendingChoices } = get();
    const newChar = applyChoice({ ...character, pendingChoices }, eventId, choiceIndex);
    const newPending = pendingChoices.filter(e => e.id !== eventId);
    set({ character: newChar, pendingChoices: newPending });

    // Broadcast choice event
    const socket = getSocket();
    if (socket?.connected && get().roomCode) {
      const event = pendingChoices.find(e => e.id === eventId);
      if (event) {
        socket.emit('broadcast_event', {
          event: { ...event, choiceMade: event.choices[choiceIndex]?.text },
          characterSnapshot: { name: newChar.fullName, age: newChar.age }
        });
      }
    }
    get().saveGame(newChar);
  },

  doActivity: (activity) => {
    const { character } = get();
    const result = applyActivity(character, activity);
    if (result.result === 'success') {
      set({ character: result.character });
      get().addNotification({ type: 'good', message: result.message });
      get().saveGame(result.character);
    } else {
      get().addNotification({ type: 'warning', message: result.message });
    }
    return result;
  },

  applyForJob: (track) => {
    const { character } = get();
    const result = applyForJob(character, track);
    set({ character: result.character });
    get().addNotification({ type: result.result === 'success' ? 'good' : 'bad', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  addNotification: (notif) => {
    const id = Date.now() + Math.random();
    set(s => ({ notifications: [...s.notifications, { id, ...notif }] }));
    setTimeout(() => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })), 3500);
  },

  // ── Save / Load ──────────────────────────────────────────────────────────
  saveGame: (char) => {
    try {
      const data = char || get().character;
      if (data) localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {}
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const char = JSON.parse(raw);
      set({ character: char, phase: char.alive ? 'playing' : 'dead', pendingChoices: [] });
      return true;
    } catch (_) { return false; }
  },

  clearSave: () => {
    localStorage.removeItem(SAVE_KEY);
    set({ character: null, phase: 'menu', pendingChoices: [] });
  },

  hasSave: () => !!localStorage.getItem(SAVE_KEY),

  // ── Multiplayer ──────────────────────────────────────────────────────────
  connectMultiplayer: () => {
    const socket = connectSocket();
    set({ socketConnected: socket.connected });

    socket.on('connect', () => set({ socketConnected: true, multiplayerError: null }));
    socket.on('disconnect', () => set({ socketConnected: false, friendConnected: false }));
    socket.on('connect_error', () => set({ multiplayerError: 'Cannot connect to server. Make sure it\'s running!' }));

    socket.on('room_created', ({ code }) => {
      set({ roomCode: code, isHost: true });
    });

    socket.on('room_joined', ({ code, friendData }) => {
      set({
        roomCode: code,
        isHost: false,
        friendConnected: true,
        friendName: friendData?.name,
        friendCharacter: friendData?.character
      });
    });

    socket.on('join_error', ({ message }) => {
      set({ multiplayerError: message });
    });

    socket.on('friend_joined', ({ friendId, friendName, character }) => {
      set({ friendConnected: true, friendName, friendCharacter: character });
      get().addNotification({ type: 'friend', message: `🎮 ${friendName} joined your game!` });
    });

    socket.on('friend_disconnected', () => {
      set({ friendConnected: false, friendName: null });
      get().addNotification({ type: 'warning', message: 'Your friend disconnected.' });
    });

    socket.on('friend_character_updated', ({ character }) => {
      set({ friendCharacter: character });
    });

    socket.on('friend_event', ({ event, character }) => {
      const friendEvent = { ...event, fromFriend: true, friendName: get().friendName, timestamp: Date.now() };
      set(s => ({ friendEvents: [friendEvent, ...s.friendEvents].slice(0, 50) }));
      if (['milestone', 'good'].includes(event.type)) {
        get().addNotification({ type: 'friend', message: `${get().friendName}: ${event.message?.slice(0, 60)}` });
      }
    });

    socket.on('receive_gift', ({ amount, message, fromName }) => {
      const char = get().character;
      if (char) {
        const newChar = { ...char, finances: { ...char.finances, cash: char.finances.cash + amount } };
        set({ character: newChar });
        get().saveGame(newChar);
      }
      get().addNotification({ type: 'friend', message: `💝 ${fromName} sent you $${amount.toLocaleString()}! "${message}"` });
    });

    socket.on('receive_message', ({ text, fromName }) => {
      const msg = { text, fromName, timestamp: Date.now() };
      set(s => ({ friendMessages: [...s.friendMessages, msg].slice(-100) }));
      get().addNotification({ type: 'friend', message: `💬 ${fromName}: ${text}` });
    });
  },

  createRoom: () => {
    const socket = getSocket();
    const { character } = get();
    if (!socket?.connected || !character) return;
    socket.emit('create_room', { playerName: character.fullName, characterData: character });
  },

  joinRoom: (code) => {
    const socket = getSocket();
    const { character } = get();
    if (!socket?.connected || !character) return;
    set({ multiplayerError: null });
    socket.emit('join_room', { code, playerName: character.fullName, characterData: character });
  },

  sendGift: (amount, message) => {
    const socket = getSocket();
    const { roomCode } = get();
    if (!socket?.connected || !roomCode) return;
    const char = get().character;
    if (char.finances.cash < amount) {
      get().addNotification({ type: 'warning', message: 'Not enough cash!' });
      return;
    }
    const newChar = { ...char, finances: { ...char.finances, cash: char.finances.cash - amount } };
    set({ character: newChar });
    get().saveGame(newChar);
    socket.emit('send_gift', { amount, message });
  },

  sendMessage: (text) => {
    const socket = getSocket();
    if (!socket?.connected || !get().roomCode) return;
    const msg = { text, fromName: 'You', timestamp: Date.now(), self: true };
    set(s => ({ friendMessages: [...s.friendMessages, msg].slice(-100) }));
    socket.emit('send_message', { text });
  },

  leaveRoom: () => {
    disconnectSocket();
    set({ roomCode: null, isHost: false, friendConnected: false, friendName: null, friendCharacter: null, friendEvents: [], friendMessages: [], socketConnected: false });
  },
}));

export default useGameStore;
