# 🐘 PostgreSQL Installation Guide

## For Ubuntu/Debian Linux

### Step 1: Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install PostgreSQL
```bash
# Install PostgreSQL and contrib package
sudo apt install postgresql postgresql-contrib -y
```

### Step 3: Verify Installation
```bash
# Check PostgreSQL version
psql --version

# Check if PostgreSQL is running
sudo systemctl status postgresql
```

### Step 4: Start PostgreSQL (if not running)
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql  # Enable auto-start on boot
```

### Step 5: Access PostgreSQL
```bash
# Switch to postgres user
sudo -i -u postgres

# Access PostgreSQL prompt
psql
```

### Step 6: Set Password for postgres User
```sql
-- Inside psql prompt
ALTER USER postgres WITH PASSWORD 'postgres';

-- Exit psql
\q
```

### Step 7: Exit postgres user
```bash
exit
```

### Step 8: Configure PostgreSQL for Local Access

Edit the pg_hba.conf file:
```bash
# Find the config file location
sudo -u postgres psql -c "SHOW hba_file;"

# Edit the file (usually /etc/postgresql/14/main/pg_hba.conf)
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Find the line:
```
local   all             postgres                                peer
```

Change it to:
```
local   all             postgres                                md5
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 9: Restart PostgreSQL
```bash
sudo systemctl restart postgresql
```

### Step 10: Test Connection
```bash
# Test connection with password
psql -U postgres -h localhost

# When prompted, enter password: postgres
# You should now be in the PostgreSQL prompt

# Exit
\q
```

## For Other Operating Systems

### macOS (using Homebrew)
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Create postgres user
createuser -s postgres

# Set password
psql postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### Windows
1. Download installer from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password for postgres user during installation: `postgres`
4. Remember the port (default: 5432)

## Verification

After installation, verify PostgreSQL is working:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # macOS

# Test connection
psql -U postgres -h localhost -c "SELECT version();"
```

You should see PostgreSQL version information.

## Next Steps

Once PostgreSQL is installed and running, proceed with the project setup!

