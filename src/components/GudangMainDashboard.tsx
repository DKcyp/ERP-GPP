import React from 'react';
import { Clock } from 'lucide-react';

const GudangMainDashboard: React.FC = () => {
  // Mock data for the table
  const tableData = [
    { no: 1, namaBarang: 'Helm', soTurunan: 'SO001.23', zona: 'Zona 3', jumlahBarang: 808, status: 'Mob' },
    { no: 2, namaBarang: 'Carabinder', soTurunan: 'SO002.45', zona: 'Zona 5', jumlahBarang: 505, status: 'On Duty' },
    { no: 3, namaBarang: 'Harness', soTurunan: 'SO009.12', zona: 'Zona 7', jumlahBarang: 911, status: 'Demob' },
  ];

  // Mock data for the bar chart
  const chartData = [
    { month: 'January', value: 100 },
    { month: 'February', value: 115 },
    { month: 'March', value: 125 },
    { month: 'April', value: 135 },
    { month: 'May', value: 140 },
    { month: 'June', value: 150 },
    { month: 'July', value: 160 },
    { month: 'August', value: 170 },
    { month: 'September', value: 180 },
    { month: 'October', value: 190 },
    { month: 'November', value: 200 },
    { month: 'December', value: 210 },
  ];

  // Mock data for detail biaya table
  const detailBiayaData = [
    { bulan: 'January', totalBiaya: '100.000.000', selisih: '-' },
    { bulan: 'February', totalBiaya: '150.000.000', selisih: '70.000.000' },
    { bulan: 'March', totalBiaya: '200.000.000', selisih: '120.000.000' },
    { bulan: 'April', totalBiaya: '250.000.000', selisih: '180.000.000' },
    { bulan: 'May', totalBiaya: '300.000.000', selisih: '250.000.000' },
  ];

  const maxChartValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING BARANG UTAMA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Gudang</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Daftar Barang Utama</span>
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
        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar Barang Utama</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-r border-gray-200">
                    Posisi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Barang
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200"></th>
                  <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200"></th>
                  <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200">
                    SO Turunan
                  </th>
                  <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200">
                    Zona
                  </th>
                  <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200"></th>
                  <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-200"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.namaBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.soTurunan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.zona}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.jumlahBarang}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Mob' ? 'bg-green-100 text-green-800' :
                        item.status === 'On Duty' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
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

        {/* Chart and Detail Biaya Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Monthly Stock Overview</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between h-full pr-2 text-xs text-gray-500">
                {Array.from({ length: 6 }).map((_, i) => {
                  const label = (200 - i * 40); // 200, 160, 120, 80, 40, 0
                  return <span key={i}>{label}</span>;
                })}
              </div>
              {/* Chart bars */}
              <div className="flex flex-1 h-full items-end justify-around space-x-2 border-l border-b border-gray-200 pl-2">
                {chartData.map((item, index) => (
                  <div key={item.month} className="flex flex-col items-center space-y-1 h-full justify-end">
                    <div
                      className={`w-8 bg-purple-500 rounded-t-lg transition-all duration-1000 ease-out hover:opacity-80`}
                      style={{ height: `${(item.value / maxChartValue) * 100}%` }} // Scale height based on max value
                    ></div>
                    <span className="text-xs text-gray-600 font-medium rotate-45 origin-bottom-left">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Cards and Detail Biaya */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
            {/* Summary Cards */}
            <div className="space-y-4">
              <div className="bg-blue-600 text-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Biaya</p>
                  <p className="text-4xl font-bold">310</p>
                </div>
              </div>
              <div className="bg-green-600 text-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Bulan Ini</p>
                  <p className="text-4xl font-bold">210</p>
                </div>
              </div>
              <div className="bg-red-600 text-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Bulan Lalu</p>
                  <p className="text-4xl font-bold">210</p>
                </div>
              </div>
            </div>

            {/* Detail Biaya Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Detail Biaya</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bulan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Biaya
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Selisih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {detailBiayaData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.bulan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.totalBiaya}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.selisih}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GudangMainDashboard;
