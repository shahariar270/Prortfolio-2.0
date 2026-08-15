@echo off
echo ==============================================
echo    Portfolio 2.0 (MERN Application) Launcher  
echo ==============================================

IF NOT EXIST "server\node_modules" (
    echo [!] Installing server dependencies...
    cd server && call npm install && cd ..
)

IF NOT EXIST "client\node_modules" (
    echo [!] Installing client dependencies...
    cd client && call npm install && cd ..
)

echo [+] Starting backend server on http://localhost:3000...
start "Backend Server" cmd /k "cd server && npm run dev"

echo [+] Starting frontend client on http://localhost:5173...
start "Frontend Client" cmd /k "cd client && npm run dev"

echo ==============================================
echo [+] Server and Client launched in separate windows!
echo ==============================================
