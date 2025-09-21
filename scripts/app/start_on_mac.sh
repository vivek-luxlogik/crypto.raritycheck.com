#!/bin/bash

# Exit on error
set -e

# Function to cleanup background processes
cleanup() {
  if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null || true
  fi
  if [ ! -z "$ADMIN_FRONTEND_PID" ]; then
    kill $ADMIN_FRONTEND_PID 2>/dev/null || true
  fi
  exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

if [ -z "$ENVIRONMENT" ]; then
  ENVIRONMENT="local"
  echo "ENVIRONMENT variable not set, defaulting to 'local'"
else
  echo "Using environment: $ENVIRONMENT"
fi

# Log setup 
echo "Starting frontend setup - $(date)"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for Node.js and npm
if ! command_exists node; then
  echo "Node.js not found. Please install Node.js manually."
  echo "Visit: https://nodejs.org/"
  exit 1
else
  echo "Node.js already installed"
fi

if ! command_exists npm; then
  echo "npm not found. Please install npm manually."
  echo "Visit: https://nodejs.org/"
  exit 1
else
  echo "npm already installed"
fi


# Start the frontend locally with npm for hot reload
echo "Starting frontend locally with npm for hot reload..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

echo "Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!
cd .. 

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 5

# Check if frontend is running
echo "Checking if frontend is responding..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "Frontend started successfully with PID: $FRONTEND_PID"
else
  echo "Warning: Frontend might not be running properly"
  echo "Checking if process is still running..."
  if ps -p $FRONTEND_PID > /dev/null; then
    echo "Frontend process is running (PID: $FRONTEND_PID) but not responding to HTTP requests"
    echo "This might indicate a configuration issue or the server is still starting up"
    
    # Check what's actually using port 3000
    echo "Checking what's using port 3000:"
    lsof -i :3000 2>/dev/null || echo "Port 3000 appears to be free"
    
    # Check frontend logs
    echo "Frontend process details:"
    ps -p $FRONTEND_PID -o pid,ppid,command
  else
    echo "Frontend process is not running"
  fi
fi

# Start the admin frontend locally with npm for hot reload
echo "Starting admin frontend locally with npm for hot reload..."
cd adminFrontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing admin frontend dependencies..."
  npm install
fi

echo "Starting admin frontend dev server..."
npm run dev &
ADMIN_FRONTEND_PID=$!
cd .. 

# Wait for admin frontend to start
echo "Waiting for admin frontend to start..."
sleep 5



echo "--------------------------------" 
echo ""
echo "Frontend setup completed successfully - $(date)"
echo "🎉 Hot reload is now working!"
echo "• Frontend will auto-reload when you change React files"
echo "• Admin frontend will auto-reload when you change React files"
echo ""
echo "To stop everything: Ctrl+C"
echo ""
echo "--------------------------------" 
echo ""
echo "Frontend: http://localhost:3000" 

# Keep the script running to maintain the services
echo ""
echo "🚀 All frontend services are now running!"
echo "Press Ctrl+C to stop everything and exit"
echo ""

# Wait for user to stop the script
wait