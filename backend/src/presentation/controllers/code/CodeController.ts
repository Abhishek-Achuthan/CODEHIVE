import { injectable, inject } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express';
import { ExecuteCodeUseCase } from '../../../application/useCase/code/ExecuteCodeUseCase';
import { ForbiddenError } from '../../../core/errors/ForbiddenError';
import { executeCodeSchema } from '../../validation/codeValidation';
import { RoomAuthorizationService } from '../../../application/services/RoomAuthorizationService';
import { CapabilityKey } from '../../../domain/types/CapabilityKey';

@injectable()
export class CodeController {
  constructor(
    @inject(ExecuteCodeUseCase)
    private readonly executeCodeUseCase: ExecuteCodeUseCase,
    @inject(RoomAuthorizationService)
    private readonly roomAuthService: RoomAuthorizationService,
  ) {}

  execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = executeCodeSchema.parse(req.body);
      
      const user = req.user!; 
      
      await this.roomAuthService.assertCapability(
        validatedData.roomId,
        user.id,
        CapabilityKey.ROOM_CODE_RUN,
        'write'
      );

      const result = await this.executeCodeUseCase.execute({
        roomId: validatedData.roomId,
        requesterId: user.id,
        sourceCode: validatedData.sourceCode,
        language: validatedData.language,
        stdin: validatedData.stdin,
      });

      res.json({ success: true, result });
    } catch (error) {
      next(error);
    }
  };
}
