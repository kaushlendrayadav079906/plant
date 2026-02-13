@echo off
cd /d "%~dp0"
echo [Plant App] Reading server logs...
python read_logs.py
echo.
pause
