# Fuel EU Compliance Backend

Backend API for the Fuel EU Maritime Compliance Dashboard, built with Node.js, TypeScript, PostgreSQL, and Hexagonal Architecture.

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters):

```
src/
├── core/                    # Core business logic (framework-agnostic)
│   ├── domain/             # Entities and domain models
│   ├── application/        # Use cases and business logic
│   └── ports/              # Interface definitions
│       ├── inbound/        # Input port interfaces
│       └── outbound/       # Output port interfaces
├── adapters/               # Framework-specific implementations
│   ├── inbound/            # HTTP controllers and routes
│   └── outbound/           # Database repositories
├── infrastructure/         # Infrastructure setup
│   ├── db/                # Database connection and migrations
│   └── server/            # Express server setup
└── shared/                # Shared utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### Database Setup

```bash
# Run migrations (create tables)
npm run db:migrate

# Seed initial data (5 KPI routes)
npm run db:seed
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test
```

## 📡 API Endpoints

### Routes
- `GET /api/routes` - Get all routes (with optional filters)
- `POST /api/routes/:routeId/baseline` - Set baseline route
- `GET /api/routes/comparison` - Get baseline vs comparison data

### Compliance
- `GET /api/compliance/cb?shipId=X&year=Y` - Get compliance balance
- `GET /api/compliance/adjusted-cb?shipId=X&year=Y` - Get adjusted balance

### Banking (Article 20)
- `GET /api/banking/records?shipId=X&year=Y` - Get bank records
- `POST /api/banking/bank` - Bank positive CB
- `POST /api/banking/apply` - Apply banked surplus to deficit

### Pooling (Article 21)
- `POST /api/pools` - Create a compliance pool

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 Business Logic

### Compliance Balance Calculation
```
CB = (Target - Actual) × Energy in scope
Energy in scope = Fuel Consumption (tonnes) × 41,000 MJ/tonne
Target Intensity (2025) = 89.3368 gCO₂e/MJ (2% below 91.16)
```

### Banking (Article 20)
- Ships can bank positive CB for future use
- Banked surplus can be applied to deficits
- FIFO (First In, First Out) allocation

### Pooling (Article 21)
- Multiple ships can pool their CB
- Pool sum must be ≥ 0
- Deficit ships cannot exit worse
- Surplus ships cannot exit negative
- Greedy allocation algorithm

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📚 Learn More

- [Fuel EU Maritime Regulation (EU) 2023/1805](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1805)
- Hexagonal Architecture
- TypeScript Best Practices

