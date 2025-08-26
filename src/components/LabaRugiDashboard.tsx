import React, { useState } from 'react';
import { Clock, Search, Filter, FileText, FileSpreadsheet, FileDown } from 'lucide-react';

const LabaRugiDashboard: React.FC = () => {
  const today = new Date();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('Juli 2025'); // Default filter

  // Helper function to format numbers as per ID-ID locale (e.g., 123.456.789)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Dummy Data for Laba Rugi, structured to match the image
  const data = [
    {
      id: 1, no: '1', uraian: 'PENDAPATAN', level: 0, isBold: true,
      juli: { real: 53827055153, rkap: 40421691158, percentage: 133 },
      sdJuli: { real: 330468485387, rkap: 279262762302, percentage: 118 },
      rkapTotal: { rkap: 472826071460, percentage: 70 }
    },
    {
      id: 2, no: '2', uraian: 'BEBAN POKOK PENJUALAN', level: 0, isBold: true,
      juli: { real: -49936552991, rkap: -37586202233, percentage: 133 },
      sdJuli: { real: -306124253457, rkap: -259577708653, percentage: 118 },
      rkapTotal: { rkap: -439746702061, percentage: 70 }
    },
    {
      id: 3, no: '', uraian: 'Laba Kotor', level: 1, isSummary: true, isBold: true,
      juli: { real: 3890502162, rkap: 2763104955, percentage: 141 },
      sdJuli: { real: 24344031930, rkap: 19685053649, percentage: 124 },
      rkapTotal: { rkap: 213248362807, percentage: 11 }
    },
    {
      id: 4, no: '3', uraian: 'Beban Usaha', level: 0, isBold: true,
      juli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      sdJuli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      rkapTotal: { rkap: 0, percentage: 0 } // Sum of sub-items
    },
    {
      id: 5, no: '', uraian: '- BEBAN PENJUALAN', level: 1,
      juli: { real: -95185450, rkap: -40000000, percentage: 238 },
      sdJuli: { real: -251735471, rkap: -231300000, percentage: 109 },
      rkapTotal: { rkap: -334600000, percentage: 75 }
    },
    {
      id: 6, no: '', uraian: '- BEBAN KARYAWAN', level: 1,
      juli: { real: -942832346, rkap: -901911431, percentage: 105 },
      sdJuli: { real: -7210165594, rkap: -6512219936, percentage: 111 },
      rkapTotal: { rkap: -10983826441, percentage: 66 }
    },
    {
      id: 7, no: '', uraian: '- BEBAN UMUM KANTOR', level: 1,
      juli: { real: -547148449, rkap: -451740834, percentage: 121 },
      sdJuli: { real: 2797170554, rkap: -3346493838, percentage: 84 },
      rkapTotal: { rkap: -4943194008, percentage: 57 }
    },
    {
      id: 8, no: '', uraian: '- BEBAN PENYUSUTAN', level: 1,
      juli: { real: -106033033, rkap: -99698453, percentage: 106 },
      sdJuli: { real: -745126565, rkap: -662223408, percentage: 113 },
      rkapTotal: { rkap: -1163285291, percentage: 64 }
    },
    {
      id: 9, no: '', uraian: 'Jumlah Beban Usaha', level: 1, isSummary: true, isBold: true,
      juli: { real: -1691199278, rkap: -1493350718, percentage: 113 },
      sdJuli: { real: -11004198184, rkap: -10752237182, percentage: 102 },
      rkapTotal: { rkap: -17424905746, percentage: 7 }
    },
    {
      id: 10, no: '', uraian: 'Laba/(rugi) Usaha', level: 1, isSummary: true, isBold: true,
      juli: { real: 2199305884, rkap: 1269754237, percentage: 173 },
      sdJuli: { real: 13339833749, rkap: 8932816467, percentage: 149 },
      rkapTotal: { rkap: 195823457067, percentage: 10 }
    },
    {
      id: 11, no: '4', uraian: 'Pendapatan & Beban Lain-lain', level: 0, isBold: true,
      juli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      sdJuli: { real: 0, rkap: 0, percentage: 0 }, // Sum of sub-items
      rkapTotal: { rkap: 0, percentage: 0 } // Sum of sub-items
    },
    {
      id: 12, no: '', uraian: '- PENDAPATAN / BEBAN DILUAR USAHA', level: 1,
      juli: { real: 34613527, rkap: 19500000, percentage: 178 },
      sdJuli: { real: 152960663, rkap: 136500000, percentage: 112 },
      rkapTotal: { rkap: 234000000, percentage: 65 }
    },
    {
      id: 13, no: '', uraian: '- BEBAN DILUAR USAHA', level: 1,
      juli: { real: -47275198, rkap: -47022177, percentage: 101 },
      sdJuli: { real: -386641406, rkap: -353740527, percentage: 109 },
      rkapTotal: { rkap: -623374723, percentage: 62 }
    },
    {
      id: 14, no: '', uraian: '- BEBAN BUNGA HG', level: 1,
      juli: { real: -21676982, rkap: -5657473, percentage: 383 },
      sdJuli: { real: -109810801, rkap: -24585288, percentage: 58 },
      rkapTotal: { rkap: -59108399, percentage: 'INF' } // 'INF' as per image
    },
    {
      id: 15, no: '', uraian: '- BEBAN BUNGA PINJAMAN', level: 1,
      juli: { real: -478459837, rkap: -481666666, percentage: 99 },
      sdJuli: { real: -3679577437, rkap: -3824999998, percentage: 96 },
      rkapTotal: { rkap: -6233333328, percentage: 59 }
    },
    {
      id: 16, no: '', uraian: 'Jumlah Beban Lain-lain', level: 1, isSummary: true, isBold: true,
      juli: { real: -512798490, rkap: -514846316, percentage: 100 },
      sdJuli: { real: -4023068981, rkap: -4066825813, percentage: 99 },
      rkapTotal: { rkap: -6563599452, percentage: 61 }
    },
    {
      id: 17, no: '5', uraian: 'Laba Sebelum Pajak', level: 0, isBold: true,
      juli: { real: 1686507394, rkap: 754907921, percentage: 223 },
      sdJuli: { real: 9316764768, rkap: 4865990654, percentage: 191 },
      rkapTotal: { rkap: 189259857615, percentage: 5 }
    },
    {
      id: 18, no: '6', uraian: 'Estimasi Pajak', level: 0, isBold: true,
      juli: { real: -539682366, rkap: -241570535, percentage: 223 },
      sdJuli: { real: -2981364726, rkap: -1557117009, percentage: 191 },
      rkapTotal: { rkap: -60563154437, percentage: 7 }
    },
    {
      id: 19, no: '7', uraian: 'Laba Setelah Pajak', level: 0, isBold: true,
      juli: { real: 1146825028, rkap: 513337386, percentage: 223 },
      sdJuli: { real: 6335400042, rkap: 3308873645, percentage: 191 },
      rkapTotal: { rkap: 128696703178, percentage: 5 }
    },
  ];

  // Filtered data based on search term (uraian)
  const filteredData = data.filter(item =>
    item.uraian.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    alert(`Mengekspor data Laba Rugi ke format ${type}... (Fungsionalitas ini adalah placeholder)`);
    // Di aplikasi nyata, Anda akan mengimplementasikan logika ekspor yang sebenarnya di sini.
    // Ini mungkin melibatkan:
    // 1. Memformat data untuk format yang dipilih.
    // 2. Menggunakan pustaka seperti 'xlsx' untuk Excel, 'papaparse' untuk CSV, atau 'jspdf' untuk PDF.
    // 3. Memicu unduhan file.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN LABA RUGI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laba Rugi</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar: Search, Filter, Export */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari uraian..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
            >
              <option value="Juli 2025">Juli 2025</option>
              <option value="Juni 2025">Juni 2025</option>
              <option value="Mei 2025">Mei 2025</option>
              {/* Tambahkan periode lain sesuai kebutuhan */}
            </select>
          </div>

          <div className="flex space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FileText className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FileDown className="h-4 w-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Laba Rugi Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">No</th>
                  <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">URAIAN</th>
                  <th colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Juli 2025</th>
                  <th colSpan={3} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">S.D Juli 2025</th>
                  <th colSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">RKAP</th>
                </tr>
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">REAL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">RKAP</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">%</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">REAL</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">RKAP</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">%</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">RKAP</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className={`${row.isSummary ? 'bg-blue-50 font-semibold text-blue-800' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      {row.no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      <span style={{ paddingLeft: `${row.level * 1.5}rem` }} className={`${row.isBold ? 'font-bold' : ''}`}>
                        {row.uraian}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.juli.real)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.juli.rkap)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {typeof row.juli.percentage === 'number' ? `${row.juli.percentage}%` : row.juli.percentage}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.sdJuli.real)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.sdJuli.rkap)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {typeof row.sdJuli.percentage === 'number' ? `${row.sdJuli.percentage}%` : row.sdJuli.percentage}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.rkapTotal.rkap)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">
                      {typeof row.rkapTotal.percentage === 'number' ? `${row.rkapTotal.percentage}%` : row.rkapTotal.percentage}
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

export default LabaRugiDashboard;
