import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Search, 
  Calendar,
  Building2,
  Banknote,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';

interface BankData {
  id: number;
  namaBank: string;
  noRek: string;
  alamat: string;
  saldoAwal: number;
  bankMasuk: number;
  bankKeluar: number;
  saldoAkhir: number;
  saldoTertahan?: number; // Only for special report
  saldoBank?: number; // Only for special report
}

const FinanceLaporanKasBankHarianDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);



  // Sample data for special daily report (with additional columns)
  const bankDataKhusus: BankData[] = [
    {
      id: 1,
      namaBank: 'Bank Mandiri Operasional',
      noRek: '1400098765432',
      alamat: 'KCP Mandiri Operasional, Jl. MH Thamrin, Jakarta',
      saldoAwal: 150000000,
      bankMasuk: 25000000,
      bankKeluar: 18000000,
      saldoAkhir: 157000000,
      saldoTertahan: 5000000,
      saldoBank: 152000000
    },
    {
      id: 2,
      namaBank: 'Bank BCA Operasional',
      noRek: '5430012345678',
      alamat: 'KCP BCA Sudirman, Jl. Sudirman, Jakarta',
      saldoAwal: 85000000,
      bankMasuk: 15000000,
      bankKeluar: 12000000,
      saldoAkhir: 88000000,
      saldoTertahan: 3000000,
      saldoBank: 85000000
    },
    {
      id: 3,
      namaBank: 'Bank BNI Payroll',
      noRek: '0987654321098',
      alamat: 'KCP BNI Gatot Subroto, Jl. Gatot Subroto, Jakarta',
      saldoAwal: 45000000,
      bankMasuk: 8000000,
      bankKeluar: 6500000,
      saldoAkhir: 46500000,
      saldoTertahan: 1500000,
      saldoBank: 45000000
    }
  ];

  // Use only the special report data (bankDataKhusus)
  const filteredData = useMemo(() => {
    return bankDataKhusus.filter(item =>
      item.namaBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noRek.includes(searchTerm) ||
      item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce((acc, item) => ({
      saldoAwal: acc.saldoAwal + item.saldoAwal,
      bankMasuk: acc.bankMasuk + item.bankMasuk,
      bankKeluar: acc.bankKeluar + item.bankKeluar,
      saldoAkhir: acc.saldoAkhir + item.saldoAkhir,
      saldoTertahan: acc.saldoTertahan + (item.saldoTertahan || 0),
      saldoBank: acc.saldoBank + (item.saldoBank || 0)
    }), {
      saldoAwal: 0,
      bankMasuk: 0,
      bankKeluar: 0,
      saldoAkhir: 0,
      saldoTertahan: 0,
      saldoBank: 0
    });
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-wide mb-2">
                LAPORAN KAS BANK HARIAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Kelola Bank</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan Kas Bank Harian</span>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saldo Awal</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {totals.saldoAwal.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bank Masuk</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {totals.bankMasuk.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bank Keluar</p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {totals.bankKeluar.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saldo Akhir</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {totals.saldoAkhir.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10"
                />
                <Calendar className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Bank</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10"
                  placeholder="Nama bank, no rekening, alamat..."
                />
                <Search className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="flex items-end justify-end gap-2">
              <button className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Laporan Bank Harian Khusus ({filteredData.length} bank)
            </h3>
            <div className="text-sm text-gray-500">
              Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. Rekening
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Awal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Masuk
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Keluar
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Akhir
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Tertahan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Bank
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.namaBank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.noRek}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {item.alamat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      Rp {item.saldoAwal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      Rp {item.bankMasuk.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                      Rp {item.bankKeluar.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-semibold">
                      Rp {item.saldoAkhir.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-yellow-600 font-medium">
                      Rp {(item.saldoTertahan || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600 font-semibold">
                      Rp {(item.saldoBank || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-gray-900">
                    Rp {totals.saldoAwal.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-green-600">
                    Rp {totals.bankMasuk.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-red-600">
                    Rp {totals.bankKeluar.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-blue-600">
                    Rp {totals.saldoAkhir.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-yellow-600">
                    Rp {totals.saldoTertahan.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-purple-600">
                    Rp {totals.saldoBank.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLaporanKasBankHarianDashboard;
