#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status during setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=============================================="
echo "   Portfolio 2.0 (MERN Application) Launcher  "
echo "=============================================="

# Check node & npm installation
if ! command -v node &> /dev/null; then
    echo "[Error] Node.js is not installed or not in PATH."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "[Error] npm is not installed or not in PATH."
    exit 1
fi

# Install dependencies if node_modules missing
if [ ! -d "server/node_modules" ]; then
    echo "[!] Installing server dependencies..."
    (cd server && npm install)
fi

if [ ! -d "client/node_modules" ]; then
    echo "[!] Installing client dependencies..."
    (cd client && npm install)
fi

# Function to clean up child processes on exit
cleanup() {
    echo ""
    echo "[!] Stopping frontend and backend servers..."
    if [ -n "$SERVER_PID" ]; then
        kill "$SERVER_PID" 2>/dev/null || true
    fi
    if [ -n "$CLIENT_PID" ]; then
        kill "$CLIENT_PID" 2>/dev/null || true
    fi
    echo "[+] Done. All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo "[+] Starting backend server (http://localhost:3000)..."
(cd server && npm run dev) &
SERVER_PID=$!

echo "[+] Starting frontend client (http://localhost:5173)..."
(cd client && npm run dev) &
CLIENT_PID=$!

echo ""
echo "[+] Backend Server PID: $SERVER_PID"
echo "[+] Frontend Client PID: $CLIENT_PID"
echo ""
echo "Press Ctrl+C to stop all servers."
echo "=============================================="

# Keep script running and wait for child processes
wait
