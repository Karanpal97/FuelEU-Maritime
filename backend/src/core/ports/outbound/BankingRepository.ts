
import { BankEntry } from '../../domain/entities/Banking';

export interface BankingRepository {
  findByShip(shipId: string): Promise<BankEntry[]>;
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  findAvailableBalance(shipId: string): Promise<number>;
  create(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  updateRemaining(id: number, remaining: number): Promise<void>;
}

