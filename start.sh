#!/bin/bash

# Fuel EU Compliance Dashboard - Start Script
# This script starts both backend and frontend in separate terminal windows

echo "🚀 Starting Fuel EU Compliance Dashboard..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "❌ Backend dependencies not installed. Please run ./install.sh first."
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed. Please run ./install.sh first."
    exit 1
fi

# Function to open a new terminal and run a command
open_terminal() {
    local title=$1
    local command=$2
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell app \"Terminal\" to do script \"cd $(pwd) && $command\""
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - try different terminal emulators
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="$title" -- bash -c "$command; exec bash"
        elif command -v konsole &> /dev/null; then
            konsole --title "$title" -e bash -c "$command; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -T "$title" -e bash -c "$command; exec bash" &
        else
            echo "⚠️  No suitable terminal emulator found. Please start manually."
            echo "   $command"
            return 1
        fi
    else
        echo "⚠️  Unsupported OS. Please start manually."
        return 1
    fi
}

echo "📡 Starting Backend Server..."
open_terminal "Fuel EU Backend" "cd backend && npm run dev"
sleep 2

echo "🎨 Starting Frontend Server..."
open_terminal "Fuel EU Frontend" "cd frontend && npm run dev"
sleep 2

echo ""
echo "✅ Both servers should be starting in separate terminal windows!"
echo ""
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Open your browser to http://localhost:3000"
echo ""

