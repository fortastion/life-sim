import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  createCharacter, processAgeUp, applyChoice, applyActivity,
  applyForJob, workHard, slackOff, askForRaise,
  spendTimeWithPartner, proposeToPartner, breakUpWithPartner, hangOutWithFriend,
} from '../engine/gameEngine';
import { connectSocket, disconnectSocket, getSocket } from '../socket';

const SAVE_KEY = 'lifesim_save';

// Map recent history events → animation scene key
function detectAnimationScene(recentHistory) {
  for (const h of [...(recentHistory || [])].reverse().slice(0, 6)) {
    if (!h) continue;
    const msg = (h.message || '').toLowerCase();
    if (h.icon === '💍' && (msg.includes('engaged') || msg.includes('proposed'))) return 'proposal';
    if (msg.includes('married') || msg.includes('wedding'))     return 'wedding';
    if (h.icon === '📦' && msg.includes('fired'))               return 'fired';
    if (h.icon === '📦' && msg.includes('laid off'))            return 'fired';
    if (h.icon === '📈' && msg.includes('promoted'))            return 'promoted';
    if (h.icon === '💼' && msg.includes('hired'))               return 'hired';
    if (h.icon === '🎓' && msg.includes('graduated'))          return 'graduated';
    if (h.icon === '🍼')                                         return 'baby';
    if (msg.includes('arrested') || msg.includes('prison') || h.icon === '⛓️') return 'arrested';
    if (h.icon === '🎰' && h.type === 'good')                   return 'lottery';
    if (msg.includes('bankrupt'))                               return 'bankrupt';
    if (msg.includes('heartbreak') || (h.icon === '💔' && h.type === 'bad' && msg.includes('divorce'))) return 'heartbreak';
  }
  return null;
}

const useGameStore = create((set, get) => ({
  // ── Game State ─────────────────────────────────────────────────────────────
  phase:          'menu', // menu | create | playing | dead
  character:      null,
  pendingChoices: [],
  notifications:  [],
  activeTab:      'life',
  lastEventScene: null,    // triggers pixel-art animation in Game.jsx

  // ── Multiplayer ────────────────────────────────────────────────────────────
  roomCode:       null,
  isHost:         false,
  friendConnected: false,
  friendName:     null,
  friendCharacter: null,
  friendEvents:   [],
  friendMessages: [],
  multiplayerError: null,
  socketConnected: false,

  // ── Core Actions ───────────────────────────────────────────────────────────
  setPhase:    (phase) => set({ phase }),
  setActiveTab: (tab)  => set({ activeTab: tab }),

  startNewGame: (config) => {
    const char = createCharacter(config);
    set({ character: char, phase: 'playing', pendingChoices: [], activeTab: 'life', lastEventScene: null });
    get().saveGame(char);

    // Broadcast new character to multiplayer friend
    const socket = getSocket();
    if (socket?.connected && get().roomCode) {
      socket.emit('update_character', { characterData: char });
    }
  },

  ageUp: () => {
    const { character, pendingChoices } = get();
    if (!character || !character.alive) return;
    if (pendingChoices.length > 0) {
      get().addNotification({ type: 'warning', message: 'Resolve your pending choices first!' });
      return;
    }

    const { character: newChar, choiceEvents, died } = processAgeUp(character);

    // Determine animation scene from new history
    const newHistory = (newChar.history || []).slice(-(died ? 3 : 8));
    const scene = died ? 'died' : detectAnimationScene(newHistory);

    set({ character: newChar, pendingChoices: choiceEvents || [], lastEventScene: scene });

    if (died) {
      set({ phase: 'dead' });
      get().addNotification({ type: 'bad', message: `You died at age ${newChar.age} from ${newChar.deathCause}.` });
    } else {
      get().addNotification({ type: 'neutral', message: `You are now ${newChar.age} years old!` });
    }

    // Broadcast to multiplayer friend
    const socket = getSocket();
    if (socket?.connected && get().roomCode) {
      const recentEvents = (newChar.history || []).slice(-5);
      recentEvents.forEach(evt => {
        socket.emit('broadcast_event', {
          event: evt,
          characterSnapshot: { name: newChar.fullName, age: newChar.age, stats: newChar.stats },
        });
      });
      socket.emit('update_character', { characterData: newChar });
    }

    get().saveGame(newChar);
  },

  clearLastScene: () => set({ lastEventScene: null }),

  makeChoice: (eventId, choiceIndex) => {
    try {
      const { character, pendingChoices } = get();
      if (!character) return;

      const newChar  = applyChoice({ ...character, pendingChoices }, eventId, choiceIndex);
      const newPending = (pendingChoices || []).filter(e => e.id !== eventId);
      set({ character: newChar, pendingChoices: newPending });

      // Broadcast
      const socket = getSocket();
      if (socket?.connected && get().roomCode) {
        const event = (pendingChoices || []).find(e => e.id === eventId);
        if (event) {
          socket.emit('broadcast_event', {
            event: { ...event, choiceMade: event.choices?.[choiceIndex]?.text },
            characterSnapshot: { name: newChar.fullName, age: newChar.age },
          });
        }
      }
      get().saveGame(newChar);
    } catch (err) {
      console.error('makeChoice error:', err);
    }
  },

  doActivity: (activity) => {
    const { character } = get();
    if (!character) return { result: 'error' };
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
    if (!character) return;
    const result = applyForJob(character, track);
    set({ character: result.character });
    if (result.result === 'success') {
      set({ lastEventScene: 'hired' });
    }
    get().addNotification({ type: result.result === 'success' ? 'good' : 'bad', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  // ── Career Actions ─────────────────────────────────────────────────────────
  workHard: () => {
    const { character } = get();
    if (!character) return;
    const result = workHard(character);
    set({ character: result.character });
    if (result.result === 'bonus') {
      set({ lastEventScene: 'promoted' });
    }
    get().addNotification({ type: result.result === 'fired' ? 'bad' : 'good', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  slackOff: () => {
    const { character } = get();
    if (!character) return;
    const result = slackOff(character);
    set({ character: result.character });
    if (result.result === 'fired') {
      set({ lastEventScene: 'fired' });
    }
    get().addNotification({ type: result.result === 'fired' ? 'bad' : 'warning', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  askForRaise: () => {
    const { character } = get();
    if (!character) return;
    const result = askForRaise(character);
    set({ character: result.character });
    get().addNotification({ type: result.result === 'success' ? 'good' : result.result.startsWith('denied') ? 'warning' : 'bad', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  // ── Relationship Actions ───────────────────────────────────────────────────
  spendTimeWithPartner: () => {
    const { character } = get();
    if (!character) return;
    const result = spendTimeWithPartner(character);
    set({ character: result.character });
    get().addNotification({ type: result.result === 'success' ? 'good' : 'warning', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  proposeToPartner: () => {
    const { character } = get();
    if (!character) return;
    const result = proposeToPartner(character);
    set({ character: result.character });
    if (result.result === 'accepted') {
      set({ lastEventScene: 'proposal' });
    }
    get().addNotification({ type: result.result === 'accepted' ? 'good' : 'bad', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  breakUpWithPartner: () => {
    const { character } = get();
    if (!character) return;
    const result = breakUpWithPartner(character);
    set({ character: result.character });
    if (result.result === 'success') {
      set({ lastEventScene: 'heartbreak' });
    }
    get().addNotification({ type: 'bad', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  hangOutWithFriend: (friendIndex) => {
    const { character } = get();
    if (!character) return;
    const result = hangOutWithFriend(character, friendIndex);
    set({ character: result.character });
    get().addNotification({ type: result.result === 'success' ? 'good' : 'warning', message: result.message });
    get().saveGame(result.character);
    return result;
  },

  // ── Asset Actions ──────────────────────────────────────────────────────────
  buyAsset: (item) => {
    const { character } = get();
    if (!character) return;
    if (character.finances.cash < item.price) {
      get().addNotification({ type: 'warning', message: "You can't afford that!" });
      return;
    }
    const char = JSON.parse(JSON.stringify(character));
    char.finances.cash -= item.price;

    const newAsset = {
      id:            uuidv4(),
      assetId:       item.id,
      name:          item.name,
      icon:          item.icon,
      category:      item.category,
      purchasePrice: item.price,
      currentValue:  item.price,
      monthlyIncome: item.monthlyIncome || 0,
      volatility:    item.volatility || 0,
      yearPurchased: char.age,
    };

    if (!char.assets) char.assets = [];
    char.assets.push(newAsset);
    char.finances.netWorth = char.finances.cash + char.finances.bankBalance
      + char.assets.reduce((s, a) => s + a.currentValue, 0)
      - char.finances.debt;

    set({ character: char });
    get().addNotification({ type: 'good', message: `You bought a ${item.name}!` });
    get().saveGame(char);
  },

  sellAsset: (assetId) => {
    const { character } = get();
    if (!character) return;
    const char  = JSON.parse(JSON.stringify(character));
    const asset = (char.assets || []).find(a => a.id === assetId);
    if (!asset) return;

    char.finances.cash += asset.currentValue;
    char.assets = char.assets.filter(a => a.id !== assetId);
    char.finances.netWorth = char.finances.cash + char.finances.bankBalance
      + char.assets.reduce((s, a) => s + a.currentValue, 0)
      - char.finances.debt;

    set({ character: char });
    get().addNotification({ type: 'good', message: `Sold ${asset.name} for $${asset.currentValue.toLocaleString()}!` });
    get().saveGame(char);
  },

  // ── Notifications ──────────────────────────────────────────────────────────
  addNotification: (notif) => {
    const id = Date.now() + Math.random();
    set(s => ({ notifications: [...s.notifications, { id, ...notif }] }));
    setTimeout(() => set(s => ({ notifications: s.notifications.filter(n => n.id !== id) })), 3500);
  },

  // ── Save / Load ────────────────────────────────────────────────────────────
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
      // Patch missing fields from old saves
      if (!char.assets) char.assets = [];
      if (!char.health) char.health = { conditions: [], addictions: [], inPrison: false, prisonYearsLeft: 0 };
      if (!char.relationships) char.relationships = { partner: null, married: false, engaged: false, exPartners: [], children: [], friends: [], enemies: [] };
      set({ character: char, phase: char.alive ? 'playing' : 'dead', pendingChoices: [], lastEventScene: null });
      return true;
    } catch (_) { return false; }
  },

  clearSave: () => {
    localStorage.removeItem(SAVE_KEY);
    set({ character: null, phase: 'menu', pendingChoices: [], lastEventScene: null });
  },

  hasSave: () => !!localStorage.getItem(SAVE_KEY),

  // ── Multiplayer ────────────────────────────────────────────────────────────
  connectMultiplayer: () => {
    const socket = connectSocket();
    set({ socketConnected: socket.connected });

    socket.on('connect', () => set({ socketConnected: true, multiplayerError: null }));
    socket.on('disconnect', () => set({ socketConnected: false, friendConnected: false }));
    socket.on('connect_error', () => set({ multiplayerError: "Cannot connect to server." }));

    socket.on('room_created', ({ code }) => set({ roomCode: code, isHost: true }));

    socket.on('room_joined', ({ code, friendData }) => set({
      roomCode: code, isHost: false,
      friendConnected: true,
      friendName: friendData?.name,
      friendCharacter: friendData?.character,
    }));

    socket.on('join_error', ({ message }) => set({ multiplayerError: message }));

    socket.on('friend_joined', ({ friendName, character }) => {
      set({ friendConnected: true, friendName, friendCharacter: character });
      get().addNotification({ type: 'friend', message: `🎮 ${friendName} joined your game!` });
    });

    socket.on('friend_disconnected', () => {
      set({ friendConnected: false, friendName: null });
      get().addNotification({ type: 'warning', message: 'Your friend disconnected.' });
    });

    socket.on('friend_character_updated', ({ character }) => {
      // This fires whenever friend ages up OR creates a new character
      set({ friendCharacter: character });
    });

    socket.on('friend_event', ({ event }) => {
      const friendEvent = { ...event, fromFriend: true, friendName: get().friendName, timestamp: Date.now() };
      set(s => ({ friendEvents: [friendEvent, ...s.friendEvents].slice(0, 50) }));
      if (['milestone', 'good'].includes(event.type)) {
        get().addNotification({ type: 'friend', message: `${get().friendName}: ${(event.message || '').slice(0, 60)}` });
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
    if (!char || char.finances.cash < amount) {
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
    set({
      roomCode: null, isHost: false,
      friendConnected: false, friendName: null, friendCharacter: null,
      friendEvents: [], friendMessages: [], socketConnected: false,
    });
  },
}));

export default useGameStore;
