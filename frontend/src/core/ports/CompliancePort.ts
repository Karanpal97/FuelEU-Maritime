/**
 * Compliance Port - Outbound Interface
 */
import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/entities/Compliance';

export interface CompliancePort {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
}

