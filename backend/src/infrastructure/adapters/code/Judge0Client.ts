import axios from 'axios';
import { env } from '../../../config/envConfig';

export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string | undefined;
  cpu_time_limit: number;
  memory_limit: number;
  wall_time_limit: number;
  base64_encoded: boolean;
}

export interface Judge0SubmissionResponse {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

export class Judge0Client {
  private readonly baseUrl = env.judge0Url;
  private readonly headers = {
    'Content-Type': 'application/json',
    ...(env.judge0AuthToken ? { 'X-Auth-Token': env.judge0AuthToken } : {}),
  };

  async submit(data: Judge0SubmissionRequest): Promise<Judge0SubmissionResponse> {
    const response = await axios.post<Judge0SubmissionResponse>(
      `${this.baseUrl}/submissions`,
      data,
      {
        params: { wait: true, base64_encoded: true },
        headers: this.headers,
        timeout: 30_000,
      }
    );
    return response.data;
  }
}
