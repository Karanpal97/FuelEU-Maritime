#!/bin/bash

# Fuel EU Compliance Dashboard - Fixed Installation Script
# This script automates the setup process

set -e  # Exit on error

echo "🚀 Fuel EU Compliance Dashboard - Installation Script"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed.${NC}"
    echo "Please install Node.js 18+ first:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) found${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed.${NC}"
    echo ""
    echo "Please install PostgreSQL first:"
    echo "  sudo apt update"
    echo "  sudo apt install postgresql postgresql-contrib -y"
    echo "  sudo systemctl start postgresql"
    echo ""
    echo "See INSTALL_POSTGRES.md for detailed instructions."
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL found${NC}"

# Check if PostgreSQL is running
if ! sudo systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting it...${NC}"
    sudo systemctl start postgresql
    sleep 2
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Step 1: Creating PostgreSQL Database${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Check if database exists
DB_EXISTS=$(psql -U postgres -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='fueleu_compliance'" 2>/dev/null || echo "")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}⚠️  Database 'fueleu_compliance' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping database..."
        psql -U postgres -h localhost -c "DROP DATABASE fueleu_compliance;"
        echo "Creating database..."
        psql -U postgres -h localhost -c "CREATE DATABASE fueleu_compliance;"
        echo -e "${GREEN}✅ Database recreated${NC}"
    fi
else
    echo "Creating database..."
    psql -U postgres -h localhost -c "CREATE DATABASE fueleu_compliance;" 2>&1
    echo -e "${GREEN}✅ Database created${NC}"
fi

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Step 2: Installing Backend Dependencies${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

cd backend

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules already exists, skipping install${NC}"
else
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Step 3: Setting up Backend Environment${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Create .env.example if it doesn't exist
if [ ! -f .env.example ]; then
    echo "Creating .env.example..."
    cat > .env.example << 'ENVEOF'
PORT=3001
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_compliance
DB_USER=postgres
DB_PASSWORD=postgres
ENVEOF
    echo -e "${GREEN}✅ Created .env.example${NC}"
fi

# Create .env from .env.example
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Step 4: Running Database Migrations${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

npm run db:migrate
echo -e "${GREEN}✅ Database migrations completed${NC}"

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Step 5: Seeding Database${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

npm run db:seed
echo -e "${GREEN}✅ Database seeded with initial data (5 routes)${NC}"

cd ..

echo ""
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}Step 6: Installing Frontend Dependencies${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

cd frontend

if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules already exists, skipping install${NC}"
else
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo -e "${GREEN}=================================================${NC}"
echo ""
echo "To start the application:"
echo ""
echo -e "${BLUE}Terminal 1 - Backend:${NC}"
echo "   cd /home/karan/project/newclgprj/backend"
echo "   npm run dev"
echo ""
echo -e "${BLUE}Terminal 2 - Frontend:${NC}"
echo "   cd /home/karan/project/newclgprj/frontend"
echo "   npm run dev"
echo ""
echo -e "${BLUE}Browser:${NC}"
echo "   http://localhost:3000"
echo ""
echo "For detailed instructions, see:"
echo "  - COMPLETE_SETUP.md (step-by-step guide)"
echo "  - QUICK_START.md (quick reference)"
echo "  - README.md (project overview)"
echo ""

