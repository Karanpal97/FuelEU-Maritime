# 🔧 Manual Prisma Setup

## Issue: DATABASE_URL Not Found

The `prisma.config.ts` file was causing issues. **I've removed it** ✅

## 🚀 Simple Setup (3 Steps)

### Step 1: Set Up PostgreSQL Database

Run these commands **one by one** in your terminal:

```bash
# Switch to postgres user and create database
sudo -u postgres psql << EOF
CREATE DATABASE fueleu_compliance;
CREATE USER karan WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE fueleu_compliance TO karan;
ALTER DATABASE fueleu_compliance OWNER TO karan;
\q
EOF
```

**OR** if you want to use the `postgres` user:

```bash
# Set password for postgres user
sudo -u postgres psql << EOF
ALTER USER postgres WITH PASSWORD 'postgres';
\q
EOF
```

### Step 2: Update .env File

Your `.env` file has been updated. Check it:

```bash
cat .env
```

It should show:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fueleu_compliance?schema=public"
```

**If you used the `karan` user above**, update it to:
```bash
echo 'DATABASE_URL="postgresql://karan:password@localhost:5432/fueleu_compliance?schema=public"' > .env
```

### Step 3: Run Prisma Setup

```bash
cd /home/karan/project/newclgprj/backend

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push --accept-data-loss

# Seed database
npm run seed

# Start server
npm run dev
```

---

## 🎯 Quick Commands

```bash
# All in one (after database is created):
cd /home/karan/project/newclgprj/backend
npx prisma generate && npx prisma db push --accept-data-loss && npm run seed && npm run dev
```

---

## 🐛 Troubleshooting

### Error: "Peer authentication failed"

**Problem:** PostgreSQL is using peer authentication.

**Solution 1:** Use your system username (`karan`) in DATABASE_URL:
```bash
DATABASE_URL="postgresql://karan:password@localhost:5432/fueleu_compliance?schema=public"
```

**Solution 2:** Change PostgreSQL authentication to md5:

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Find the line:
```
local   all             postgres                                peer
```

Change to:
```
local   all             postgres                                md5
```

Then restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Error: "Database does not exist"

```bash
sudo -u postgres psql -c "CREATE DATABASE fueleu_compliance;"
```

### Error: "Authentication failed for user"

Set password for postgres user:
```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

---

## ✅ Verify Everything Works

```bash
# Test database connection
psql -U postgres -h localhost -d fueleu_compliance -c "SELECT 1;"

# Or with your user
psql -U karan -h localhost -d fueleu_compliance -c "SELECT 1;"

# Generate Prisma Client
npx prisma generate

# Push schema
npx prisma db push

# Seed data
npm run seed

# Start server
npm run dev
```

---

## 🎨 Open Prisma Studio

Once everything is set up:

```bash
npx prisma studio
```

Opens at: `http://localhost:5555`

---

## 📝 Summary of What I Fixed

1. ✅ **Removed `prisma.config.ts`** - This was causing the env loading issue
2. ✅ **Updated `.env`** - Set DATABASE_URL to use localhost PostgreSQL
3. ✅ **Created setup scripts** - Multiple ways to set up

---

## 🚀 Recommended: Use Your System User

This is the easiest approach:

```bash
# 1. Create database with your user
sudo -u postgres psql << EOF
CREATE DATABASE fueleu_compliance;
GRANT ALL PRIVILEGES ON DATABASE fueleu_compliance TO karan;
ALTER DATABASE fueleu_compliance OWNER TO karan;
\q
EOF

# 2. Update .env
echo 'DATABASE_URL="postgresql://karan@localhost:5432/fueleu_compliance?schema=public"' >> .env

# 3. Run setup
npx prisma generate
npx prisma db push --accept-data-loss
npm run seed
npm run dev
```

---

**Need help?** Let me know which error you're getting!

