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
export default async function LoginPage({ params }: PageProps) {
  const { subdomain } = await params;
  
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Login for {subdomain}</h1>
          <p>Login page working for subdomain: <strong>{subdomain}</strong></p>
        </div>
      </div>
    </div>
  );
}