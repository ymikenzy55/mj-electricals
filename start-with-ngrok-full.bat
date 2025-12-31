@echo off
echo ========================================
echo   MJE E-Commerce - Full Ngrok Setup
echo ========================================
echo.
echo WARNING: This requires ngrok paid plan or two separate ngrok accounts
echo          Free tier only allows 1 tunnel at a time
echo.
echo This will tunnel BOTH frontend and backend
echo.
pause

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo [1/4] Starting Backend Server...
start "Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [2/4] Starting Frontend Server...
start "Frontend" cmd /k "npx http-server frontend -p 8000 -c-1"
timeout /t 3 /nobreak > nul

echo [3/4] Starting Ngrok for Backend (port 5000)...
start "Ngrok Backend" cmd /k "ngrok http 5000"
timeout /t 5 /nobreak > nul

echo [4/4] Starting Ngrok for Frontend (port 8000)...
start "Ngrok Frontend" cmd /k "ngrok http 8000"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo IMPORTANT: You need to update the API URL
echo.
echo 1. Check "Ngrok Backend" window for backend URL
echo 2. Check "Ngrok Frontend" window for frontend URL
echo 3. Update frontend/js/api.js with the backend ngrok URL
echo.
echo Example:
echo   Backend URL:  https://abc123.ngrok-free.app
echo   Frontend URL: https://xyz789.ngrok-free.app
echo.
echo Share the Frontend URL with others!
echo.
pause
