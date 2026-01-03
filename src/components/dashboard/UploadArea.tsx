import { useState, useCallback } from "react";
import { useDocuments } from "../../hooks/useDocument";

interface UploadAreaProps {
  onUploadSuccess?: () => void;
}

export const UploadArea = ({ onUploadSuccess }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [question, setQuestion] = useState(""); // question input
  const { uploadDocument, uploading, error } = useDocuments();

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file) return;

      try {
        await uploadDocument(file, question);
        onUploadSuccess?.();
        setQuestion(""); // reset question
      } catch (err) {
        console.error(err);
      }
    },
    [uploadDocument, question, onUploadSuccess]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-[rgb(237,116,90)] bg-[rgb(237,249,242)]"
          : "border-[rgb(238,243,251)] bg-white"
      }`}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      {uploading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(237,116,90)] mb-4"></div>
          <p className="text-[rgb(107,114,128)]">Processing document...</p>
        </div>
      ) : (
        <>
          <h3 className="font-medium text-[rgb(0,0,0)] mb-2">
            Upload Document
          </h3>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(237,116,90)]"
          />
          <label className="inline-block bg-[rgb(237,116,90)] hover:bg-[rgb(221,89,66)] text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors">
            Choose File
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
                e.target.value = "";
              }}
            />
          </label>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

          <p className="text-xs text-[rgb(107,114,128)] mt-4">
            Max file size: 10MB • Supported: PDF, TXT
          </p>
        </>
      )}
    </div>
  );
};
