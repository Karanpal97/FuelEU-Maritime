/**
 * Compliance Repository Port - Outbound Interface
 */
import { ShipCompliance, ComplianceBalance } from '../../domain/entities/Compliance';

export interface ComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
  save(compliance: Omit<ShipCompliance, 'id' | 'createdAt'>): Promise<ShipCompliance>;
  getBalance(shipId: string, year: number): Promise<ComplianceBalance | null>;
}

