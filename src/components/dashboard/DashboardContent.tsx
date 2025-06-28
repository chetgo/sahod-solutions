'use client';

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800">Employees</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800">Active Payroll</h3>
            <p className="text-2xl font-bold text-green-600">₱0</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800">Pending Tasks</h3>
            <p className="text-2xl font-bold text-yellow-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}