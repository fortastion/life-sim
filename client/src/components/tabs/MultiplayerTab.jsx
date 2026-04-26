import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import EventCard from '../EventCard';
import { getMoodEmoji, getAgeEmoji, formatMoney } from '../../engine/gameEngine';

export default function MultiplayerTab() {
  const {
    character, roomCode, isHost, friendConnected, friendName, friendCharacter,
    friendEvents, friendMessages, multiplayerError, socketConnected,
    connectMultiplayer, createRoom, joinRoom, sendGift, sendMessage, leaveRoom
  } = useGameStore();

  const [joinCode, setJoinCode] = useState('');
  const [messageText, setMessageText] = useState('');
  const [giftAmount, setGiftAmount] = useState(100);
  const [activeView, setActiveView] = useState('stats'); // stats | events | chat
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socketConnected) connectMultiplayer();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [friendMessages]);

  if (!character) return null;

  function copyCode() {
    navigator.clipboard?.writeText(roomCode).catch(() => {});
  }

  const friendAvatar = friendCharacter ? getAgeEmoji(friendCharacter.age, friendCharacter.gender) : '👤';
  const friendMood = friendCharacter ? getMoodEmoji(friendCharacter.stats?.happiness || 50) : '';

  // ── Not connected to server ──────────────────────────────────────────────
  if (!socketConnected && !roomCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
        <span className="text-5xl">🔌</span>
        <h3 className="font-bold text-white text-lg">Connecting to Server…</h3>
        <p className="text-slate-500 text-sm text-center">
          Make sure the server is running on port 3001, or update the server URL in <code className="text-purple-400">client/.env</code>.
        </p>
        {multiplayerError && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-300 text-sm text-center">
            {multiplayerError}
          </div>
        )}
        <button onClick={connectMultiplayer} className="ageup-btn px-6 py-3 rounded-xl text-white font-bold">
          🔄 Retry
        </button>
      </div>
    );
  }

  // ── No room yet ──────────────────────────────────────────────────────────
  if (!roomCode) {
    return (
      <div className="flex flex-col h-full overflow-y-auto px-4 pt-4 pb-8 gap-4">
        <h2 className="font-bold text-white text-base">👥 Play with a Friend</h2>
        <p className="text-slate-400 text-sm">
          Connect with one friend. Share a room code and see each other's lives unfold in real time!
        </p>

        {multiplayerError && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-300 text-sm">
            ⚠️ {multiplayerError}
          </div>
        )}

        <div className="bg-bg-card rounded-2xl p-4 border border-bg-border">
          <h3 className="font-semibold text-white mb-1">🏠 Host a Game</h3>
          <p className="text-xs text-slate-500 mb-3">Create a room and share the code with your friend.</p>
          <button onClick={createRoom} className="ageup-btn w-full py-3 rounded-xl text-white font-bold">
            Create Room
          </button>
        </div>

        <div className="bg-bg-card rounded-2xl p-4 border border-bg-border">
          <h3 className="font-semibold text-white mb-1">🔗 Join a Game</h3>
          <p className="text-xs text-slate-500 mb-3">Enter the code your friend shared with you.</p>
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character code"
            maxLength={6}
            className="mb-2 text-center text-lg tracking-widest font-bold uppercase"
          />
          <button
            onClick={() => joinCode.length === 6 && joinRoom(joinCode)}
            disabled={joinCode.length !== 6}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold tap-effect disabled:opacity-40"
          >
            Join Room
          </button>
        </div>

        <div className="bg-bg-card rounded-xl p-3 border border-bg-border text-xs text-slate-500">
          <p className="font-semibold text-slate-400 mb-1">How Multiplayer Works:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Both of you play your own separate lives</li>
            <li>See your friend's events as they happen in real time</li>
            <li>React to their life decisions and send gifts</li>
            <li>Chat and taunt each other along the way</li>
          </ul>
        </div>
      </div>
    );
  }

  // ── In a room, waiting for friend ────────────────────────────────────────
  if (!friendConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
        <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-5xl">🎮</motion.span>
        <h3 className="font-bold text-white text-lg">Waiting for Friend…</h3>
        <div className="bg-bg-card rounded-2xl p-4 border border-purple-600/40 w-full max-w-xs text-center">
          <p className="text-xs text-slate-400 mb-2">Room Code</p>
          <div className="text-4xl font-black tracking-widest text-purple-300 mb-3">{roomCode}</div>
          <button onClick={copyCode} className="text-xs text-slate-400 tap-effect bg-bg-secondary px-4 py-2 rounded-lg border border-bg-border">
            📋 Copy Code
          </button>
        </div>
        <p className="text-slate-500 text-sm text-center">Share this code with your friend so they can join!</p>
        <button onClick={leaveRoom} className="text-red-400 text-sm tap-effect">Leave Room</button>
      </div>
    );
  }

  // ── Both connected ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Friend header */}
      <div className="px-4 pt-3 pb-2">
        <div className="bg-bg-card rounded-2xl p-3 border border-green-800/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-bg-border flex items-center justify-center text-3xl flex-shrink-0">
              {friendAvatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{friendName}</span>
                <span>{friendMood}</span>
                <span className="w-2 h-2 rounded-full bg-green-400 ml-1" />
              </div>
              {friendCharacter && (
                <div className="text-xs text-slate-400">
                  Age {friendCharacter.age} · {friendCharacter.country}
                  {friendCharacter.career?.employed && ` · ${friendCharacter.career.title}`}
                </div>
              )}
            </div>
            <button onClick={leaveRoom} className="text-slate-500 text-xs tap-effect">Leave</button>
          </div>

          {/* Friend stats preview */}
          {friendCharacter?.stats && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[
                { key: 'happiness', icon: '😊', color: '#f59e0b' },
                { key: 'health', icon: '❤️', color: '#ef4444' },
                { key: 'smarts', icon: '🧠', color: '#3b82f6' },
                { key: 'looks', icon: '✨', color: '#a855f7' },
              ].map(({ key, icon, color }) => (
                <div key={key} className="text-center">
                  <div className="text-sm">{icon}</div>
                  <div className="h-1.5 bg-bg-border rounded-full my-1">
                    <div className="h-full rounded-full" style={{ width: `${friendCharacter.stats[key]}%`, background: color }} />
                  </div>
                  <div className="text-xs text-slate-500">{Math.round(friendCharacter.stats[key])}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View tabs */}
      <div className="flex px-4 gap-2 mb-2">
        {[['stats', '📊 Stats'], ['events', '📰 Events'], ['chat', '💬 Chat']].map(([v, label]) => (
          <button key={v} onClick={() => setActiveView(v)} className={`flex-1 py-2 rounded-xl text-xs font-semibold tap-effect ${activeView === v ? 'bg-purple-600 text-white' : 'bg-bg-card text-slate-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">

        {/* Stats view */}
        {activeView === 'stats' && friendCharacter && (
          <div className="space-y-3">
            {/* Send gift */}
            <div className="bg-bg-card rounded-xl p-3 border border-bg-border">
              <h4 className="text-xs text-slate-400 font-semibold mb-2">💝 Send Gift to {friendName}</h4>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={giftAmount}
                  onChange={e => setGiftAmount(Math.max(1, parseInt(e.target.value) || 0))}
                  className="flex-1 text-center"
                  style={{ borderRadius: '10px' }}
                />
                <button
                  onClick={() => sendGift(giftAmount, 'Here\'s a gift!')}
                  className="bg-purple-600 text-white font-bold py-2 px-4 rounded-xl tap-effect text-sm"
                >
                  Send ${giftAmount}
                </button>
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-bg-card rounded-xl p-3 border border-bg-border">
              <h4 className="text-xs text-slate-400 font-semibold mb-3">📊 Life Comparison</h4>
              {[
                { label: 'Age', mine: character.age, theirs: friendCharacter.age },
                { label: 'Happiness', mine: Math.round(character.stats.happiness), theirs: Math.round(friendCharacter.stats?.happiness || 0) },
                { label: 'Health', mine: Math.round(character.stats.health), theirs: Math.round(friendCharacter.stats?.health || 0) },
                { label: 'Smarts', mine: Math.round(character.stats.smarts), theirs: Math.round(friendCharacter.stats?.smarts || 0) },
                { label: 'Net Worth', mine: character.finances.netWorth, theirs: friendCharacter.finances?.netWorth || 0, isMoney: true },
              ].map(({ label, mine, theirs, isMoney }) => (
                <div key={label} className="flex items-center mb-2">
                  <div className="w-20 text-right text-xs font-bold text-purple-300">
                    {isMoney ? formatMoney(mine, character.currency) : mine}
                  </div>
                  <div className="flex-1 mx-2 text-center text-xs text-slate-500">{label}</div>
                  <div className="w-20 text-left text-xs font-bold text-cyan-300">
                    {isMoney ? formatMoney(theirs, friendCharacter.currency || '$') : theirs}
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xs text-slate-600 mt-1 px-1">
                <span>You</span><span>{friendName}</span>
              </div>
            </div>
          </div>
        )}

        {/* Events view */}
        {activeView === 'events' && (
          <div>
            {friendEvents.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                <span className="text-3xl block mb-2">📭</span>
                Waiting for {friendName} to age up…
              </div>
            ) : (
              friendEvents.map((event, i) => <EventCard key={event.id || i} event={event} index={i} />)
            )}
          </div>
        )}

        {/* Chat view */}
        {activeView === 'chat' && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 min-h-40 max-h-60 overflow-y-auto bg-bg-secondary rounded-xl p-3 border border-bg-border">
              {friendMessages.length === 0 && (
                <p className="text-slate-500 text-xs text-center py-4">Say something to {friendName}!</p>
              )}
              {friendMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${msg.self ? 'bg-purple-600 text-white' : 'bg-bg-card text-slate-200'}`}>
                    {!msg.self && <span className="text-xs text-slate-400 block mb-0.5">{msg.fromName}</span>}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Taunt buttons */}
            <div className="flex gap-2 flex-wrap">
              {['💀 You\'re gonna die soon!', '😂 Your life sucks!', '🏆 I\'m winning at life!', '💸 Send me money!'].map(t => (
                <button key={t} onClick={() => sendMessage(t)} className="text-xs bg-bg-card border border-bg-border px-2 py-1.5 rounded-lg text-slate-400 tap-effect">
                  {t}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && messageText.trim()) { sendMessage(messageText.trim()); setMessageText(''); } }}
                placeholder="Type a message…"
                className="flex-1"
              />
              <button
                onClick={() => { if (messageText.trim()) { sendMessage(messageText.trim()); setMessageText(''); } }}
                className="bg-purple-600 text-white px-4 rounded-xl tap-effect font-bold"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
