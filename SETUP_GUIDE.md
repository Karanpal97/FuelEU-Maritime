# 🚀 Quick Setup Guide

Follow these steps to get the Fuel EU Compliance Dashboard running on your machine.

## Prerequisites

Make sure you have these installed:
- ✅ Node.js 18+ ([Download](https://nodejs.org/))
- ✅ PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- ✅ npm (comes with Node.js) or yarn

## Step 1: Clone or Extract the Project

```bash
cd /home/karan/project/newclgprj
```

## Step 2: Database Setup

### Option A: Using PostgreSQL CLI

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fueleu_compliance;

# Exit psql
\q
```

### Option B: Using pgAdmin or GUI Tool

1. Open your PostgreSQL GUI tool
2. Create a new database named `fueleu_compliance`
3. Note your PostgreSQL credentials

## Step 3: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (this may take a few minutes)
npm install

# Configure database connection
# The .env file is already created with default values
# Edit it if your PostgreSQL credentials are different:
# nano .env  (or use any text editor)

# Run database migrations (create tables)
npm run db:migrate

# Seed initial data (5 KPI routes)
npm run db:seed

# Start the backend server
npm run dev
```

You should see:
```
✅ Database connection established
🚀 Fuel EU Compliance Backend running on port 3001
```

## Step 4: Frontend Setup

Open a **NEW terminal window** (keep backend running):

```bash
# Navigate to frontend
cd /home/karan/project/newclgprj/frontend

# Install dependencies (this may take a few minutes)
npm install

# Start the frontend server
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

## Step 5: Access the Dashboard

Open your web browser and go to:
```
http://localhost:3000
```

You should see the Fuel EU Compliance Dashboard! 🎉

## 🧪 Testing the Application

### 1. Routes Tab
- You should see 5 routes (R001-R005)
- Try filtering by vessel type, fuel type, or year
- Click "Set Baseline" on any route (R001 is already baseline)

### 2. Compare Tab
- You should see a comparison chart
- Baseline route is highlighted
- Target intensity line at 89.3368 gCO₂e/MJ

### 3. Banking Tab
- Select a ship ID (e.g., R001)
- Select a year (2024 or 2025)
- Try banking surplus or applying banked amounts

### 4. Pooling Tab
- Add multiple members (ships)
- Load their CB values
- Create a pool (sum must be ≥ 0)

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # Mac

# Check database connection
psql -U postgres -d fueleu_compliance -c "SELECT 1"
```

### Port already in use
```bash
# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Database migration fails
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE fueleu_compliance"
psql -U postgres -c "CREATE DATABASE fueleu_compliance"

# Run migration again
npm run db:migrate
```

### Dependencies won't install
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Default Credentials

**Database**:
- Host: localhost
- Port: 5432
- Database: fueleu_compliance
- User: postgres
- Password: postgres

**Application**:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed initial data
npm run lint         # Lint code
npm run format       # Format code
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## 🌐 API Endpoints

Once backend is running, you can test APIs directly:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all routes
curl http://localhost:3001/api/routes

# Get comparison
curl http://localhost:3001/api/routes/comparison
```

## 📚 Next Steps

1. ✅ Read the [README.md](./README.md) for detailed information
2. ✅ Check [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) to understand development process
3. ✅ Review [REFLECTION.md](./REFLECTION.md) for insights and learnings
4. ✅ Explore the code in `backend/src` and `frontend/src`

## 🎯 Success Checklist

- [ ] PostgreSQL is running
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] Database created and migrated
- [ ] Seed data loaded (5 routes)
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Dashboard accessible in browser
- [ ] All 4 tabs working

## 🆘 Need Help?

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the error messages carefully
3. Check backend logs in the terminal
4. Verify database connection
5. Ensure all prerequisites are installed
6. Try restarting both servers

## 🎉 You're Ready!

The application is now running and ready to use. Explore the features and enjoy! 🚀

---

**Happy Coding!** 💻

