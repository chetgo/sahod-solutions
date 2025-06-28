interface PageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { subdomain: 'sampras' },
    { subdomain: 'test-company' },
    { subdomain: 'demo' },
  ];
}

// Keep your existing component code...
export default async function CompanyPage({ params }: PageProps) {
  const { subdomain } = await params;
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-100 border border-green-400 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-green-800">🎉 Company Route Works!</h1>
          <p className="text-lg mt-2">
            Subdomain: <strong className="text-green-600">{subdomain}</strong>
          </p>
          <div className="mt-4 space-x-4">
            <a href={`/dashboard`} className="bg-blue-500 text-white px-4 py-2 rounded">
              Dashboard
            </a>
            <a href={`/login`} className="bg-green-500 text-white px-4 py-2 rounded">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}