import { Header } from "../../components/layout/Header";

export default function DocumentQnA() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[rgb(0,0,0)] mb-6">
          Secure Document Question & Answering
        </h1>
        <div className="prose prose-lg">
          <p className="text-[rgb(107,114,128)]">
            PromptLab lets you ask natural language questions about your private
            PDF and text documents with complete privacy.
          </p>

          <h2 className="text-2xl font-semibold text-[rgb(0,0,0)] mt-8 mb-4">
            How It Works
          </h2>
          <ul className="text-[rgb(107,114,128)] space-y-2">
            <li>Upload your confidential documents (PDF, TXT)</li>
            <li>Ask questions in natural language</li>
            <li>Receive answers with exact source citations</li>
            <li>Your documents stay encrypted and private</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[rgb(0,0,0)] mt-8 mb-4">
            Professional Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <h3 className="font-semibold text-[rgb(0,0,0)] mb-2">
                Legal Professionals
              </h3>
              <p className="text-[rgb(107,114,128)] text-sm">
                Analyze contracts, case law, and legal documents with AI
                assistance while maintaining client confidentiality.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[rgb(0,0,0)] mb-2">
                Researchers
              </h3>
              <p className="text-[rgb(107,114,128)] text-sm">
                Extract insights from academic papers, research documents, and
                technical reports securely.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[rgb(0,0,0)] mb-2">
                Business Analysts
              </h3>
              <p className="text-[rgb(107,114,128)] text-sm">
                Analyze reports, meeting notes, and business documents with
                AI-powered insights.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
