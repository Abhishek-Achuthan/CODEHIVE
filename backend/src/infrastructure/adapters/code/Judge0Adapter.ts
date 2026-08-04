import { injectable } from 'tsyringe';
import { env } from '../../../config/envConfig';
import type { ICodeExecutionService } from '../../../application/ports/code/ICodeExecutionService';
import { CodeExecutionResult, CodeExecutionStatus } from '../../../domain/types/CodeExecutionResult';
import type { Language } from '../../../domain/types/Language';
import { Judge0LanguageMap } from './Judge0LanguageMap';
import { Judge0Client } from './Judge0Client';

@injectable()
export class Judge0Adapter implements ICodeExecutionService {
  private readonly client = new Judge0Client();

  async execute(params: {
    sourceCode: string;
    language: Language;
    stdin?: string;
  }): Promise<CodeExecutionResult> {
    const languageId = Judge0LanguageMap[params.language];
    if (!languageId) {
      throw new Error(`Unsupported language mapping for: ${params.language}`);
    }

    try {
      const response = await this.client.submit({
        source_code: Buffer.from(params.sourceCode).toString('base64'),
        language_id: languageId,
        stdin: params.stdin ? Buffer.from(params.stdin).toString('base64') : undefined,
        cpu_time_limit: env.judge0CpuTimeLimit,
        memory_limit: env.judge0MemoryLimit,
        wall_time_limit: env.judge0WallTimeLimit,
        base64_encoded: true,
      });

      return {
        stdout: response.stdout ? Buffer.from(response.stdout, 'base64').toString() : null,
        stderr: response.stderr ? Buffer.from(response.stderr, 'base64').toString() : null,
        compileOutput: response.compile_output
          ? Buffer.from(response.compile_output, 'base64').toString()
          : null,
        status: this.mapJudge0Status(response.status.id),
        time: response.time,
        memory: response.memory,
      };
    } catch (error) {
      return {
        stdout: null,
        stderr: null,
        compileOutput: null,
        status: CodeExecutionStatus.INTERNAL_ERROR,
        time: null,
        memory: null,
      };
    }
  }

  private mapJudge0Status(id: number): CodeExecutionStatus {
    // Standard Judge0 status IDs
    switch (id) {
      case 3: return CodeExecutionStatus.ACCEPTED;
      case 6: return CodeExecutionStatus.COMPILATION_ERROR;
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12: return CodeExecutionStatus.RUNTIME_ERROR;
      case 5: return CodeExecutionStatus.TIME_LIMIT_EXCEEDED;
      case 4: return CodeExecutionStatus.MEMORY_LIMIT_EXCEEDED;
      case 13:
      case 14: return CodeExecutionStatus.INTERNAL_ERROR;
      default: return CodeExecutionStatus.UNKNOWN;
    }
  }
}
