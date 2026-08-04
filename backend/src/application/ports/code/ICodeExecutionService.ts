import type { CodeExecutionResult } from '../../../domain/types/CodeExecutionResult';
import type { Language } from '../../../domain/types/Language';

export interface ICodeExecutionService {
  execute(params: {
    sourceCode: string;
    language: Language;
    stdin?: string | undefined;
  }): Promise<CodeExecutionResult>;
}
