export enum CodeExecutionStatus {
  ACCEPTED = 'Accepted',
  COMPILATION_ERROR = 'Compilation Error',
  RUNTIME_ERROR = 'Runtime Error',
  TIME_LIMIT_EXCEEDED = 'Time Limit Exceeded',
  MEMORY_LIMIT_EXCEEDED = 'Memory Limit Exceeded',
  INTERNAL_ERROR = 'Internal Error',
  UNKNOWN = 'Unknown Error'
}

export interface CodeExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  status: CodeExecutionStatus;
  time: string | null;
  memory: number | null;
}
