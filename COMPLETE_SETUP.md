# 🚀 Complete Local Setup Guide - Step by Step

This guide will take you from zero to a running application. Follow each step carefully.

---

## Prerequisites Installation

### 1. Check What You Have

```bash
# Check Node.js
node --version
# Should be 18 or higher. If not installed, continue below.

# Check npm
npm --version
# Should be 9 or higher. Usually comes with Node.js.

# Check PostgreSQL
psql --version
# If command not found, you need to install PostgreSQL.
```

### 2. Install Node.js (if needed)

#### Ubuntu/Debian:
```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### macOS:
```bash
# Using Homebrew
brew install node@20

# Verify
node --version
npm --version
```

### 3. Install PostgreSQL

#### Ubuntu/Debian (Recommended for your system):
```bash
# Update system
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
# You should see "active (running)"
```

#### Set PostgreSQL Password:
```bash
# Switch to postgres user
sudo -i -u postgres

# Open PostgreSQL prompt
psql

# Set password (copy-paste this line)
ALTER USER postgres WITH PASSWORD 'postgres';

# Exit PostgreSQL
\q

# Exit postgres user
exit
```

#### Configure PostgreSQL for Local Access:
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Find this line:
#   local   all             postgres                                peer
# Change 'peer' to 'md5':
#   local   all             postgres                                md5

# Save: Ctrl+X, then Y, then Enter

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### Test PostgreSQL Connection:
```bash
# Test connection (password: postgres)
psql -U postgres -h localhost -c "SELECT 1;"

# If you see:
#  ?column? 
# ----------
#         1
# (1 row)
# Then PostgreSQL is working correctly!
```

---

## Project Setup

### 4. Navigate to Project Directory

```bash
cd /home/karan/project/newclgprj
```

### 5. Create PostgreSQL Database

```bash
# Create the database
psql -U postgres -h localhost -c "CREATE DATABASE fueleu_compliance;"

# Verify database was created
psql -U postgres -h localhost -c "\l" | grep fueleu_compliance
```

### 6. Setup Backend

```bash
# Navigate to backend
cd /home/karan/project/newclgprj/backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Verify .env file exists and has correct settings
cat .env
# Should show:
# PORT=3001
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=fueleu_compliance
# DB_USER=postgres
# DB_PASSWORD=postgres

# Run database migrations (create tables)
npm run db:migrate

# You should see:
# 🔄 Running database migrations...
# ✅ Database migrations completed successfully

# Seed initial data (load 5 routes)
npm run db:seed

# You should see:
# 🌱 Seeding database...
# ✅ Database seeded successfully
#    - Inserted 5 routes
#    - Baseline: R001 (Container, HFO, 2024, 91.0 gCO₂e/MJ)
```

### 7. Test Backend

```bash
# Still in backend directory
# Start the backend server
npm run dev

# You should see:
# ✅ Database connection established
# 🚀 Fuel EU Compliance Backend running on port 3001
# 📊 API: http://localhost:3001/api
# 💚 Health: http://localhost:3001/api/health

# Keep this terminal open!
```

### 8. Test Backend API (in new terminal)

```bash
# Open a NEW terminal window
# Test the health endpoint
curl http://localhost:3001/api/health

# Should return:
# {"status":"ok","timestamp":"2025-11-11T..."}

# Test routes endpoint
curl http://localhost:3001/api/routes

# Should return JSON with 5 routes
```

### 9. Setup Frontend

```bash
# In a NEW terminal window
cd /home/karan/project/newclgprj/frontend

# Install dependencies (this may take a few minutes)
npm install

# Start the frontend development server
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# 
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
# ➜  press h to show help

# Keep this terminal open!
```

---

## Access the Application

### 10. Open Your Browser

```bash
# Open this URL in your browser:
http://localhost:3000
```

You should see the **Fuel EU Compliance Dashboard** with:
- Beautiful header with the title
- 4 tabs: Routes, Compare, Banking, Pooling
- The Routes tab showing 5 routes in a table

---

## Verify Everything Works

### Test Each Tab:

#### ✅ Routes Tab
- You should see 5 routes (R001-R005)
- R001 should be marked as "Baseline"
- Try filtering by vessel type, fuel type, or year
- Try clicking "Set Baseline" on another route

#### ✅ Compare Tab
- You should see a bar chart
- Shows baseline route (R001) compared to others
- Red reference line at 89.3368 gCO₂e/MJ
- Table showing compliance status with ✅ or ❌

#### ✅ Banking Tab
- Select a ship ID (e.g., R001)
- Select a year (2024)
- You'll see KPI cards with CB values
- Note: To use banking features, you first need CB data (computed from routes)

#### ✅ Pooling Tab
- Add multiple members
- Select ship IDs (R001, R002, etc.)
- Click "Load CB" for each member
- Try creating a pool

---

## Troubleshooting

### Backend won't start

**Issue**: `Database connection failed`

**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# If not running:
sudo systemctl start postgresql

# Test connection
psql -U postgres -h localhost -c "SELECT 1;"
```

**Issue**: `Database "fueleu_compliance" does not exist`

**Solution**:
```bash
psql -U postgres -h localhost -c "CREATE DATABASE fueleu_compliance;"
```

**Issue**: `password authentication failed for user "postgres"`

**Solution**:
```bash
# Reset postgres password
sudo -i -u postgres
psql
ALTER USER postgres WITH PASSWORD 'postgres';
\q
exit

# Update backend/.env file to match
```

### Frontend won't start

**Issue**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

**Issue**: `Cannot connect to backend API`

**Solution**:
```bash
# Make sure backend is running on port 3001
curl http://localhost:3001/api/health

# Check backend terminal for errors
```

### Database migration fails

**Issue**: `relation "routes" already exists`

**Solution**:
```bash
# Drop all tables and recreate
psql -U postgres -h localhost -d fueleu_compliance << EOF
DROP TABLE IF EXISTS pool_members CASCADE;
DROP TABLE IF EXISTS pools CASCADE;
DROP TABLE IF EXISTS bank_entries CASCADE;
DROP TABLE IF EXISTS ship_compliance CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
EOF

# Run migrations again
npm run db:migrate
npm run db:seed
```

---

## File Structure Check

Verify all files exist:

```bash
cd /home/karan/project/newclgprj

# Check backend files
ls backend/package.json
ls backend/.env
ls backend/src/infrastructure/server/index.ts

# Check frontend files
ls frontend/package.json
ls frontend/src/App.tsx

# Check documentation
ls README.md
ls SETUP_GUIDE.md
```

---

## Quick Reference

### Start Everything (after initial setup)

**Terminal 1 - Backend:**
```bash
cd /home/karan/project/newclgprj/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/karan/project/newclgprj/frontend
npm run dev
```

**Browser:**
```
http://localhost:3000
```

### Stop Everything

Press `Ctrl+C` in both terminal windows.

### Reset Database

```bash
cd /home/karan/project/newclgprj/backend
psql -U postgres -h localhost -c "DROP DATABASE fueleu_compliance;"
psql -U postgres -h localhost -c "CREATE DATABASE fueleu_compliance;"
npm run db:migrate
npm run db:seed
```

---

## System Requirements

- **OS**: Ubuntu 20.04+ / Debian 10+ / macOS 11+ / Windows 10+
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for project + dependencies
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

---

## Default Credentials

**PostgreSQL:**
- Username: `postgres`
- Password: `postgres`
- Database: `fueleu_compliance`
- Host: `localhost`
- Port: `5432`

**Application:**
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- API Base: `http://localhost:3001/api`

---

## Next Steps

1. ✅ Read the [README.md](./README.md) for project overview
2. ✅ Check [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) for development process
3. ✅ Review [REFLECTION.md](./REFLECTION.md) for insights
4. ✅ Explore the code and features

---

## 🎉 You're Done!

The Fuel EU Compliance Dashboard should now be running successfully!

**Need help?** Check the troubleshooting section above or review the error messages in your terminal.

**Happy Coding!** 🚀

