import React, { useState } from 'react';
import { Clock, Scale, Search, Filter, FileText, FileSpreadsheet, FileDown } from 'lucide-react';

const NeracaDashboard: React.FC = () => {
  const today = new Date();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('Juli 2025'); // Default filter

  // Helper function to format numbers as per ID-ID locale (e.g., 123.456.789)
  const formatNumber = (num: number) => {
    // Handle negative numbers by wrapping them in parentheses and formatting
    if (num < 0) {
      return `(${new Intl.NumberFormat('id-ID').format(Math.abs(num))})`;
    }
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Dummy Data for Neraca, structured to match the image
  const data = [
    { id: 1, no: '1', account: '10000000', keterangan: 'ASET', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, isBold: true },
    { id: 2, no: '', account: '11000000', keterangan: 'ASET LANCAR', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 1, isBold: true },
    { id: 3, no: '', account: '11100000', keterangan: 'KAS', saldoAwal: 42370393, mutasiDebet: 200000000, mutasiKredit: -181240506, saldoMutasi: 18759494, saldoAkhir: 61129887, level: 2 },
    { id: 4, no: '', account: '11200000', keterangan: 'BANK', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 2, isBold: true },
    { id: 5, no: '', account: '112001000', keterangan: 'BNI - REK.5520140008', saldoAwal: 21570196765, mutasiDebet: 75459463520, mutasiKredit: -79948800392, saldoMutasi: -4489336872, saldoAkhir: 17080859893, level: 3 },
    { id: 6, no: '', account: '112002000', keterangan: 'BRI - REK.0026-01-001159-30-3', saldoAwal: 608824922, mutasiDebet: 400332, mutasiKredit: -200000, saldoMutasi: 200332, saldoAkhir: 609025254, level: 3 },
    { id: 7, no: '', account: '112003000', keterangan: 'BANK MANDIRI (GIRO) - REK.140-00-1417676-3', saldoAwal: 4462883013, mutasiDebet: 37619318996, mutasiKredit: -36775748152, saldoMutasi: 843570844, saldoAkhir: 5306453857, level: 3 },
    { id: 8, no: '', account: '112004000', keterangan: 'BANK MANDIRI (ESCROW) - 178-000-666-6222', saldoAwal: 2228092353, mutasiDebet: 43679451347, mutasiKredit: -38334134704, saldoMutasi: 5345316643, saldoAkhir: 7573408996, level: 3 },
    { id: 9, no: '', account: '112005000', keterangan: 'MANDIRI ESCROW 1780004013153', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    { id: 10, no: '', account: '112006000', keterangan: 'BNI ESCROW-REK.414213679', saldoAwal: 6749607768, mutasiDebet: 23901575930, mutasiKredit: -24311070288, saldoMutasi: -409494358, saldoAkhir: 6340113410, level: 3 },
    { id: 11, no: '', account: '112007000', keterangan: 'BANK SYARIAH MANDIRI', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    // Add more dummy data to fill out the table as needed, following the pattern
    { id: 12, no: '', account: '112008000', keterangan: 'BANK PERMATA', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    { id: 13, no: '', account: '112009000', keterangan: 'BANK BCA', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 3 },
    { id: 14, no: '', account: '11300000', keterangan: 'PIUTANG USAHA', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 2, isBold: true },
    { id: 15, no: '', account: '113001000', keterangan: 'PIUTANG USAHA - PIHAK KE 3', saldoAwal: 15000000000, mutasiDebet: 5000000000, mutasiKredit: -2000000000, saldoMutasi: 3000000000, saldoAkhir: 18000000000, level: 3 },
    { id: 16, no: '', account: '11400000', keterangan: 'PERSEDIAAN', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 2, isBold: true },
    { id: 17, no: '', account: '114001000', keterangan: 'PERSEDIAAN BARANG DAGANG', saldoAwal: 5000000000, mutasiDebet: 1000000000, mutasiKredit: -500000000, saldoMutasi: 500000000, saldoAkhir: 5500000000, level: 3 },
    { id: 18, no: '', account: '20000000', keterangan: 'KEWAJIBAN', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, isBold: true },
    { id: 19, no: '', account: '21000000', keterangan: 'KEWAJIBAN JANGKA PENDEK', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, level: 1, isBold: true },
    { id: 20, no: '', account: '21100000', keterangan: 'HUTANG USAHA', saldoAwal: -10000000000, mutasiDebet: 3000000000, mutasiKredit: -5000000000, saldoMutasi: -2000000000, saldoAkhir: -12000000000, level: 2 },
    { id: 21, no: '', account: '30000000', keterangan: 'EKUITAS', saldoAwal: 0, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: 0, isBold: true },
    { id: 22, no: '', account: '31000000', keterangan: 'MODAL SAHAM', saldoAwal: -10000000000, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: -10000000000, level: 1 },
    { id: 23, no: '', account: '32000000', keterangan: 'LABA DITAHAN', saldoAwal: -10000000000, mutasiDebet: 0, mutasiKredit: 0, saldoMutasi: 0, saldoAkhir: -10000000000, level: 1 },
    { id: 24, no: '', account: '', keterangan: 'TOTAL', saldoAwal: -8019553176, mutasiDebet: 522619351391, mutasiKredit: -522619351391, saldoMutasi: 0, saldoAkhir: -8019553176, isTotal: true, isBold: true },
  ];

  // Filtered data based on search term (keterangan or account)
  const filteredData = data.filter(item =>
    item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    alert(`Mengekspor data Neraca ke format ${type}... (Fungsionalitas ini adalah placeholder)`);
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
                LAPORAN NERACA
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Accounting</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Neraca</span>
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
              placeholder="Cari keterangan atau akun..."
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

        {/* Neraca Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Keterangan</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Saldo Awal<br/>01 July 2025</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Mutasi Debet<br/>July 2025</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Mutasi Kredit<br/>July 2025</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Saldo Mutasi<br/>July 2025</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Akhir<br/>s/d 31 July 2025</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className={`${row.isTotal ? 'bg-blue-50 font-semibold text-blue-800' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      {row.no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      {row.account}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 border-r border-gray-200">
                      <span style={{ paddingLeft: `${(row.level || 0) * 1.5}rem` }} className={`${row.isBold ? 'font-bold' : ''}`}>
                        {row.keterangan}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.saldoAwal)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.mutasiDebet)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.mutasiKredit)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right border-r border-gray-200">
                      {formatNumber(row.saldoMutasi)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 text-right">
                      {formatNumber(row.saldoAkhir)}
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

export default NeracaDashboard;
