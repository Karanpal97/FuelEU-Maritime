/**
 * Banking Controller - HTTP Inbound Adapter
 * Article 20 - Banking
 */
import { Request, Response } from 'express';
import { BankSurplusUseCase } from '../../../../core/application/usecases/BankSurplus';
import { ApplyBankedUseCase } from '../../../../core/application/usecases/ApplyBanked';
import { BankingRepository } from '../../../../core/ports/outbound/BankingRepository';

export class BankingController {
  constructor(
    private bankSurplusUseCase: BankSurplusUseCase,
    private applyBankedUseCase: ApplyBankedUseCase,
    private bankingRepository: BankingRepository
  ) {}

  getBankRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId) {
        res.status(400).json({ success: false, error: 'shipId is required' });
        return;
      }

      let records;
      if (year) {
        records = await this.bankingRepository.findByShipAndYear(
          shipId as string,
          parseInt(year as string)
        );
      } else {
        records = await this.bankingRepository.findByShip(shipId as string);
      }

      const totalAvailable = await this.bankingRepository.findAvailableBalance(shipId as string);

      res.json({ success: true, data: { records, totalAvailable } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };

  bankSurplus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amountGco2eq } = req.body;

      if (!shipId || !year || amountGco2eq === undefined) {
        res.status(400).json({ 
          success: false, 
          error: 'shipId, year, and amountGco2eq are required' 
        });
        return;
      }

      const result = await this.bankSurplusUseCase.execute({
        shipId,
        year: parseInt(year),
        amountGco2eq: parseFloat(amountGco2eq),
      });

      if (!result.success) {
        res.status(400).json({ success: false, error: result.message });
        return;
      }

      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };

  applyBanked = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, deficitYear, amountGco2eq } = req.body;

      if (!shipId || !deficitYear || amountGco2eq === undefined) {
        res.status(400).json({ 
          success: false, 
          error: 'shipId, deficitYear, and amountGco2eq are required' 
        });
        return;
      }

      const result = await this.applyBankedUseCase.execute({
        shipId,
        deficitYear: parseInt(deficitYear),
        amountGco2eq: parseFloat(amountGco2eq),
      });

      if (!result.success) {
        res.status(400).json({ success: false, error: result.message });
        return;
      }

      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ success: false, error: message });
    }
  };
}

