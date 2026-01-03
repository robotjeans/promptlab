import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { UploadArea } from "../components/dashboard/UploadArea";
import { DocumentCard } from "../components/dashboard/DocumentCard";
import { useDocuments } from "../hooks/useDocument";

export default function Dashboard() {
  const { documents, loading, error } = useDocuments();

  const handleDocumentClick = (documentId: string) => {
    // Navigate to document detail page (implement later)
    // For now, just log or do nothing
    console.log("View document:", documentId);
    // TODO: Navigate to /documents/:id
  };

  const handleUploadSuccess = () => {
    console.log("Document uploaded successfully");
  };

  return (
    <div className="min-h-screen bg-[rgb(238,243,251)]">
      <Header showAuthButtons={true} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[rgb(0,0,0)] mb-2">
            Document Library
          </h1>
          <p className="text-[rgb(107,114,128)]">
            Upload and manage your private documents
          </p>
        </div>

        <div className="mb-8">
          <UploadArea onUploadSuccess={handleUploadSuccess} />
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(237,116,90)]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[rgb(238,243,251)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[rgb(107,114,128)]"
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
              <h3 className="font-medium text-[rgb(0,0,0)] mb-2">
                No documents yet
              </h3>
              <p className="text-[rgb(107,114,128)] text-sm">
                Upload your first document to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => handleDocumentClick(document.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
