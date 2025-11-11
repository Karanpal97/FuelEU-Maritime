# Fuel EU Compliance Dashboard - Frontend

Modern, responsive dashboard for managing maritime GHG intensity and compliance, built with React, TypeScript, and Tailwind CSS following Hexagonal Architecture.

## 🏗️ Architecture

This project implements **Hexagonal Architecture** (Ports & Adapters):

```
src/
├── core/                          # Core business logic (framework-agnostic)
│   ├── domain/
│   │   └── entities/             # Domain models and types
│   └── ports/                    # Interface definitions
├── adapters/
│   ├── infrastructure/
│   │   └── api/                  # API clients (outbound adapters)
│   └── ui/
│       └── components/           # React components (inbound adapters)
│           ├── shared/           # Reusable UI components
│           └── tabs/             # Feature-specific components
└── shared/                       # Shared utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 3001

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📊 Features

### 1. Routes Tab
- View all maritime routes with filtering
- Filter by vessel type, fuel type, and year
- Set baseline route for comparisons
- Display GHG intensity, fuel consumption, emissions

### 2. Compare Tab
- Compare routes against baseline
- Visual chart showing GHG intensity
- Target intensity reference line (89.3368 gCO₂e/MJ)
- Compliance status indicators
- Percentage difference calculations

### 3. Banking Tab (Article 20)
- View current compliance balance
- Bank positive CB for future use
- Apply banked surplus to deficits
- Real-time KPIs: current CB, available banked, status
- Banking history table

### 4. Pooling Tab (Article 21)
- Create compliance pools with multiple ships
- Automatic CB allocation algorithm
- Real-time validation
- Pool sum calculation
- Before/after comparison

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Tailwind UI**: Clean, professional interface
- **Real-time Validation**: Immediate feedback on user actions
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS
- **Recharts**: Chart visualization
- **Axios**: HTTP client

## 🏛️ Hexagonal Architecture Benefits

1. **Framework Independence**: Core logic has no React dependencies
2. **Testability**: Easy to mock ports for testing
3. **Flexibility**: Can swap UI or API implementations
4. **Maintainability**: Clear separation of concerns
5. **Scalability**: Easy to add new features

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

