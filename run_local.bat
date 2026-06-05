@echo off
echo ===================================================
echo   Starting Password Strength Analyzer Local Stack
echo ===================================================

echo [1/2] Starting Backend FastAPI Server...
start "Backend (FastAPI)" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

echo [2/2] Starting Frontend Vite Server...
start "Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo Done! Two terminal windows have been launched.
echo Backend is running at: http://localhost:8000
echo Frontend is running at: http://localhost:5173
echo ===================================================
