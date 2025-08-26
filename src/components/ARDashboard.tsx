import React from 'react';
import { Clock, DollarSign, Banknote, Calendar, TrendingUp, TrendingDown, ReceiptText, BarChart2 } from 'lucide-react';

const ARDashboard: React.FC = () => {
  const dummyCashFlow = 'Rp 180.000.000';
  const dummyBankBalance = 'Rp 350.000.000';
  const dummyMappingReceipts = 15; // Number of receipts mapped this week
  const dummyIncomingProjection = 'Rp 150.000.000';
  const dummyOutgoingProjection = 'Rp 90.000.000';

  const dummyTableData = [
    { id: 1, date: '2024-07-01', customer: 'PT Global', description: 'Penjualan Produk A', amount: 'Rp 20.000.000', status: 'Outstanding' },
    { id: 2, date: '2024-07-02', customer: 'CV Maju', description: 'Jasa Instalasi', amount: 'Rp 8.000.000', status: 'Paid' },
    { id: 3, date: '2024-07-03', customer: 'UD Sejahtera', description: 'Sewa Alat Berat', amount: 'Rp 5.000.000', status: 'Outstanding' },
    { id: 4, date: '2024-07-04', customer: 'PT Abadi', description: 'Langganan Layanan', amount: 'Rp 10.000.000', status: 'Paid' },
    { id: 5, date: '2024-07-05', customer: 'PT Sentosa', description: 'Penjualan Produk B', amount: 'Rp 1.800.000', status: 'Outstanding' },
    { id: 6, date: '2024-07-06', customer: 'CV Cepat', description: 'Perbaikan Sistem', amount: 'Rp 6.000.000', status: 'Paid' },
    { id: 7, date: '2024-07-07', customer: 'PT Indah', description: 'Proyek Pengembangan', amount: 'Rp 70.000.000', status: 'Outstanding' },
    { id: 8, date: '2024-07-08', customer: 'UD Makmur', description: 'Biaya Konsultasi', amount: 'Rp 1.200.000', status: 'Paid' },
    { id: 9, date: '2024-07-09', customer: 'PT Jaya', description: 'Pajak Penjualan', amount: 'Rp 7.000.000', status: 'Outstanding' },
    { id: 10, date: '2024-07-10', customer: 'CV Harmoni', description: 'Pelatihan Karyawan', amount: 'Rp 3.000.000', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                AR DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">AR</span>
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
                <p className="text-sm text-green-600 font-medium">+15% from last month</p>
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
                <ReceiptText className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Mapping Penerimaan (1 Minggu)</p>
                <p className="text-3xl font-bold text-gray-900">{dummyMappingReceipts}</p>
                <p className="text-sm text-gray-600 font-medium">Receipts mapped</p>
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

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Cash Flow Trend</h3>
          <div className="h-64 flex items-end justify-center space-x-4">
            {[
              { label: 'Week 1', incoming: 150, outgoing: 70, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
              { label: 'Week 2', incoming: 180, outgoing: 80, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
              { label: 'Week 3', incoming: 130, outgoing: 100, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
              { label: 'Week 4', incoming: 160, outgoing: 60, colorIncoming: 'bg-green-500', colorOutgoing: 'bg-red-500' },
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

        {/* Dummy Mapping Penerimaan Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Receipts Mapping</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Paid' ? 'bg-green-100 text-green-800' :
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

export default ARDashboard;
