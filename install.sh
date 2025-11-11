#!/bin/bash

# Fuel EU Compliance Dashboard - Installation Script
# This script automates the setup process

set -e  # Exit on error

echo "🚀 Fuel EU Compliance Dashboard - Installation Script"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) found${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL CLI (psql) not found in PATH${NC}"
    echo "Please ensure PostgreSQL is installed and running."
else
    echo -e "${GREEN}✅ PostgreSQL found${NC}"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo ""
echo "📝 Setting up Backend Environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your PostgreSQL credentials if needed${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

echo ""
echo "🗄️  Setting up Database..."
echo "Please ensure PostgreSQL is running and the database 'fueleu_compliance' exists."
echo "If not, create it with: psql -U postgres -c 'CREATE DATABASE fueleu_compliance;'"
echo ""
read -p "Press Enter to continue with migrations or Ctrl+C to abort..."

npm run db:migrate
echo -e "${GREEN}✅ Database migrations completed${NC}"

npm run db:seed
echo -e "${GREEN}✅ Database seeded with initial data${NC}"

cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd ..

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo "=================================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "For more information, see README.md and SETUP_GUIDE.md"
echo ""

