import { useDocuments } from "../../hooks/useDocument";
import type { Document } from "../../types/document";

interface DocumentCardProps {
  document: Document;
  onClick?: () => void;
}

export const DocumentCard = ({ document, onClick }: DocumentCardProps) => {
  const { deleteDocument } = useDocuments();

  const getDocumentIcon = () => {
    if (document.status === "processing") {
      return (
        <div className="w-10 h-10 bg-[rgb(238,243,251)] rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[rgb(94,145,226)]"></div>
        </div>
      );
    }

    const iconColor =
      document.type === "pdf" ? "text-red-500" : "text-blue-500";

    return (
      <div className="w-10 h-10 bg-[rgb(238,243,251)] rounded-lg flex items-center justify-center">
        <svg
          className={`w-6 h-6 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(document.id);
    }
  };

  const getStatusText = () => {
    switch (document.status) {
      case "processing":
        return "Processing...";
      case "error":
        return "Error processing";
      case "ready":
        return "Ready";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (document.status) {
      case "processing":
        return "text-[rgb(94,145,226)]";
      case "error":
        return "text-red-600";
      case "ready":
        return "text-green-600";
      default:
        return "text-[rgb(107,114,128)]";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-[rgb(238,243,251)] p-4 hover:shadow-md transition-shadow cursor-pointer ${
        onClick ? "hover:border-[rgb(94,145,226)]" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getDocumentIcon()}
          <div className="flex-1 min-w-0">
            <h3
              className="font-medium text-[rgb(0,0,0)] truncate"
              title={document.name}
            >
              {document.name}
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xs text-[rgb(107,114,128)]">
                {formatFileSize(document.size)}
              </span>
              <span className={`text-xs font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <p className="text-xs text-[rgb(107,114,128)] mt-1">
              {new Date(document.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="text-[rgb(107,114,128)] hover:text-red-600 transition-colors p-1"
          aria-label="Delete document"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
