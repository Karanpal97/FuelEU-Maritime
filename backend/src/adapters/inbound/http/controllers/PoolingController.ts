import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../../core/application/usecases/CreatePool';

export class PoolingController {
  constructor(private createPoolUseCase: CreatePoolUseCase) {}

  createPool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year, members } = req.body;

      if (!year || !members || !Array.isArray(members)) {
        res.status(400).json({ 
          success: false, 
          error: 'year and members array are required' 
        });
        return;
      }

      for (const member of members) {
        if (!member.shipId || member.cbBefore === undefined) {
          res.status(400).json({ 
            success: false, 
            error: 'Each member must have shipId and cbBefore' 
          });
          return;
        }
      }

      const validation = await this.createPoolUseCase.validate({
        year: parseInt(year),
        members: members.map((m: any) => ({
          shipId: m.shipId,
          cbBefore: parseFloat(m.cbBefore),
        })),
      });

      if (!validation.isValid) {
        res.status(400).json({ 
          success: false, 
          error: validation.errors.join(', '),
          validation 
        });
        return;
      }

      const result = await this.createPoolUseCase.execute({
        year: parseInt(year),
        members: members.map((m: any) => ({
          shipId: m.shipId,
          cbBefore: parseFloat(m.cbBefore),
        })),
      });

      res.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ success: false, error: message });
    }
  };
}

