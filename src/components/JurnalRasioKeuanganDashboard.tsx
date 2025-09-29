import React, { useState } from 'react';
import { Clock, FileSpreadsheet, FileDown, FileText } from 'lucide-react';

interface RasioData {
  kategori: string;
  deskripsi: string;
  januari: number;
  februari: number;
  maret: number;
  april: number;
  mei: number;
  juni: number;
}

const JurnalRasioKeuanganDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const rasioData: RasioData[] = [
    {
      kategori: 'Current Ratio (Aset Lancar / Hutang Lancar)',
      deskripsi: 'Menunjukkan perbandingan aset lancar dengan hutang lancar\nSemakin tinggi semakin baik likuiditasnya',
      januari: 1,
      februari: 1,
      maret: 1,
      april: 1,
      mei: 1,
      juni: 1,
    },
    {
      kategori: 'Working Capital / Modal Kerja (Aset Lancar - Hutang Lancar)',
      deskripsi: 'Mengukur modal kerja bersih, perlu dibandingkan per tahun\nSemakin besar semakin baik',
      januari: 6841572030,
      februari: 6841572030,
      maret: 6841572030,
      april: 6841572030,
      mei: 6841572030,
      juni: 6841572030,
    },
    {
      kategori: 'Assets-to-Equity Ratio (Total Assets / Modal)',
      deskripsi: 'Mengukur total aset terhadap modal',
      januari: 1,
      februari: 1,
      maret: 1,
      april: 1,
      mei: 1,
      juni: 1,
    },
    {
      kategori: 'Debt Ratio (Total Kewajiban / Total Assets)',
      deskripsi: 'Mengukur besarnya dana yang berasal dari utang\nSemakin kecil rasionya, maka semakin aman (solvable)',
      januari: 0,
      februari: 0,
      maret: 0,
      april: 0,
      mei: 0,
      juni: 0,
    },
    {
      kategori: 'Debt-to-Equity Ratio (Total Hutang/ Modal)',
      deskripsi: 'Mengukur utang yang dimiliki dengan modal sendiri\nSemakin kecil utang akan semakin baik dan aman\nRasio wajar menurut pajak 1:4',
      januari: 2,
      februari: 2,
      maret: 2,
      april: 2,
      mei: 2,
      juni: 2,
    },
  ];

  const formatNumber = (num: number) => {
    // Format sebagai mata uang Rupiah untuk angka besar
    if (num >= 1000000) {
      return `Rp ${num.toLocaleString('id-ID')}`;
    }
    return num.toString();
  };

  const getRowColor = (index: number) => {
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                JURNAL RASIO KEUANGAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Jurnal</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Jurnal Rasio</span>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 text-sm shadow-md">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 text-sm shadow-md">
                <FileDown className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Rasio Keuangan Tahun {selectedYear}</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    RASIO KEUANGAN
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    Januari
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    Februari
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    Maret
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    April
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider border-r border-green-600">
                    Mei
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                    Juni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rasioData.map((item, index) => (
                  <tr key={index} className={`${getRowColor(index)} hover:bg-blue-50 transition-colors`}>
                    <td className="px-4 py-4 border-r border-gray-200">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {item.kategori}
                        </div>
                        <div className="text-xs text-gray-600 whitespace-pre-line">
                          {item.deskripsi}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {item.januari >= 1000000 ? formatNumber(item.januari) : item.januari}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {item.februari >= 1000000 ? formatNumber(item.februari) : item.februari}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {item.maret >= 1000000 ? formatNumber(item.maret) : item.maret}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {item.april >= 1000000 ? formatNumber(item.april) : item.april}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200 whitespace-nowrap">
                      {item.mei >= 1000000 ? formatNumber(item.mei) : item.mei}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-gray-900 whitespace-nowrap">
                      {item.juni >= 1000000 ? formatNumber(item.juni) : item.juni}
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

export default JurnalRasioKeuanganDashboard;
