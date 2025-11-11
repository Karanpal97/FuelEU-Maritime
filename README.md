# ⚓ Fuel EU Compliance Dashboard

A full-stack application for managing maritime GHG intensity and compliance, implementing EU Regulation 2023/1805 (Fuel EU Maritime) with focus on Articles 20 (Banking) and 21 (Pooling).

## 📋 Project Overview

This project provides a comprehensive dashboard for managing shipping route compliance balances, including:

- **Routes Management**: Track vessel routes with GHG intensity metrics
- **Comparison Analysis**: Compare routes against baseline and target intensities
- **Banking (Article 20)**: Bank positive compliance balances for future use
- **Pooling (Article 21)**: Create compliance pools across multiple ships

## 🏗️ Architecture

Both frontend and backend follow **Hexagonal Architecture** (Ports & Adapters pattern):

- ✅ **Core Domain**: Pure business logic, framework-agnostic
- ✅ **Ports**: Interface definitions (contracts)
- ✅ **Adapters**: Framework-specific implementations
- ✅ **Dependency Inversion**: Core depends on abstractions, not implementations

### Project Structure

```
newclgprj/
├── backend/              # Node.js + TypeScript + Prisma + PostgreSQL
│   ├── src/
│   │   ├── core/        # Domain entities, use cases, ports
│   │   ├── adapters/    # HTTP controllers, DB repositories
│   │   └── infrastructure/  # Server, database setup
│   ├── prisma/          # Prisma schema
│   └── README.md
├── frontend/            # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── core/       # Domain entities, ports
│   │   ├── adapters/   # API clients, UI components
│   │   └── App.tsx
│   └── README.md
├── README.md           # This file
├── AGENT_WORKFLOW.md   # AI agent collaboration workflow
└── REFLECTION.md       # Project reflection and learnings
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure database
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run db:push

# Seed initial data (5 KPI routes)
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:3001`

**🚀 Quick Start:** Run `./QUICK_PRISMA_START.sh` for automatic setup!

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Access the Dashboard

Open `http://localhost:3000` in your browser.

## 📊 Features

### Routes Tab
- Display all routes with filters (vessel type, fuel type, year)
- Set baseline route for comparisons
- View GHG intensity, fuel consumption, emissions

### Compare Tab
- Compare routes against baseline
- Visual bar chart with target intensity reference
- Compliance status (✅/❌)
- Percentage difference calculations

### Banking Tab (Article 20)
- View compliance balance (CB)
- Bank positive CB for future use
- Apply banked surplus to deficits
- FIFO allocation strategy
- KPIs: current CB, available banked, status

### Pooling Tab (Article 21)
- Create compliance pools with multiple ships
- Automatic allocation using greedy algorithm
- Real-time validation:
  - Pool sum must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative
- Before/after comparison

## 🧮 Business Logic

### Compliance Balance Calculation

```
CB = (Target - Actual) × Energy in scope
Energy in scope = Fuel Consumption (tonnes) × 41,000 MJ/tonne
Target Intensity (2025) = 89.3368 gCO₂e/MJ (2% below 91.16)
```

### KPI Dataset

| Route ID | Vessel Type  | Fuel | Year | GHG Intensity | Fuel (t) | Distance (km) | Emissions (t) |
|----------|--------------|------|------|---------------|----------|---------------|---------------|
| R001     | Container    | HFO  | 2024 | 91.0          | 5000     | 12000         | 4500          |
| R002     | BulkCarrier  | LNG  | 2024 | 88.0          | 4800     | 11500         | 4200          |
| R003     | Tanker       | MGO  | 2024 | 93.5          | 5100     | 12500         | 4700          |
| R004     | RoRo         | HFO  | 2025 | 89.2          | 4900     | 11800         | 4300          |
| R005     | Container    | LNG  | 2025 | 90.5          | 4950     | 11900         | 4400          |

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📡 API Endpoints

- `GET /api/routes` - Get all routes
- `POST /api/routes/:routeId/baseline` - Set baseline
- `GET /api/routes/comparison` - Get comparison data
- `GET /api/compliance/cb` - Get compliance balance
- `GET /api/compliance/adjusted-cb` - Get adjusted balance
- `GET /api/banking/records` - Get bank records
- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked
- `POST /api/pools` - Create pool

## 🛠️ Technology Stack

### Backend
- Node.js + Express
- TypeScript (strict mode)
- **Prisma ORM** (type-safe database queries)
- PostgreSQL
- Zod (validation)

### Frontend
- React 18
- TypeScript (strict mode)
- Tailwind CSS
- Recharts (charts)
- Axios (HTTP)
- Vite (build tool)

## 📚 Documentation

- **[START_HERE.md](./START_HERE.md)** - Quick start guide for Prisma setup ⭐
- **[WHATS_NEW.md](./WHATS_NEW.md)** - Prisma migration details and comparisons
- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Complete Prisma setup guide
- [Backend README](./backend/README.md) - Backend architecture and API
- [Frontend README](./frontend/README.md) - Frontend architecture and components
- [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) - AI agent collaboration process
- [REFLECTION.md](./REFLECTION.md) - Project learnings and insights

## 🎯 Evaluation Criteria

| Criteria | Status |
|----------|--------|
| ✅ Hexagonal Architecture | Implemented |
| ✅ TypeScript Strict Mode | Enabled |
| ✅ All 4 Tabs Functional | Complete |
| ✅ Banking Logic (Art. 20) | Implemented |
| ✅ Pooling Logic (Art. 21) | Implemented |
| ✅ Responsive UI | Yes |
| ✅ Data Visualization | Charts included |
| ✅ Comprehensive Documentation | Complete |

## 📖 Reference

Based on **Fuel EU Maritime Regulation (EU) 2023/1805**:
- Annex IV: GHG intensity calculation methodology
- Article 20: Banking of compliance balances
- Article 21: Pooling of compliance balances

## 👨‍💻 Development

Both projects use:
- ESLint for code quality
- Prettier for formatting
- Git for version control

## 📝 License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ using Hexagonal Architecture**

