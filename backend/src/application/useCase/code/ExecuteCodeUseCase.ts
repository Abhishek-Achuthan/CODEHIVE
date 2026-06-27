import { injectable, inject } from 'tsyringe';
import type { ICodeExecutionService } from '../../ports/code/ICodeExecutionService';
import type { ILoggerService } from '../../ports/logging/ILoggerService';
import type { Language } from '../../../domain/types/Language';

interface ExecuteCodeInput {
  roomId: string;
  requesterId: string;
  sourceCode: string;
  language: Language;
  stdin?: string | undefined;
}

@injectable()
export class ExecuteCodeUseCase {
  constructor(
    @inject('ICodeExecutionService')
    private readonly codeExecutionService: ICodeExecutionService,
    @inject('ILoggerService')
    private readonly logger: ILoggerService,
  ) {}

  async execute(input: ExecuteCodeInput) {
    this.logger.info(`[ExecuteCode] room=${input.roomId} user=${input.requesterId} lang=${input.language}`);

    const result = await this.codeExecutionService.execute({
      sourceCode: input.sourceCode,
      language: input.language,
      stdin: input.stdin,
    });

    return result;
  }
}
