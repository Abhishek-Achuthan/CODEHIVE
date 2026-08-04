import { useState, useCallback } from 'react';
import { executeCode, Language } from '../../../api/endpoints/codeAPI';
import type { CodeExecutionResult } from '../../../api/endpoints/codeAPI';

export function useCodeExecution(roomId: string) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (sourceCode: string, language: Language, stdin?: string) => {
      setIsRunning(true);
      setError(null);
      setResult(null);
      try {
        const response = await executeCode({ roomId, sourceCode, language, stdin });
        setResult(response.data.result);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Execution failed');
      } finally {
        setIsRunning(false);
      }
    },
    [roomId],
  );

  return { run, isRunning, result, error };
}
