import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Data for the line chart (Pajak Masukan vs Pajak Keluaran)
const lineChartData = [
  { name: 'Sep', 'Pajak Masukan': 60, 'Pajak Keluaran': 40 },
  { name: 'Okt', 'Pajak Masukan': 80, 'Pajak Keluaran': 55 },
  { name: 'Nov', 'Pajak Masukan': 70, 'Pajak Keluaran': 50 },
  { name: 'Des', 'Pajak Masukan': 95, 'Pajak Keluaran': 70 },
  { name: 'Jan', 'Pajak Masukan': 80, 'Pajak Keluaran': 60 },
  { name: 'Apr', 'Pajak Masukan': 110, 'Pajak Keluaran': 85 },
];

// Data for the pie chart (Komposisi Pajak)
const pieChartData = [
  { name: 'PPN', value: 98, color: '#3B82F6' }, // Blue
  { name: 'PPh 23', value: 1, color: '#60A5FA' }, // Lighter Blue
  { name: 'PPh 21', value: 1, color: '#93C5FD' }, // Even Lighter Blue
];

const TaxMainDashboard: React.FC = () => {
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Tax Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm text-gray-600 font-medium mb-2">Total Pajak Masukan</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(450000000)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm text-gray-600 font-medium mb-2">Total Pajak Keluaran</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(520000000)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm text-gray-600 font-medium mb-2">Saldo Pajak</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(70000000)}</p>
            <p className="text-xs text-red-600 font-medium mt-1">Harus Disetor</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <p className="text-sm text-gray-600 font-medium mb-2">Faktur Pajak</p>
            <p className="text-2xl font-bold text-gray-900">120</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pajak Masukan vs Pajak Keluaran Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pajak Masukan vs Pajak Keluaran</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={lineChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `Rp ${value} mi`} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => `Rp ${value} mi`}
                  labelFormatter={(label: string) => `Bulan: ${label}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                  itemStyle={{ color: '#4b5563' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Pajak Masukan" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Pajak Keluaran" stroke="#60A5FA" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Komposisi Pajak Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Komposisi Pajak</h3>
            <div className="relative w-full max-w-xs h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px' }}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    itemStyle={{ color: '#4b5563' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-xl font-bold text-gray-900">PPN</p>
                <p className="text-sm text-gray-600">98 %</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {pieChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                  <span className="text-sm text-gray-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daftar Transaksi Pajak */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Transaksi Pajak</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Faktur</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis/Pajak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pajak</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">010.002.33.08.000123</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Empty Tanggal as per image */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p className="font-medium text-gray-900">Pajak Keluaran</p>
                    <p className="text-xs text-gray-600">PT XYZ Inspector</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(100000000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(11000000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">Belum Lapor</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">020.003.23.08.00456</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td> {/* Empty Tanggal as per image */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <p className="font-medium text-gray-900">Pajak Masukan</p>
                    <p className="text-xs text-gray-600">PT ABC Vendor</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(50000000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(5500000)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">Sudah Lapor</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Alerts */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <p className="text-sm font-medium">Batas Pelaporan PPN Masa Agustus: 30 September 2025</p>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 mr-3" />
              <p className="text-sm font-medium">Ada 5 Faktur Pajak Keluaran Belum Dilaporkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxMainDashboard;
