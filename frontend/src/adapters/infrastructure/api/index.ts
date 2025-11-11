/**
 * API Adapters Export
 */
import { RoutesApiAdapter } from './RoutesApiAdapter';
import { ComplianceApiAdapter } from './ComplianceApiAdapter';
import { BankingApiAdapter } from './BankingApiAdapter';
import { PoolingApiAdapter } from './PoolingApiAdapter';

// Export the classes
export { RoutesApiAdapter, ComplianceApiAdapter, BankingApiAdapter, PoolingApiAdapter };

// Create and export singleton instances
export const routesApi = new RoutesApiAdapter();
export const complianceApi = new ComplianceApiAdapter();
export const bankingApi = new BankingApiAdapter();
export const poolingApi = new PoolingApiAdapter();

