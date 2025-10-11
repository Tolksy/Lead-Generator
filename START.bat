@echo off
echo ========================================
echo  Graphic Design Studio - Startup
echo ========================================
echo.

echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    call npm install
    cd ..
)

if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)

echo.
echo ========================================
echo  Starting servers...
echo ========================================
echo.
echo Backend server will run on: http://localhost:5000
echo Frontend app will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3
start "Frontend App" cmd /k "cd client && npm start"

echo.
echo Servers are starting in separate windows...
echo You can close this window.
echo.
pause

