import React, { useMemo, useState } from 'react';
import { Clock, FileSpreadsheet, Download, Search, Filter, Calendar, TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';

// Interface for Kas Report data
interface LaporanKasRow {
  id: number;
  tanggal: string;
  noBukti: string;
  jenisTransaksi: string;
  keterangan: string;
  divisi: string;
  noDokumen: string;
  terimaDari?: string;
  bayarKepada?: string;
  kasmasuk: number;
  kasKeluar: number;
  saldo: number;
  tipeTransaksi: 'masuk' | 'keluar';
}

const FinanceLaporanKasDashboard: React.FC = () => {
  // Filter states
  const [filterTanggalDari, setFilterTanggalDari] = useState('');
  const [filterTanggalSampai, setFilterTanggalSampai] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterJenisTransaksi, setFilterJenisTransaksi] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [searchNoBukti, setSearchNoBukti] = useState('');

  // Dummy data for Kas Report
  const [laporanKasData] = useState<LaporanKasRow[]>([
    {
      id: 1,
      tanggal: '2025-09-01',
      noBukti: 'BKM-2025-09-001',
      jenisTransaksi: 'Penerimaan Pendapatan',
      keterangan: 'Pembayaran proyek dari client',
      divisi: 'Finance',
      noDokumen: 'DOC-001',
      terimaDari: 'Ahmad Rizki',
      kasmasuk: 3500000,
      kasKeluar: 0,
      saldo: 3500000,
      tipeTransaksi: 'masuk',
    },
    {
      id: 2,
      tanggal: '2025-09-02',
      noBukti: 'BKK-2025-09-001',
      jenisTransaksi: 'Pembayaran Operasional',
      keterangan: 'Pembayaran listrik kantor',
      divisi: 'Finance',
      noDokumen: 'DOC-002',
      bayarKepada: 'PLN',
      kasmasuk: 0,
      kasKeluar: 1200000,
      saldo: 2300000,
      tipeTransaksi: 'keluar',
    },
    {
      id: 3,
      tanggal: '2025-09-03',
      noBukti: 'BKM-2025-09-002',
      jenisTransaksi: 'Pelunasan Piutang',
      keterangan: 'Pelunasan invoice dari client',
      divisi: 'Accounting',
      noDokumen: 'DOC-003',
      terimaDari: 'Siti Nurhaliza',
      kasmasuk: 5000000,
      kasKeluar: 0,
      saldo: 7300000,
      tipeTransaksi: 'masuk',
    },
    {
      id: 4,
      tanggal: '2025-09-04',
      noBukti: 'BKK-2025-09-002',
      jenisTransaksi: 'Pembayaran Gaji',
      keterangan: 'Gaji karyawan bulan September',
      divisi: 'HRD',
      noDokumen: 'DOC-004',
      bayarKepada: 'Karyawan',
      kasmasuk: 0,
      kasKeluar: 8000000,
      saldo: -700000,
      tipeTransaksi: 'keluar',
    },
    {
      id: 5,
      tanggal: '2025-09-05',
      noBukti: 'BKM-2025-09-003',
      jenisTransaksi: 'Penerimaan Lainnya',
      keterangan: 'Penerimaan dari penjualan aset',
      divisi: 'Finance',
      noDokumen: 'DOC-005',
      terimaDari: 'Eko Prasetyo',
      kasmasuk: 2500000,
      kasKeluar: 0,
      saldo: 1800000,
      tipeTransaksi: 'masuk',
    },
    {
      id: 6,
      tanggal: '2025-09-06',
      noBukti: 'BKK-2025-09-003',
      jenisTransaksi: 'Pembayaran Supplier',
      keterangan: 'Pembayaran material konstruksi',
      divisi: 'Procurement',
      noDokumen: 'DOC-006',
      bayarKepada: 'PT Supplier Material',
      kasmasuk: 0,
      kasKeluar: 4500000,
      saldo: -2700000,
      tipeTransaksi: 'keluar',
    },
  ]);

  // Filter logic
  const filteredData = useMemo(() => {
    return laporanKasData.filter(item => {
      const tanggalMatch = (!filterTanggalDari || new Date(item.tanggal) >= new Date(filterTanggalDari)) &&
        (!filterTanggalSampai || new Date(item.tanggal) <= new Date(filterTanggalSampai));
      
      const divisiMatch = filterDivisi === '' || item.divisi === filterDivisi;
      const jenisMatch = filterJenisTransaksi === '' || item.jenisTransaksi === filterJenisTransaksi;
      const keteranganMatch = searchKeterangan === '' || 
        item.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase());
      const noBuktiMatch = searchNoBukti === '' || 
        item.noBukti.toLowerCase().includes(searchNoBukti.toLowerCase());
      
      return tanggalMatch && divisiMatch && jenisMatch && keteranganMatch && noBuktiMatch;
    });
  }, [laporanKasData, filterTanggalDari, filterTanggalSampai, filterDivisi, filterJenisTransaksi, searchKeterangan, searchNoBukti]);

  // Calculate summary
  const summary = useMemo(() => {
    const totalKasMasuk = filteredData.reduce((sum, item) => sum + item.kasmasuk, 0);
    const totalKasKeluar = filteredData.reduce((sum, item) => sum + item.kasKeluar, 0);
    const saldoAkhir = totalKasMasuk - totalKasKeluar;
    
    return {
      totalKasMasuk,
      totalKasKeluar,
      saldoAkhir,
      jumlahTransaksi: filteredData.length,
    };
  }, [filteredData]);

  const resetFilters = () => {
    setFilterTanggalDari('');
    setFilterTanggalSampai('');
    setFilterDivisi('');
    setFilterJenisTransaksi('');
    setSearchKeterangan('');
    setSearchNoBukti('');
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                Laporan Kas
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Finance
                </span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Kas / Bank
                </span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Laporan Kas</span>
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
                <p className="text-sm font-medium text-gray-600">Total Kas Masuk</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {summary.totalKasMasuk.toLocaleString('id-ID')}
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
                <p className="text-sm font-medium text-gray-600">Total Kas Keluar</p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {summary.totalKasKeluar.toLocaleString('id-ID')}
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
                <DollarSign className="h-6 w-6 text-blue-600" />
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
                <Receipt className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Filter Laporan Kas</h3>
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
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
              <select
                value={filterDivisi}
                onChange={(e) => setFilterDivisi(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
              <select
                value={filterJenisTransaksi}
                onChange={(e) => setFilterJenisTransaksi(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">Semua Jenis</option>
                <option value="Penerimaan Pendapatan">Penerimaan Pendapatan</option>
                <option value="Pelunasan Piutang">Pelunasan Piutang</option>
                <option value="Pembayaran Operasional">Pembayaran Operasional</option>
                <option value="Pembayaran Gaji">Pembayaran Gaji</option>
                <option value="Pembayaran Supplier">Pembayaran Supplier</option>
                <option value="Penerimaan Lainnya">Penerimaan Lainnya</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No Bukti</label>
              <input
                type="text"
                value={searchNoBukti}
                onChange={(e) => setSearchNoBukti(e.target.value)}
                placeholder="Cari no bukti..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
              <input
                type="text"
                value={searchKeterangan}
                onChange={(e) => setSearchKeterangan(e.target.value)}
                placeholder="Cari keterangan..."
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button 
                onClick={resetFilters}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              >
                Reset
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
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
            Daftar Transaksi Kas ({filteredData.length} items)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Bukti</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Transaksi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terima Dari / Bayar Kepada</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kas Masuk</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Kas Keluar</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.noBukti}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jenisTransaksi}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.divisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.terimaDari || item.bayarKepada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      {item.kasmasuk > 0 ? `Rp ${item.kasmasuk.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                      {item.kasKeluar > 0 ? `Rp ${item.kasKeluar.toLocaleString('id-ID')}` : '-'}
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
                <div className="text-gray-500 text-lg">Tidak ada data transaksi kas</div>
                <div className="text-gray-400 text-sm mt-2">Silakan ubah filter pencarian atau tambah data baru</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLaporanKasDashboard;
