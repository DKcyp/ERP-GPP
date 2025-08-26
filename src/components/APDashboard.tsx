import React from 'react';
import { Clock, DollarSign, Banknote, Calendar, TrendingUp, TrendingDown, CreditCard, BarChart2 } from 'lucide-react';

const APDashboard: React.FC = () => {
  const dummyCashFlow = 'Rp 125.000.000';
  const dummyBankBalance = 'Rp 350.000.000';
  const dummyMappingPayments = 12; // Number of payments mapped this week
  const dummyIncomingProjection = 'Rp 80.000.000';
  const dummyOutgoingProjection = 'Rp 110.000.000';

  const dummyTableData = [
    { id: 1, date: '2024-07-01', vendor: 'PT ABC', description: 'Pembelian Bahan Baku', amount: 'Rp 15.000.000', status: 'Pending' },
    { id: 2, date: '2024-07-02', vendor: 'CV Jaya', description: 'Jasa Konsultan', amount: 'Rp 7.500.000', status: 'Approved' },
    { id: 3, date: '2024-07-03', vendor: 'UD Makmur', description: 'Sewa Peralatan', amount: 'Rp 3.000.000', status: 'Pending' },
    { id: 4, date: '2024-07-04', vendor: 'PT XYZ', description: 'Biaya Operasional', amount: 'Rp 10.000.000', status: 'Paid' },
    { id: 5, date: '2024-07-05', vendor: 'PT Sejahtera', description: 'Pembelian ATK', amount: 'Rp 1.200.000', status: 'Approved' },
    { id: 6, date: '2024-07-06', vendor: 'CV Bersama', description: 'Perbaikan Mesin', amount: 'Rp 4.500.000', status: 'Pending' },
    { id: 7, date: '2024-07-07', vendor: 'PT Indah', description: 'Gaji Karyawan', amount: 'Rp 50.000.000', status: 'Paid' },
    { id: 8, date: '2024-07-08', vendor: 'UD Sentosa', description: 'Transportasi', amount: 'Rp 800.000', status: 'Approved' },
    { id: 9, date: '2024-07-09', vendor: 'PT Global', description: 'Pajak Bulanan', amount: 'Rp 6.000.000', status: 'Pending' },
    { id: 10, date: '2024-07-10', vendor: 'CV Abadi', description: 'Pemasaran Digital', amount: 'Rp 2.500.000', status: 'Approved' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                AP DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AP</span>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Cash Flow (Net)</p>
                <p className="text-3xl font-bold text-gray-900">{dummyCashFlow}</p>
                <p className="text-sm text-green-600 font-medium">+10% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Banknote className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Saldo Bank</p>
                <p className="text-3xl font-bold text-gray-900">{dummyBankBalance}</p>
                <p className="text-sm text-green-600 font-medium">Stable</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Mapping Pembayaran (1 Minggu)</p>
                <p className="text-3xl font-bold text-gray-900">{dummyMappingPayments}</p>
                <p className="text-sm text-gray-600 font-medium">Payments mapped</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Proyeksi Uang Masuk & Keluar (1 Minggu)</p>
                <p className="text-xl font-bold text-gray-900">Masuk: {dummyIncomingProjection}</p>
                <p className="text-xl font-bold text-gray-900">Keluar: {dummyOutgoingProjection}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart and Multiple Button */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Cash Flow Trend</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <BarChart2 className="h-5 w-5" />
              <span>Multiple Actions</span>
            </button>
          </div>
          <div className="h-64 flex items-end justify-center space-x-4">
            {[
              { label: 'Week 1', incoming: 120, outgoing: 80, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
              { label: 'Week 2', incoming: 150, outgoing: 90, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
              { label: 'Week 3', incoming: 100, outgoing: 110, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
              { label: 'Week 4', incoming: 130, outgoing: 70, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="flex items-end h-48">
                  <div
                    className={`w-6 ${item.colorIncoming} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                    style={{ height: `${item.incoming * 1.5}px` }}
                  ></div>
                  <div
                    className={`w-6 ${item.colorOutgoing} rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80 ml-1`}
                    style={{ height: `${item.outgoing * 1.5}px` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-700">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Incoming</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Outgoing</span>
            </div>
          </div>
        </div>

        {/* Dummy Mapping Pembayaran Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Payments Mapping</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyTableData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        item.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APDashboard;
