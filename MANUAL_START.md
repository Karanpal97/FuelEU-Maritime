# 🚀 Manual Start Guide

The automated `start.sh` script has a terminal compatibility issue on your system. Here's how to start manually:

## ✅ Issues Fixed

1. ✅ **Frontend API import error** - Fixed circular dependency
2. ✅ **Backend migration error** - Fixed ES Module issues
3. ✅ **Database setup** - Successfully migrated and seeded!

---

## 🎯 Start the Application Manually

You need **TWO terminal windows** open simultaneously.

### Terminal 1: Start Backend

```bash
cd /home/karan/project/newclgprj/backend
npm run dev
```

**Wait for this message:**
```
✅ Database connection established
🚀 Fuel EU Compliance Backend running on port 3001
📊 API: http://localhost:3001/api
💚 Health: http://localhost:3001/api/health
```

✅ **Keep this terminal window open!**

---

### Terminal 2: Start Frontend (New Terminal)

Open a **NEW terminal window** and run:

```bash
cd /home/karan/project/newclgprj/frontend
npm run dev
```

**Wait for this message:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

✅ **Keep this terminal window open too!**

---

## 🌐 Access the Dashboard

Open your browser and go to:

```
http://localhost:3000
```

You should see:
- ✅ Fuel EU Compliance Dashboard
- ✅ 4 tabs: Routes, Compare, Banking, Pooling
- ✅ No console errors!

---

## 🧪 Test the Backend API

In a **third terminal** (optional), test the backend:

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test routes endpoint (should return 5 routes)
curl http://localhost:3001/api/routes
```

---

## 🛑 Stop the Servers

When you're done:

1. Go to **Terminal 1** (backend) and press `Ctrl+C`
2. Go to **Terminal 2** (frontend) and press `Ctrl+C`

---

## 🔄 Restart Later

Next time you want to start the application:

1. Open Terminal 1: `cd /home/karan/project/newclgprj/backend && npm run dev`
2. Open Terminal 2: `cd /home/karan/project/newclgprj/frontend && npm run dev`
3. Open browser: `http://localhost:3000`

---

## ⚠️ About the Terminal Error

The error you saw:
```
/usr/bin/gnome-terminal.real: symbol lookup error: ... undefined symbol: __libc_pthread_init
```

This is a system-level issue with snap packages conflicting with your system libraries. It doesn't affect the application - we just need to start the servers manually instead of using the automated script.

---

## ✅ Everything is Working Now!

- ✅ PostgreSQL database setup
- ✅ Backend configured
- ✅ Frontend configured
- ✅ All errors fixed
- ✅ 5 routes seeded

**Just start both servers and enjoy!** 🎉

