@echo off
cd /d "%~dp0\frontend"

echo [Plant App] Installing Frontend Dependencies (this might take a moment)...
call npm install

echo.
echo [Plant App] Starting Frontend Development Server...
echo Please ensure you have closed any other terminal windows running the frontend!
echo.
npm run dev

pause
