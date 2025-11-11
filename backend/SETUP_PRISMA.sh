#!/bin/bash

# Prisma Setup Script for Local PostgreSQL
set -e

echo "🚀 Setting up Prisma for Fuel EU Compliance"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get current user
CURRENT_USER=$(whoami)

echo "📝 Current user: $CURRENT_USER"
echo ""

# Check PostgreSQL
echo "🔍 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running on port 5432${NC}"
    echo "Please start PostgreSQL: sudo systemctl start postgresql"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"
echo ""

# Create database as current user (if they have permissions)
echo "🗄️  Setting up database..."
echo "This will attempt to create the database. If you see authentication errors,"
echo "you may need to run these commands manually:"
echo ""
echo -e "${YELLOW}  sudo -u postgres psql -c \"CREATE DATABASE fueleu_compliance;\"${NC}"
echo -e "${YELLOW}  sudo -u postgres psql -c \"CREATE USER $CURRENT_USER WITH PASSWORD 'password';\"${NC}"
echo -e "${YELLOW}  sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE fueleu_compliance TO $CURRENT_USER;\"${NC}"
echo ""
echo "Attempting automatic setup..."
echo ""

# Try to create database
if psql -U $CURRENT_USER -h localhost -d postgres -c "CREATE DATABASE fueleu_compliance;" 2>/dev/null; then
    echo -e "${GREEN}✅ Database 'fueleu_compliance' created${NC}"
elif psql -U $CURRENT_USER -h localhost -d postgres -c "SELECT 1 FROM pg_database WHERE datname='fueleu_compliance';" 2>/dev/null | grep -q 1; then
    echo -e "${GREEN}✅ Database 'fueleu_compliance' already exists${NC}"
else
    echo -e "${YELLOW}⚠️  Could not create database automatically${NC}"
    echo "Please run the commands shown above, then press Enter to continue..."
    read
fi
echo ""

# Update .env with current user
echo "📝 Updating .env file..."
cat > .env << EOF
PORT=3001
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fueleu_compliance
DB_USER=$CURRENT_USER
DB_PASSWORD=password

# Prisma Database URL
DATABASE_URL="postgresql://$CURRENT_USER:password@localhost:5432/fueleu_compliance?schema=public"
EOF
echo -e "${GREEN}✅ .env file updated${NC}"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Push schema
echo "📊 Pushing Prisma schema to database..."
echo "This will create all tables..."
npm run db:push -- --accept-data-loss
echo -e "${GREEN}✅ Database schema created${NC}"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run seed
echo -e "${GREEN}✅ Database seeded with 5 routes${NC}"
echo ""

# Success
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "You can now:"
echo "  1. Start dev server: npm run dev"
echo "  2. Open Prisma Studio: npm run db:studio"
echo ""
echo "Backend will run at: http://localhost:3001"
echo ""

