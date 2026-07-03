@echo off
REM ============================================================
REM  FoodieGo — Khởi động Backend nhanh
REM  Double-click file này để chạy backend
REM ============================================================

echo.
echo  ===========================================
echo   FoodieGo Backend - Khoi dong...
echo  ===========================================
echo.

REM Thêm PostgreSQL vào PATH
set PG_PATH=C:\Program Files\PostgreSQL\17\bin
if not exist "%PG_PATH%\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\16\bin
if not exist "%PG_PATH%\psql.exe" set PG_PATH=C:\Program Files\PostgreSQL\15\bin
set PATH=%PG_PATH%;%PATH%

cd /d "%~dp0backend"

echo [1/3] Kiem tra node_modules...
if not exist "node_modules\" (
    echo Dang cai packages...
    npm install
)

echo.
echo [2/3] Backend dang chay tai http://localhost:3000
echo.
echo API Endpoints:
echo   POST   http://localhost:3000/api/auth/register
echo   POST   http://localhost:3000/api/auth/login
echo   GET    http://localhost:3000/api/restaurants
echo   POST   http://localhost:3000/api/orders
echo.
echo Nhan Ctrl+C de dung.
echo.

npm run dev
