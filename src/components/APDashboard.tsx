import React from 'react';
import { Clock, BarChart2, Users, AlertTriangle, Calculator } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const APDashboard: React.FC = () => {
  // KPI dummy data (can be replaced with API data)
  const totalUtangUsaha = 1250000000; // Rp
  const jumlahVendorTerutang = 58; // vendors
  const totalUtangJatuhTempo = 320000000; // Rp

  // Aging Report dummy data
  const agingData = [
    { bucket: 'Belum jatuh tempo', nilai: 480_000_000 },
    { bucket: '1 - 30 hari', nilai: 260_000_000 },
    { bucket: '31 - 60 hari', nilai: 190_000_000 },
    { bucket: '61 - 90 hari', nilai: 110_000_000 },
    { bucket: '> 90 hari', nilai: 70_000_000 },
  ];

  // Trend Pembayaran 6 bulan terakhir
  const trendData = [
    { bulan: 'Apr', bayar: 120_000_000 },
    { bulan: 'Mei', bayar: 95_000_000 },
    { bulan: 'Jun', bayar: 140_000_000 },
    { bulan: 'Jul', bayar: 110_000_000 },
    { bulan: 'Agu', bayar: 175_000_000 },
    { bulan: 'Sep', bayar: 130_000_000 },
  ];

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
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Utang Usaha (terupdate)</p>
                <p className="text-3xl font-bold text-gray-900">Rp {totalUtangUsaha.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Jumlah Vendor Terutang</p>
                <p className="text-3xl font-bold text-gray-900">{jumlahVendorTerutang}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Utang Usaha Jatuh Tempo</p>
                <p className="text-3xl font-bold text-gray-900">Rp {totalUtangJatuhTempo.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Aging Report Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Aging Report (Umur Utang)</h3>
              <BarChart2 className="h-5 w-5 text-gray-500" />
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `Rp ${v / 1_000_000}jt`} />
                  <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Nilai']} />
                  <Legend />
                  <Bar dataKey="nilai" name="Nilai" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-gray-600 mt-3">
              Bucket: Belum jatuh tempo, 1 - 30 hari, 31 - 60 hari, 61 - 90 hari, &gt; 90 hari
            </div>
          </div>

          {/* Trend Pembayaran Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Trend Pembayaran Utang Usaha Bulanan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Menunjukkan nilai pembayaran ke vendor selama 6 bulan terakhir.</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `Rp ${v / 1_000_000}jt`} />
                  <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pembayaran']} />
                  <Legend />
                  <Line type="monotone" dataKey="bayar" name="Pembayaran" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
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
