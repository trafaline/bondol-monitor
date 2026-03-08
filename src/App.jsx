import { useState } from 'react'

function App() {
  // Contoh data dummy untuk tabel monitoring
  const [data] = useState([
    { id: 1, service: "Auth API", status: "Active", latency: "120ms", lastUpdate: "Just now" },
    { id: 2, service: "Database Cluster", status: "Active", latency: "45ms", lastUpdate: "2 mins ago" },
    { id: 3, service: "Storage Server", status: "Warning", latency: "850ms", lastUpdate: "5 mins ago" },
    { id: 4, service: "Payment Gateway", status: "Offline", latency: "-", lastUpdate: "10 mins ago" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Tabel */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Bondol Monitor Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitoring status layanan TC Service secara real-time.</p>
        </div>

        {/* Container Tabel */}
        <div className="overflow-hidden bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Latency</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {item.latency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastUpdate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-right">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Refresh Data &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;