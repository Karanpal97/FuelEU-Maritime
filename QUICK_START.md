# ⚡ Quick Start Guide - Fuel EU Compliance Dashboard

## 🚀 Get Running in 5 Minutes

### Prerequisites Check ✓
```bash
node --version   # Should be 18+
npm --version    # Should be 9+
psql --version   # Should be 14+
```

### Step 1: Database Setup (2 minutes)
```bash
# Create database
psql -U postgres -c "CREATE DATABASE fueleu_compliance;"
```

### Step 2: Automated Setup (2 minutes)
```bash
cd /home/karan/project/newclgprj

# Run automated installation
./install.sh

# If you get permission denied:
chmod +x install.sh start.sh
./install.sh
```

### Step 3: Start Application (1 minute)
```bash
# Option A: Automated (opens two terminals)
./start.sh

# Option B: Manual (open 2 terminals)
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Step 4: Access Dashboard
```
🌐 Open: http://localhost:3000
```

---

## 🎯 What You Get

✅ **Routes Tab** - View and filter all shipping routes  
✅ **Compare Tab** - Compare routes with charts  
✅ **Banking Tab** - Bank/apply compliance balances  
✅ **Pooling Tab** - Create compliance pools  

---

## 📊 Test Data Included

5 routes pre-loaded:
- R001 (Container, HFO, 2024) - **Baseline**
- R002 (BulkCarrier, LNG, 2024)
- R003 (Tanker, MGO, 2024)
- R004 (RoRo, HFO, 2025)
- R005 (Container, LNG, 2025)

---

## 🔧 Common Commands

### Backend
```bash
cd backend
npm run dev           # Start server
npm run db:migrate    # Run migrations
npm run db:seed       # Seed data
npm test             # Run tests
```

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm test            # Run tests
```

---

## 🆘 Quick Troubleshooting

### "Database connection failed"
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # Mac

# Verify credentials in backend/.env
```

### "Port 3001/3000 already in use"
```bash
# Kill process
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### "Module not found"
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Detailed setup |
| `backend/.env` | DB credentials |
| `backend/src/infrastructure/db/seed.ts` | Test data |

---

## 🎓 Next Steps

1. ✅ Explore all 4 tabs in the dashboard
2. ✅ Try setting different baselines
3. ✅ Create a compliance pool
4. ✅ Test banking operations
5. ✅ Read the documentation

---

## 📞 Need More Help?

- **Detailed Setup**: See `SETUP_GUIDE.md`
- **Architecture**: See `README.md`
- **Development**: See `AGENT_WORKFLOW.md`
- **Insights**: See `REFLECTION.md`

---

**You're ready to go!** 🎉

Backend: http://localhost:3001  
Frontend: http://localhost:3000  
API Docs: http://localhost:3001/api/health

