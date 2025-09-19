import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, Download, Search, Filter, Calendar, TrendingUp, TrendingDown, Building2, CreditCard } from 'lucide-react';

// Interface for Bank Report data
interface LaporanBankRow {
  id: number;
  tanggal: string;
  noBukti: string;
  jenisTransaksi: string;
  keterangan: string;
  divisi: string;
  noDokumen: string;
  namaBank: string;
  noRekening: string;
  terimaDari?: string;
  bayarKepada?: string;
  bankMasuk: number;
  bankKeluar: number;
  saldo: number;
  tipeTransaksi: 'masuk' | 'keluar';
}

const FinanceLaporanBankDashboard: React.FC = () => {
  // Filter states
  const [filterTanggalDari, setFilterTanggalDari] = useState('');
  const [filterTanggalSampai, setFilterTanggalSampai] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterBank, setFilterBank] = useState('');
  const [filterJenisTransaksi, setFilterJenisTransaksi] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [searchNoBukti, setSearchNoBukti] = useState('');

  // Dummy data for Bank Report
  const [laporanBankData] = useState<LaporanBankRow[]>([
    {
      id: 1,
      tanggal: '2025-09-01',
      noBukti: 'BBM-2025-09-001',
      jenisTransaksi: 'Transfer Masuk',
      keterangan: 'Transfer dari client untuk proyek A',
      divisi: 'Finance',
      noDokumen: 'DOC-001',
      namaBank: 'Bank BCA',
      noRekening: '1234567890',
      terimaDari: 'PT Client Utama',
      bankMasuk: 15000000,
      bankKeluar: 0,
      saldo: 15000000,
      tipeTransaksi: 'masuk',
    },
    {
      id: 2,
      tanggal: '2025-09-02',
      noBukti: 'BBK-2025-09-001',
      jenisTransaksi: 'Transfer Keluar',
      keterangan: 'Pembayaran supplier material',
      divisi: 'Procurement',
      noDokumen: 'DOC-002',
      namaBank: 'Bank BCA',
      noRekening: '1234567890',
      bayarKepada: 'PT Supplier Material',
      bankMasuk: 0,
      bankKeluar: 12000000,
      saldo: 3000000,
      tipeTransaksi: 'keluar',
    },
    {
      id: 3,
      tanggal: '2025-09-03',
      noBukti: 'BBM-2025-09-002',
      jenisTransaksi: 'Penerimaan DP',
      keterangan: 'Down payment proyek B dari client',
      divisi: 'Marketing',
      noDokumen: 'DOC-003',
      namaBank: 'Bank Mandiri',
      noRekening: '9876543210',
      terimaDari: 'PT Client Besar',
      bankMasuk: 25000000,
      bankKeluar: 0,
      saldo: 28000000,
      tipeTransaksi: 'masuk',
    },
    {
      id: 4,
      tanggal: '2025-09-04',
      noBukti: 'BBK-2025-09-002',
      jenisTransaksi: 'Pembayaran Invoice',
      keterangan: 'Pembayaran invoice konsultan IT',
      divisi: 'Finance',
      noDokumen: 'DOC-004',
      namaBank: 'Bank Mandiri',
      noRekening: '9876543210',
      bayarKepada: 'PT Konsultan IT',
      bankMasuk: 0,
      bankKeluar: 8000000,
      saldo: 20000000,
      tipeTransaksi: 'keluar',
    },
    {
      id: 5,
      tanggal: '2025-09-05',
      noBukti: 'BBM-2025-09-003',
      jenisTransaksi: 'Transfer Masuk',
      keterangan: 'Pelunasan piutang dari client lama',
      divisi: 'Accounting',
      noDokumen: 'DOC-005',
      namaBank: 'Bank BRI',
      noRekening: '5555666677',
      terimaDari: 'CV Client Lama',
      bankMasuk: 18000000,
      bankKeluar: 0,
      saldo: 38000000,
      tipeTransaksi: 'masuk',
    },
    {
      id: 6,
      tanggal: '2025-09-06',
      noBukti: 'BBK-2025-09-003',
      jenisTransaksi: 'Pembayaran Gaji',
      keterangan: 'Transfer gaji karyawan September',
      divisi: 'HRD',
      noDokumen: 'DOC-006',
      namaBank: 'Bank BRI',
      noRekening: '5555666677',
      bayarKepada: 'Karyawan',
      bankMasuk: 0,
      bankKeluar: 22000000,
      saldo: 16000000,
      tipeTransaksi: 'keluar',
    },
  ]);

  // Filter logic
  const filteredData = useMemo(() => {
    return laporanBankData.filter(item => {
      const tanggalMatch = (!filterTanggalDari || new Date(item.tanggal) >= new Date(filterTanggalDari)) &&
        (!filterTanggalSampai || new Date(item.tanggal) <= new Date(filterTanggalSampai));
      
      const divisiMatch = filterDivisi === '' || item.divisi === filterDivisi;
      const bankMatch = filterBank === '' || item.namaBank === filterBank;
      const jenisMatch = filterJenisTransaksi === '' || item.jenisTransaksi === filterJenisTransaksi;
      const keteranganMatch = searchKeterangan === '' || 
        item.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase());
      const noBuktiMatch = searchNoBukti === '' || 
        item.noBukti.toLowerCase().includes(searchNoBukti.toLowerCase());
      
      return tanggalMatch && divisiMatch && bankMatch && jenisMatch && keteranganMatch && noBuktiMatch;
    });
  }, [laporanBankData, filterTanggalDari, filterTanggalSampai, filterDivisi, filterBank, filterJenisTransaksi, searchKeterangan, searchNoBukti]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalBankMasuk = filteredData.reduce((sum, item) => sum + item.bankMasuk, 0);
    const totalBankKeluar = filteredData.reduce((sum, item) => sum + item.bankKeluar, 0);
    const saldoAkhir = totalBankMasuk - totalBankKeluar;
    
    return {
      totalBankMasuk,
      totalBankKeluar,
      saldoAkhir,
      jumlahTransaksi: filteredData.length,
    };
  }, [filteredData]);

  const resetFilters = () => {
    setFilterTanggalDari('');
    setFilterTanggalSampai('');
    setFilterDivisi('');
    setFilterBank('');
    setFilterJenisTransaksi('');
    setSearchKeterangan('');
    setSearchNoBukti('');
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-100 via-green-50 to-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Laporan Bank
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-green-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-green-600 cursor-pointer transition-colors">
                  Kas / Bank
                </span>
                <span className="mx-2">›</span>
                <span className="text-green-600 font-medium">Laporan Bank</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bank Masuk</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {summary.totalBankMasuk.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bank Keluar</p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {summary.totalBankKeluar.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Akhir</p>
                <p className={`text-2xl font-bold ${summary.saldoAkhir >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Rp {summary.saldoAkhir.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jumlah Transaksi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.jumlahTransaksi}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-6 w-6 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900">Filter Laporan Bank</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Tanggal Dari
              </label>
              <input
                type="date"
                value={filterTanggalDari}
                onChange={(e) => setFilterTanggalDari(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Tanggal Sampai
              </label>
              <input
                type="date"
                value={filterTanggalSampai}
                onChange={(e) => setFilterTanggalSampai(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-4 w-4 inline mr-1" />
                Bank
              </label>
              <select
                value={filterBank}
                onChange={(e) => setFilterBank(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
              >
                <option value="">Semua Bank</option>
                <option value="Bank BCA">Bank BCA</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="Bank BRI">Bank BRI</option>
                <option value="Bank BNI">Bank BNI</option>
                <option value="Bank CIMB">Bank CIMB</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <select
                value={filterDivisi}
                onChange={(e) => setFilterDivisi(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
              >
                <option value="">Semua Divisi</option>
                <option value="Finance">Finance</option>
                <option value="Accounting">Accounting</option>
                <option value="HRD">HRD</option>
                <option value="Marketing">Marketing</option>
                <option value="Procurement">Procurement</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
              <select
                value={filterJenisTransaksi}
                onChange={(e) => setFilterJenisTransaksi(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
              >
                <option value="">Semua Jenis</option>
                <option value="Transfer Masuk">Transfer Masuk</option>
                <option value="Transfer Keluar">Transfer Keluar</option>
                <option value="Penerimaan DP">Penerimaan DP</option>
                <option value="Pembayaran Invoice">Pembayaran Invoice</option>
                <option value="Pembayaran Gaji">Pembayaran Gaji</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Bukti</label>
              <input
                type="text"
                value={searchNoBukti}
                onChange={(e) => setSearchNoBukti(e.target.value)}
                placeholder="Cari no bukti..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <input
                type="text"
                value={searchKeterangan}
                onChange={(e) => setSearchKeterangan(e.target.value)}
                placeholder="Cari keterangan..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button 
                onClick={resetFilters}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              >
                Reset
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                <Search className="h-4 w-4 mr-2" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end space-x-3 mb-6">
          <button 
            onClick={exportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
          <button 
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export Excel</span>
          </button>
        </div>

        {/* Table List View */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Transaksi Bank ({filteredData.length} items)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Bukti</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Transaksi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Rekening</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terima Dari / Bayar Kepada</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Masuk</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Keluar</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {item.noBukti}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jenisTransaksi}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.namaBank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.noRekening}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.terimaDari || item.bayarKepada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      {item.bankMasuk > 0 ? `Rp ${item.bankMasuk.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                      {item.bankKeluar > 0 ? `Rp ${item.bankKeluar.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      item.saldo >= 0 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      Rp {item.saldo.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Tidak ada data transaksi bank</div>
                <div className="text-gray-400 text-sm mt-2">Silakan ubah filter pencarian atau tambah data baru</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLaporanBankDashboard;
