@echo off
TITLE AgriSmart System Launcher
CLS

ECHO =====================================================
ECHO           AgriSmart System Launcher
ECHO =====================================================
ECHO.

:: 1. Check Node.js Installation
ECHO [1/5] Checking Node.js installation...
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO.
    ECHO [ERROR] Node.js is NOT installed!
    ECHO Please download and install it from: https://nodejs.org/
    ECHO.
    PAUSE
    EXIT
)
ECHO Node.js is installed.
node -v
ECHO.

:: 2. Setup Server
ECHO [2/5] Setting up Server...
CD server
IF NOT EXIST "node_modules" (
    ECHO Installing Server Dependencies...
    call npm install
) ELSE (
    ECHO Server dependencies found. Skipping install.
)

:: 3. Start Server
ECHO [3/5] Starting Backend Server...
start "AgriSmart Backend" npm run dev

:: 4. Setup Client
ECHO [4/5] Setting up Client...
CD ../client
IF NOT EXIST "node_modules" (
    ECHO Installing Client Dependencies...
    call npm install
) ELSE (
    ECHO Client dependencies found. Skipping install.
)

:: 5. Start Client
ECHO [5/5] Starting Frontend Client...
start "AgriSmart Frontend" npm run dev

ECHO.
ECHO =====================================================
ECHO           System Started Successfully!
ECHO =====================================================
ECHO Backend running on Port 5000
ECHO Frontend running on Port 5173
ECHO.
PAUSE
