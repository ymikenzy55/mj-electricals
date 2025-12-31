@echo off
echo ========================================
echo   MJE E-Commerce - Simple Ngrok Setup
echo ========================================
echo.
echo This script will:
echo 1. Start backend on localhost:5000
echo 2. Start frontend on localhost:8000
echo 3. Create ngrok tunnel for frontend
echo.
echo NOTE: Backend will still be on localhost
echo       (Frontend will connect to localhost:5000)
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo [1/3] Starting Backend Server...
start "Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend Server...
start "Frontend" cmd /k "npx http-server frontend -p 8000 -c-1"
timeout /t 3 /nobreak > nul

echo [3/3] Starting Ngrok Tunnel...
echo.
start "Ngrok" cmd /k "ngrok http 8000"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Check the "Ngrok" window for your public URL
echo.
echo IMPORTANT STEPS:
echo 1. Look at the Ngrok window
echo 2. Find the line that says "Forwarding"
echo 3. Copy the https://xxxx.ngrok-free.app URL
echo 4. Share that URL with others
echo.
echo Example:
echo   Forwarding: https://a1b2-123-45-67-89.ngrok-free.app -^> http://localhost:8000
echo   Share: https://a1b2-123-45-67-89.ngrok-free.app/pages/index.html
echo.
echo Login Credentials:
echo   Email:    superadmin@mje.com
echo   Password: SuperAdmin@123
echo.
pause
