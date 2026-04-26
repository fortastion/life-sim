# 🌍 LifeSim — Live Your Story

A full-featured life simulation game with real-time 2-player multiplayer.

## Quick Start (Windows)

**Double-click `START_GAME.bat`** — it installs everything and launches automatically.

---

## Manual Setup

### Requirements
- [Node.js 18+](https://nodejs.org)

### Install & Run

```bash
# 1. Install server dependencies
cd server && npm install

# 2. Install client dependencies
cd ../client && npm install

# 3. Start the server (in one terminal)
cd server && node index.js

# 4. Start the client (in another terminal)
cd client && npm run dev

# 5. Open http://localhost:5173 in your browser
```

---

## Multiplayer — How to Play With Your Friend

### Option A: Same PC (Both Playing Locally)
Both of you open `http://localhost:5173` in separate browser windows.

### Option B: LAN (Both on the Same Wi-Fi)
1. The host runs `START_GAME.bat`
2. Find your IP: open Command Prompt, run `ipconfig`, look for **IPv4 Address** (e.g., `192.168.1.5`)
3. Edit `client/.env` and set: `VITE_SERVER_URL=http://192.168.1.5:3001`
4. Restart the client (`npm run dev`)
5. Your friend opens `http://192.168.1.5:5173` in their browser
6. In-game: one person creates a room, shares the **6-letter code**, the other joins

### Option C: Internet (Free Cloud Hosting)
1. Deploy the `server/` folder to [Railway](https://railway.app) or [Render](https://render.com) (free tier)
2. Set `VITE_SERVER_URL=https://your-app.railway.app` in `client/.env`
3. Deploy the `client/` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) (free)
4. Both of you visit the deployed client URL

---

## Game Features

### Core Life Simulation
- **Birth to death** — live from age 0 to 100+
- **4 stats** — Happiness, Health, Smarts, Looks
- **Career system** — 11 career tracks, 5-6 levels each (Tech, Medicine, Law, Entertainment, Crime, and more)
- **Education** — Elementary → Middle → High School → University → Post-Grad
- **Relationships** — Partners, marriage, divorce, children, grandchildren, friends
- **18 activities** per year — Gym, Study, Party, Crime, Gambling, Travel, and more
- **80+ life events** — School, romance, tragedy, career, crime, and more
- **Choice events** — Major decisions that change your life path
- **Random events** — Lottery wins, lawsuits, accidents, inheritances
- **Health system** — Conditions, addictions, prison time
- **Death system** — Cause and age of death based on stats and choices

### Multiplayer
- **Room codes** — Share a 6-character code with your friend
- **Live event feed** — See your friend's life events in real time
- **Stats comparison** — See your stats side-by-side
- **Gift system** — Send money to help (or taunt) your friend
- **Chat system** — Message each other with taunt buttons
- **Notifications** — Pop-ups when your friend does something major

### UI
- Mobile-first design (looks like a phone app)
- Fully playable in any PC browser
- Dark theme with glowing purple/pink accents
- Smooth animations throughout
- Color-coded events (green = good, red = bad, yellow = milestone, purple = choice)

---

## File Structure

```
life-sim/
├── server/          # Node.js + Socket.io multiplayer server
│   └── index.js
├── client/          # React + Vite + Tailwind game client
│   └── src/
│       ├── engine/  # Core game logic (age up, events, careers)
│       ├── data/    # Events, careers, activities, countries data
│       ├── store/   # Zustand state + multiplayer socket logic
│       ├── pages/   # MainMenu, CharacterCreate, Game
│       └── components/tabs/  # Life, Activities, Relationships, Career, Multiplayer
├── START_GAME.bat   # Windows one-click launcher
└── README.md
```
