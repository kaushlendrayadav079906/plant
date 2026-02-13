@echo off
cd /d "%~dp0"

echo [Plant App] Activating virtual environment...
if exist venv\Scripts\activate (
    call venv\Scripts\activate
) else (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    call venv\Scripts\activate
)

echo [Plant App] Checking dependencies...
pip install -r requirements.txt

echo.
echo [Plant App] Running diagnosis...
python check_setup.py
echo.

echo [Plant App] Starting FastAPI Backend...
python main.py

echo.
echo [Plant App] Server stopped.
pause
