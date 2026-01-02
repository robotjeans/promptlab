import { Header } from "../../components/layout/Header";

export default function Security() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[rgb(0,0,0)] mb-6">
          Security & Privacy
        </h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[rgb(0,0,0)] mb-3">
              End-to-End Encryption
            </h2>
            <p className="text-[rgb(107,114,128)]">
              All your documents are encrypted both in transit and at rest using
              industry-standard encryption protocols.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[rgb(0,0,0)] mb-3">
              Zero Data Sharing
            </h2>
            <p className="text-[rgb(107,114,128)]">
              We never access, store, or share your document content with third
              parties. Your data remains yours.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[rgb(0,0,0)] mb-3">
              No Training on Your Data
            </h2>
            <p className="text-[rgb(107,114,128)]">
              Your documents are never used to train or improve our AI models.
              Privacy is built into our architecture.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[rgb(0,0,0)] mb-3">
              Secure Document Processing
            </h2>
            <p className="text-[rgb(107,114,128)]">
              Document processing happens in isolated environments with strict
              access controls and audit logging.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
