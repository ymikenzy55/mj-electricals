@echo off
echo ========================================
echo   MJE E-Commerce Platform with Ngrok
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if ngrok is available
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if not exist "ngrok.exe" (
        echo.
        echo ERROR: Ngrok not found!
        echo.
        echo Please install ngrok:
        echo 1. Download from https://ngrok.com/download
        echo 2. Extract ngrok.exe to this folder
        echo 3. Run: ngrok config add-authtoken YOUR_TOKEN
        echo.
        echo See NGROK_SETUP.md for detailed instructions.
        echo.
        pause
        exit /b 1
    )
)

echo Starting Backend Server on port 5000...
start "MJE Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server on port 8000...
start "MJE Frontend" cmd /k "npx http-server frontend -p 8000 -c-1"

timeout /t 3 /nobreak > nul

echo.
echo Starting Ngrok tunnel for Frontend (port 8000)...
echo.
start "MJE Ngrok" cmd /k "ngrok http 8000 --log=stdout"

timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Local Access:
echo   Backend API:  http://localhost:5000
echo   Frontend:     http://localhost:8000
echo.
echo Public Access (Ngrok):
echo   Check the "MJE Ngrok" window for your public URL
echo   It will look like: https://xxxx-xx-xx-xx-xx.ngrok-free.app
echo.
echo IMPORTANT:
echo   1. Copy the ngrok URL from the Ngrok window
echo   2. Share it with others to let them access your site
echo   3. Users may see a warning page - they should click "Visit Site"
echo   4. The URL changes each time you restart ngrok (free tier)
echo.
echo Default Super Admin Login:
echo   Email:    superadmin@mje.com
echo   Password: SuperAdmin@123
echo.
echo To stop all servers, close all terminal windows.
echo.
pause
