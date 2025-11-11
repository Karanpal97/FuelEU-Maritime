/**
 * Compliance API Adapter - Infrastructure
 */
import { CompliancePort } from '@/core/ports/CompliancePort';
import { ComplianceBalance, AdjustedComplianceBalance } from '@/core/domain/entities/Compliance';
import { apiClient } from './apiClient';

export class ComplianceApiAdapter implements CompliancePort {
  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    return apiClient.get<ComplianceBalance>('/compliance/cb', { shipId, year: year.toString() });
  }

  async getAdjustedBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    return apiClient.get<AdjustedComplianceBalance>('/compliance/adjusted-cb', {
      shipId,
      year: year.toString(),
    });
  }
}

