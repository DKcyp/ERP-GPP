import React, { useState, useMemo } from 'react';
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

interface TaxData {
  bulan: string;
  monthIndex: number;
  hutangPajak: number;
  pphUnifikasi: number;
  pph22: number;
  pph23: number;
  pph4Ayat2: number;
  statusHutangPajak: 'paid' | 'unpaid';
  tanggalJatuhTempo: string;
}

const TaxDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  
  // Filter bulan: default 3 bulan terakhir
  const [filterMonthStart, setFilterMonthStart] = useState<number>(Math.max(0, currentMonth - 2));
  const [filterMonthEnd, setFilterMonthEnd] = useState<number>(currentMonth);

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  // Data Pajak per bulan - hanya hutang pajak yang belum dibayar
  const taxData: TaxData[] = [
    { bulan: 'Januari', monthIndex: 0, hutangPajak: 45000000, pphUnifikasi: 15000000, pph22: 5000000, pph23: 6000000, pph4Ayat2: 4000000, statusHutangPajak: 'paid', tanggalJatuhTempo: '2025-02-15' },
    { bulan: 'Februari', monthIndex: 1, hutangPajak: 52000000, pphUnifikasi: 18000000, pph22: 6000000, pph23: 7000000, pph4Ayat2: 5000000, statusHutangPajak: 'paid', tanggalJatuhTempo: '2025-03-15' },
    { bulan: 'Maret', monthIndex: 2, hutangPajak: 38000000, pphUnifikasi: 14000000, pph22: 4500000, pph23: 5500000, pph4Ayat2: 4000000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-04-15' },
    { bulan: 'April', monthIndex: 3, hutangPajak: 47000000, pphUnifikasi: 16000000, pph22: 5500000, pph23: 6000000, pph4Ayat2: 4500000, statusHutangPajak: 'paid', tanggalJatuhTempo: '2025-05-15' },
    { bulan: 'Mei', monthIndex: 4, hutangPajak: 55000000, pphUnifikasi: 20000000, pph22: 7000000, pph23: 8000000, pph4Ayat2: 5000000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-06-15' },
    { bulan: 'Juni', monthIndex: 5, hutangPajak: 49000000, pphUnifikasi: 17000000, pph22: 5800000, pph23: 6500000, pph4Ayat2: 4700000, statusHutangPajak: 'paid', tanggalJatuhTempo: '2025-07-15' },
    { bulan: 'Juli', monthIndex: 6, hutangPajak: 51000000, pphUnifikasi: 19000000, pph22: 6200000, pph23: 7300000, pph4Ayat2: 5500000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-08-15' },
    { bulan: 'Agustus', monthIndex: 7, hutangPajak: 58000000, pphUnifikasi: 22000000, pph22: 7500000, pph23: 8500000, pph4Ayat2: 6000000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-09-15' },
    { bulan: 'September', monthIndex: 8, hutangPajak: 53000000, pphUnifikasi: 21000000, pph22: 7000000, pph23: 8000000, pph4Ayat2: 6000000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-10-15' },
    { bulan: 'Oktober', monthIndex: 9, hutangPajak: 46000000, pphUnifikasi: 16000000, pph22: 5500000, pph23: 6000000, pph4Ayat2: 4500000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-11-15' },
    { bulan: 'November', monthIndex: 10, hutangPajak: 60000000, pphUnifikasi: 25000000, pph22: 8500000, pph23: 9500000, pph4Ayat2: 7000000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2025-12-15' },
    { bulan: 'Desember', monthIndex: 11, hutangPajak: 62000000, pphUnifikasi: 28000000, pph22: 9500000, pph23: 10500000, pph4Ayat2: 8000000, statusHutangPajak: 'unpaid', tanggalJatuhTempo: '2026-01-15' },
  ];

  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const getStatusBadge = (status: 'paid' | 'unpaid') => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terbayar
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Belum Bayar
        </span>
      );
    }
  };

  // Filter data berdasarkan range bulan dan hanya yang belum dibayar
  const filteredData = useMemo(() => {
    return taxData.filter(item => 
      item.monthIndex >= filterMonthStart && 
      item.monthIndex <= filterMonthEnd &&
      item.statusHutangPajak === 'unpaid'
    );
  }, [filterMonthStart, filterMonthEnd]);

  const totalHutangPajak = filteredData.reduce((sum, item) => sum + item.hutangPajak, 0);
  const totalPPHUnifikasi = filteredData.reduce((sum, item) => sum + item.pphUnifikasi, 0);
  const totalPPH22 = filteredData.reduce((sum, item) => sum + item.pph22, 0);
  const totalPPH23 = filteredData.reduce((sum, item) => sum + item.pph23, 0);
  const totalPPH4Ayat2 = filteredData.reduce((sum, item) => sum + item.pph4Ayat2, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                TAX DASHBOARD
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Tax</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hutang Pajak</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalHutangPajak)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PPH Unifikasi</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPPHUnifikasi)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PPH 22</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPPH22)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PPH 23</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPPH23)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PPH 4 Ayat 2</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPPH4Ayat2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Periode Bulan</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dari Bulan</label>
              <select
                value={filterMonthStart}
                onChange={(e) => setFilterMonthStart(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Bulan</label>
              <select
                value={filterMonthEnd}
                onChange={(e) => setFilterMonthEnd(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tax Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Data Pajak per Bulan {currentYear}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bulan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hutang Pajak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50">
                    PPH Unifikasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.bulan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatRupiah(item.hutangPajak)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold bg-yellow-50">
                        {formatRupiah(item.pphUnifikasi)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.tanggalJatuhTempo).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                    {/* Rincian PPH Unifikasi */}
                    <tr className="bg-yellow-50/30">
                      <td className="px-6 py-2"></td>
                      <td className="px-6 py-2 text-xs text-gray-600 italic">
                        Rincian PPH Unifikasi:
                      </td>
                      <td className="px-6 py-2" colSpan={2}>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">• PPH 22:</span>
                            <span className="font-medium text-gray-900">{formatRupiah(item.pph22)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">• PPH 23:</span>
                            <span className="font-medium text-gray-900">{formatRupiah(item.pph23)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">• PPH 4 Ayat 2:</span>
                            <span className="font-medium text-gray-900">{formatRupiah(item.pph4Ayat2)}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDashboard;
