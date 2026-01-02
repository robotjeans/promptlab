import { apiClient } from "./client";
import type { QueryResponse } from "./types";

export const queryApi = {
  async query(file: File, question: string): Promise<QueryResponse> {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("question", question);

    const { data } = await apiClient.post<QueryResponse>("/query", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  /**
   * clean up old documents
   */
  async cleanup(
    olderThanDays?: number
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.delete("/query/cleanup", {
      data: { olderThanDays },
    });
    return data;
  },
};
