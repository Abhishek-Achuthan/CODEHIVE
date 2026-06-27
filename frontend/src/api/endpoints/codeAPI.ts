import apiClient from '../apiClient';

export enum Language {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  C = 'c',
  GO = 'go',
  RUST = 'rust',
}

export interface CodeExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  status: string;
  time: string | null;
  memory: number | null;
}

export const executeCode = (payload: {
  roomId: string;
  sourceCode: string;
  language: Language;
  stdin?: string;
}) => apiClient.post<{ success: boolean; result: CodeExecutionResult }>('/code/execute', payload);
