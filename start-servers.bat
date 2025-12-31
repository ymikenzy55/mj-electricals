@echo off
echo ========================================
echo   MJE E-Commerce Platform
echo ========================================
echo.
echo Starting servers...
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Start backend server in new window
echo Starting Backend Server on port 5000...
start "MJE Backend" cmd /k "npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server in new window
echo Starting Frontend Server on port 8000...
start "MJE Frontend" cmd /k "npx http-server frontend -p 8000 -c-1"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:8000
echo.
echo Open your browser and visit:
echo http://localhost:8000/pages/index.html
echo.
echo Default Super Admin Login:
echo Email:    superadmin@mje.com
echo Password: SuperAdmin@123
echo.
echo Press any key to open the application in your browser...
pause > nul

REM Open browser
start http://localhost:8000/pages/index.html

echo.
echo To stop servers, close the terminal windows.
echo.
