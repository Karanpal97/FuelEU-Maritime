/**
 * Express Server - Application Entry Point (Prisma)
 */
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { prisma, testConnection } from '../db/prisma';
import { createRouter } from '../../adapters/inbound/http/routes';

// Prisma Repository Implementations
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/PostgresComplianceRepository';
import { PostgresBankingRepository } from '../../adapters/outbound/postgres/PostgresBankingRepository';
import { PostgresPoolingRepository } from '../../adapters/outbound/postgres/PostgresPoolingRepository';

// Use Cases
import { ComputeComparisonUseCase } from '../../core/application/usecases/ComputeComparison';
import { ComputeComplianceBalanceUseCase } from '../../core/application/usecases/ComputeComplianceBalance';
import { BankSurplusUseCase } from '../../core/application/usecases/BankSurplus';
import { ApplyBankedUseCase } from '../../core/application/usecases/ApplyBanked';
import { CreatePoolUseCase } from '../../core/application/usecases/CreatePool';

// Controllers
import { RoutesController } from '../../adapters/inbound/http/controllers/RoutesController';
import { ComplianceController } from '../../adapters/inbound/http/controllers/ComplianceController';
import { BankingController } from '../../adapters/inbound/http/controllers/BankingController';
import { PoolingController } from '../../adapters/inbound/http/controllers/PoolingController';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Dependency Injection - Repositories (Prisma)
const routeRepository = new PostgresRouteRepository(prisma);
const complianceRepository = new PostgresComplianceRepository(prisma);
const bankingRepository = new PostgresBankingRepository(prisma);
const poolingRepository = new PostgresPoolingRepository(prisma);

// Dependency Injection - Use Cases
const computeComparisonUseCase = new ComputeComparisonUseCase(routeRepository);
const computeCBUseCase = new ComputeComplianceBalanceUseCase(complianceRepository, routeRepository);
const bankSurplusUseCase = new BankSurplusUseCase(bankingRepository, complianceRepository);
const applyBankedUseCase = new ApplyBankedUseCase(bankingRepository, complianceRepository);
const createPoolUseCase = new CreatePoolUseCase(poolingRepository, complianceRepository);

// Dependency Injection - Controllers
const routesController = new RoutesController(routeRepository, computeComparisonUseCase);
const complianceController = new ComplianceController(computeCBUseCase, bankingRepository);
const bankingController = new BankingController(bankSurplusUseCase, applyBankedUseCase, bankingRepository);
const poolingController = new PoolingController(createPoolUseCase);

// Routes
const router = createRouter(routesController, complianceController, bankingController, poolingController);
app.use('/api', router);

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Start server
async function startServer(): Promise<void> {
  try {
    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }
    
    console.log('✅ Database connection established');

    app.listen(PORT, () => {
      console.log(`🚀 Fuel EU Compliance Backend running on port ${PORT}`);
      console.log(`📊 API: http://localhost:${PORT}/api`);
      console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

