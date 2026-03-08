@echo off
title Smart Agri System - Launcher
color 0A

echo ============================================
echo      SMART AGRI SYSTEM - Quick Launcher
echo ============================================
echo.

:: ── Check Node.js is installed ──────────────────────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo         Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node -v
echo.

:: ── Check / Install SERVER dependencies ─────────────────────────────────────
echo [CHECK] Server dependencies...
if not exist "server\node_modules" (
    echo [INFO]  node_modules not found in server\ -- Installing...
    pushd server
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed in server\
        popd
        pause
        exit /b 1
    )
    popd
    echo [OK]  Server dependencies installed.
) else (
    echo [OK]  Server dependencies already installed.
)
echo.

:: ── Check / Install CLIENT dependencies ─────────────────────────────────────
echo [CHECK] Client dependencies...
if not exist "client\node_modules" (
    echo [INFO]  node_modules not found in client\ -- Installing...
    pushd client
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed in client\
        popd
        pause
        exit /b 1
    )
    popd
    echo [OK]  Client dependencies installed.
) else (
    echo [OK]  Client dependencies already installed.
)
echo.

:: ── Start Backend ────────────────────────────────────────────────────────────
echo [START] Launching Backend (port 5000)...
start "Smart Agri - Backend" cmd /k "cd /d "%~dp0server" && npm run dev"
echo [OK]  Backend window opened.
echo.

:: ── Wait a moment for backend to boot ────────────────────────────────────────
echo [WAIT]  Waiting 4 seconds for backend to initialise...
timeout /t 4 /nobreak >nul
echo.

:: ── Start Frontend ────────────────────────────────────────────────────────────
echo [START] Launching Frontend (port 5173)...
start "Smart Agri - Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"
echo [OK]  Frontend window opened.
echo.

:: ── Wait for Vite to boot then open browser ──────────────────────────────────
echo [WAIT]  Waiting 5 seconds for Vite to start...
timeout /t 5 /nobreak >nul

echo [BROWSER] Opening http://localhost:5173 ...
start "" "http://localhost:5173"

echo.
echo ============================================
echo   Both servers are running!
echo   Backend  -^> http://localhost:5000
echo   Frontend -^> http://localhost:5173
echo ============================================
echo.
echo   Close the Backend and Frontend windows to stop the servers.
echo.
pause
