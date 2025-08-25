import React from 'react';
import { Clock } from 'lucide-react';

const FinanceDashboard: React.FC = () => {
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace('Rp', '');
  };

  const cashflowData = [
    { day: 'Senin', masuk: 58, keluar: 46 },
    { day: 'Selasa', masuk: 74, keluar: 50 },
    { day: 'Rabu', masuk: 91, keluar: 92 },
    { day: 'Kamis', masuk: 47, keluar: 47 },
    { day: 'Jumat', masuk: 87, keluar: 87 },
    { day: 'Sabtu', masuk: 20, keluar: 20 },
    { day: 'Minggu', masuk: 16, keluar: 15 },
  ];

  const projectProfitLoss = [
    { project: 'Pro 1', laba: 100_000_000, rugi: 10_000_000 },
    { project: 'Pro 2', laba: 110_000_000, rugi: 10_000_000 },
    { project: 'Pro 3', laba: 120_000_000, rugi: 10_000_000 },
    { project: 'Pro 4', laba: 130_000_000, rugi: 10_000_000 },
    { project: 'Pro 5', laba: 140_000_000, rugi: 10_000_000 },
    { project: 'Pro 6', laba: 150_000_000, rugi: 10_000_000 },
    { project: 'Pro 7', laba: 160_000_000, rugi: 10_000_000 },
  ];

  const paymentMapping = [
    { label: 'Senin Pending', color: 'bg-yellow-500' },
    { label: 'Selasa Selesai', color: 'bg-green-500' },
    { label: 'Rabu Gagal', color: 'bg-red-500' },
    { label: 'Kamis Selesai', color: 'bg-green-500' },
    { label: 'Jumat Selesai', color: 'bg-green-500' },
    { label: 'Sabtu Pending', color: 'bg-yellow-500' },
    { label: 'Minggu Selesai', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                FINANCE DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-red-500 text-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300">
            <p className="text-lg font-medium mb-2">Profit</p>
            <p className="text-4xl font-bold">{formatCurrency(13_439_401_562)}</p>
          </div>
          <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300">
            <p className="text-lg font-medium mb-2">Sales</p>
            <p className="text-4xl font-bold">{formatCurrency(17_840_128_851)}</p>
          </div>
          <div className="bg-green-600 text-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300">
            <p className="text-lg font-medium mb-2">Main Profit</p>
            <p className="text-4xl font-bold">{formatCurrency(13_439_401_562)}</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300">
            <p className="text-lg font-medium mb-2">Gross Profit</p>
            <p className="text-4xl font-bold">{formatCurrency(17_840_128_851)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cashflow Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Cashflow</h3>
            <div className="flex justify-end space-x-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                <span>Masuk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-400 rounded-sm"></div>
                <span>Keluar</span>
              </div>
            </div>
            <div className="relative h-80">
              {/* Y-axis grid lines */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value, index) => (
                <div
                  key={index}
                  className={`absolute left-0 right-0 border-t border-gray-200 ${index === 0 ? 'bottom-0' : ''}`}
                  style={{ bottom: `${value}%`, height: '1px' }}
                >
                  <span className="absolute -left-8 text-xs text-gray-500 -translate-y-1/2">{value}</span>
                </div>
              ))}
              <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-full pt-8">
                {cashflowData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center h-full justify-end px-2">
                    <div className="flex h-full items-end space-x-1">
                      <div
                        className="w-6 bg-blue-400 rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
                        style={{ height: `${data.masuk}%` }}
                      ></div>
                      <div
                        className="w-6 bg-pink-400 rounded-t-md transition-all duration-700 ease-out hover:opacity-80"
                        style={{ height: `${data.keluar}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Laba Rugi Per Project Table */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Laba Rugi Per Project</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proyek
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Laba
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rugi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectProfitLoss.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(item.laba)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(item.rugi)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mapping Pembayaran Legend */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Mapping Pembayaran</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {paymentMapping.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
