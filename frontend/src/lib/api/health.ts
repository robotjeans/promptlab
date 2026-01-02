import { apiClient } from "./client";

interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
}

export const healthApi = {
  /**
   * Check API health
   */
  async check(): Promise<HealthResponse> {
    const { data } = await apiClient.get<HealthResponse>("/health");
    return data;
  },
};
