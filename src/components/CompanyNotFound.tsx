// ========================================
// FILE: src/components/CompanyNotFound.tsx
// ========================================
export function CompanyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Company Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The company subdomain you're looking for doesn't exist or has been disabled.
        </p>
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
