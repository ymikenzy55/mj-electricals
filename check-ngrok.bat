@echo off
echo ========================================
echo   Ngrok Setup Checker
echo ========================================
echo.

REM Check if ngrok is in PATH
where ngrok >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Ngrok found in PATH
    ngrok version
    echo.
    goto :check_config
) else (
    echo [!] Ngrok not found in PATH
)

REM Check if ngrok.exe exists in current directory
if exist "ngrok.exe" (
    echo [OK] ngrok.exe found in current directory
    ngrok.exe version
    echo.
    goto :check_config
) else (
    echo [X] ngrok.exe not found in current directory
    echo.
    echo Please install ngrok:
    echo 1. Download from https://ngrok.com/download
    echo 2. Extract ngrok.exe to this folder
    echo 3. Or install globally: npm install -g ngrok
    echo.
    goto :end
)

:check_config
echo Checking ngrok configuration...
echo.

REM Try to get ngrok config
ngrok config check >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Ngrok configuration is valid
    echo.
) else (
    echo [!] Ngrok configuration may need setup
    echo.
    echo If you haven't set up your authtoken:
    echo 1. Sign up at https://dashboard.ngrok.com/signup
    echo 2. Get token from https://dashboard.ngrok.com/get-started/your-authtoken
    echo 3. Run: ngrok config add-authtoken YOUR_TOKEN
    echo.
)

echo ========================================
echo   Ready to Start!
echo ========================================
echo.
echo Run one of these scripts:
echo   start-with-ngrok-simple.bat  (Recommended)
echo   start-with-ngrok-full.bat    (Requires paid plan)
echo.
echo For help, see:
echo   NGROK_QUICK_START.md
echo   NGROK_SETUP.md
echo.

:end
pause
