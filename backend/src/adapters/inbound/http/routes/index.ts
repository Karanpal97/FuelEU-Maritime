/**
 * HTTP Routes - Main Router
 */
import { Router } from 'express';
import { RoutesController } from '../controllers/RoutesController';
import { ComplianceController } from '../controllers/ComplianceController';
import { BankingController } from '../controllers/BankingController';
import { PoolingController } from '../controllers/PoolingController';

export function createRouter(
  routesController: RoutesController,
  complianceController: ComplianceController,
  bankingController: BankingController,
  poolingController: PoolingController
): Router {
  const router = Router();

  // Health check
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes endpoints
  router.get('/routes', routesController.getAllRoutes);
  router.post('/routes/:routeId/baseline', routesController.setBaseline);
  router.get('/routes/comparison', routesController.getComparison);

  // Compliance endpoints
  router.get('/compliance/cb', complianceController.getComplianceBalance);
  router.get('/compliance/adjusted-cb', complianceController.getAdjustedBalance);

  // Banking endpoints
  router.get('/banking/records', bankingController.getBankRecords);
  router.post('/banking/bank', bankingController.bankSurplus);
  router.post('/banking/apply', bankingController.applyBanked);

  // Pooling endpoints
  router.post('/pools', poolingController.createPool);

  return router;
}

