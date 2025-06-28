import { CompanyLayout } from '@/components/layouts/CompanyLayout';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

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
export default async function CompanyDashboard({ params }: PageProps) {
  const { subdomain } = await params;
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-100 border border-green-400 p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-bold text-green-800">🎉 Subdomain Routing Works!</h1>
          <p className="text-lg mt-2">
            Captured subdomain: <strong className="text-green-600">{subdomain}</strong>
          </p>
          <p className="text-sm text-green-700 mt-2">
            URL: {subdomain}.localhost:3000
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
          <ul className="space-y-2">
            <li>✅ Subdomain routing working</li>
            <li>🔄 Add middleware for subdomain extraction</li>
            <li>🔄 Create subdomain collection in Firebase</li>
            <li>🔄 Implement tenant resolution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}