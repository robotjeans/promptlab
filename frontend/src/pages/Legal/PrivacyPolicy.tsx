import { Header } from "../../components/layout/Header";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[rgb(0,0,0)] mb-6">
          Privacy Policy
        </h1>

        <div className="prose prose-lg">
          <p className="text-[rgb(107,114,128)]">
            Last updated: January 3, 2026
          </p>

          <h2 className="text-2xl font-semibold text-[rgb(0,0,0)] mt-8 mb-4">
            Your Privacy is Our Priority
          </h2>
          <p className="text-[rgb(107,114,128)]">
            At PromptLab, we understand that your documents contain sensitive
            and confidential information. We've built our platform with privacy
            as a foundational principle.
          </p>

          <h2 className="text-2xl font-semibold text-[rgb(0,0,0)] mt-8 mb-4">
            What We Don't Do
          </h2>
          <ul className="text-[rgb(107,114,128)] space-y-2">
            <li>We do not share your documents with third parties</li>
            <li>We do not use your documents to train AI models</li>
            <li>We do not sell or monetize your document content</li>
            <li>We do not retain your documents longer than necessary</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[rgb(0,0,0)] mt-8 mb-4">
            What We Do Collect
          </h2>
          <p className="text-[rgb(107,114,128)]">
            We collect minimal account information (email, username) for
            authentication purposes only. Your document content is processed
            securely and deleted according to our data retention policy.
          </p>
        </div>
      </main>
    </div>
  );
}
