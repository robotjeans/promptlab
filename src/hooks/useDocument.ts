import { useState, useCallback } from "react";
import { queryApi, type QueryResponse } from "../lib/api";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<unknown[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (file: File, question: string) => {
    if (!question.trim()) throw new Error("Question cannot be empty");
    if (!file.name.match(/\.(pdf|txt)$/i))
      throw new Error("Only PDF or TXT files are allowed");
    if (file.size > 10 * 1024 * 1024)
      throw new Error("File size must be less than 10MB");

    setUploading(true);
    setError(null);

    try {
      const response: QueryResponse = await queryApi.query(file, question);

      // Add uploaded document to state
      setDocuments((prev) => [
        {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.name.endsWith(".pdf") ? "pdf" : "txt",
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: "processing",
        },
        ...prev,
      ]);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    documents,
    uploading,
    error,
    uploadDocument,
    setDocuments,
    setError,
  };
};
