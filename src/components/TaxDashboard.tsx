import React, { useState } from 'react';
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';

interface TaxData {
  bulan: string;
  hutangPajak: number;
  ppn: number;
  pph21: number;
  statusHutangPajak: 'paid' | 'unpaid';
  statusPPN: 'paid' | 'unpaid';
  statusPPh21: 'paid' | 'unpaid';
  tanggalJatuhTempo: string;
}

const TaxDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Data Pajak per bulan
  const taxData: TaxData[] = [
    { bulan: 'Januari', hutangPajak: 45000000, ppn: 25000000, pph21: 15000000, statusHutangPajak: 'paid', statusPPN: 'paid', statusPPh21: 'paid', tanggalJatuhTempo: '2025-02-15' },
    { bulan: 'Februari', hutangPajak: 52000000, ppn: 28000000, pph21: 18000000, statusHutangPajak: 'paid', statusPPN: 'unpaid', statusPPh21: 'paid', tanggalJatuhTempo: '2025-03-15' },
    { bulan: 'Maret', hutangPajak: 38000000, ppn: 22000000, pph21: 14000000, statusHutangPajak: 'unpaid', statusPPN: 'unpaid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-04-15' },
    { bulan: 'April', hutangPajak: 47000000, ppn: 26000000, pph21: 16000000, statusHutangPajak: 'paid', statusPPN: 'paid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-05-15' },
    { bulan: 'Mei', hutangPajak: 55000000, ppn: 30000000, pph21: 20000000, statusHutangPajak: 'unpaid', statusPPN: 'unpaid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-06-15' },
    { bulan: 'Juni', hutangPajak: 49000000, ppn: 27000000, pph21: 17000000, statusHutangPajak: 'paid', statusPPN: 'paid', statusPPh21: 'paid', tanggalJatuhTempo: '2025-07-15' },
    { bulan: 'Juli', hutangPajak: 51000000, ppn: 29000000, pph21: 19000000, statusHutangPajak: 'unpaid', statusPPN: 'paid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-08-15' },
    { bulan: 'Agustus', hutangPajak: 58000000, ppn: 32000000, pph21: 22000000, statusHutangPajak: 'unpaid', statusPPN: 'unpaid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-09-15' },
    { bulan: 'September', hutangPajak: 53000000, ppn: 31000000, pph21: 21000000, statusHutangPajak: 'paid', statusPPN: 'unpaid', statusPPh21: 'paid', tanggalJatuhTempo: '2025-10-15' },
    { bulan: 'Oktober', hutangPajak: 46000000, ppn: 24000000, pph21: 16000000, statusHutangPajak: 'unpaid', statusPPN: 'unpaid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-11-15' },
    { bulan: 'November', hutangPajak: 60000000, ppn: 35000000, pph21: 25000000, statusHutangPajak: 'unpaid', statusPPN: 'unpaid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2025-12-15' },
    { bulan: 'Desember', hutangPajak: 62000000, ppn: 38000000, pph21: 28000000, statusHutangPajak: 'unpaid', statusPPN: 'unpaid', statusPPh21: 'unpaid', tanggalJatuhTempo: '2026-01-15' },
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

  const filteredData = taxData.filter(item => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'paid') return item.statusHutangPajak === 'paid' && item.statusPPN === 'paid' && item.statusPPh21 === 'paid';
    if (filterStatus === 'unpaid') return item.statusHutangPajak === 'unpaid' || item.statusPPN === 'unpaid' || item.statusPPh21 === 'unpaid';
    return true;
  });

  const totalHutangPajak = taxData.reduce((sum, item) => sum + item.hutangPajak, 0);
  const totalPPN = taxData.reduce((sum, item) => sum + item.ppn, 0);
  const totalPPh21 = taxData.reduce((sum, item) => sum + item.pph21, 0);
  const totalUnpaid = taxData.filter(item => item.statusHutangPajak === 'unpaid' || item.statusPPN === 'unpaid' || item.statusPPh21 === 'unpaid').length;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total PPN</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPPN)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total PPh 21</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(totalPPh21)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Belum Terbayar</p>
                <p className="text-2xl font-bold text-gray-900">{totalUnpaid} Bulan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Status Pembayaran</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'paid'
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terbayar
            </button>
            <button
              onClick={() => setFilterStatus('unpaid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'unpaid'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Belum Terbayar
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PPN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PPh 21
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.bulan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatRupiah(item.hutangPajak)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.statusHutangPajak)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatRupiah(item.ppn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.statusPPN)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatRupiah(item.pph21)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.statusPPh21)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.tanggalJatuhTempo).toLocaleDateString('id-ID')}
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

export default TaxDashboard;
