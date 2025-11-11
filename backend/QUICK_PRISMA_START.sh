#!/bin/bash

# Fuel EU Compliance - Prisma Quick Start Script
# This script sets up Prisma and starts the development environment

set -e

echo "🚀 Prisma Quick Start for Fuel EU Compliance"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL..."
if ! pg_isready -q; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running.${NC}"
    echo "Starting PostgreSQL..."
    sudo systemctl start postgresql
    sleep 2
    if ! pg_isready -q; then
        echo -e "${RED}❌ Failed to start PostgreSQL. Please start it manually.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please update DATABASE_URL in .env if needed${NC}"
fi
echo ""

# Check if database exists
DB_NAME="fueleu_compliance"
echo "🗄️  Checking if database '$DB_NAME' exists..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Database '$DB_NAME' does not exist. Creating it...${NC}"
    psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
    echo -e "${GREEN}✅ Database created${NC}"
fi
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Push schema to database
echo "📊 Pushing Prisma schema to database..."
npm run db:push -- --accept-data-loss
echo -e "${GREEN}✅ Database schema updated${NC}"
echo ""

# Seed database
echo "🌱 Seeding database with initial data..."
npm run seed
echo -e "${GREEN}✅ Database seeded${NC}"
echo ""

# Start dev server
echo "🎉 Setup complete! Starting development server..."
echo ""
echo -e "${GREEN}Backend running at: http://localhost:3001${NC}"
echo -e "${GREEN}API Health Check: http://localhost:3001/health${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

