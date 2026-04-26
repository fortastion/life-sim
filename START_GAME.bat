@echo off
title LifeSim Launcher
color 0D
echo.
echo  ==========================================
echo   LIFESIM - Starting Game Server and Client
echo  ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed!
    echo  Download it from https://nodejs.org
    pause
    exit /b 1
)

echo  [1/3] Installing server dependencies...
cd /d "%~dp0server"
if not exist node_modules (
    call npm install
)

echo  [2/3] Installing client dependencies...
cd /d "%~dp0client"
if not exist node_modules (
    call npm install
)

echo  [3/3] Starting server and client...
echo.
echo  >> Server will run on: http://localhost:3001
echo  >> Game will open at:  http://localhost:5173
echo.
echo  Share your local IP with your friend for LAN multiplayer!
echo  (Find it with: ipconfig | find "IPv4")
echo.

REM Start server in a new window
cd /d "%~dp0server"
start "LifeSim Server" cmd /k "node index.js"

REM Wait a moment then start client
timeout /t 2 /nobreak >nul
cd /d "%~dp0client"
start "LifeSim Client" cmd /k "npm run dev"

REM Open browser
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo  Game is launching in your browser...
echo  Close both terminal windows to stop the game.
echo.
pause
