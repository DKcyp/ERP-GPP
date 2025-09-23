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
  Clock,
  Filter,
  Eye,
  X
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

interface KasData {
  id: number;
  namaKas: string;
  lokasi: string;
  penanggungJawab: string;
  saldoAwal: number;
  kasMasuk: number;
  kasKeluar: number;
  saldoAkhir: number;
}

interface MutasiData {
  id: number;
  tanggal: string;
  noBukti: string;
  keterangan: string;
  debet: number;
  kredit: number;
  saldo: number;
  jenisTransaksi: 'masuk' | 'keluar';
}

const FinanceLaporanKasBankHarianDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState<'kas' | 'bank'>('kas'); // Filter state
  const [showMutasiModal, setShowMutasiModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KasData | BankData | null>(null);



  // Sample data for kas (cash) daily report
  const kasData: KasData[] = [
    {
      id: 1,
      namaKas: 'Kas Kecil Operasional',
      lokasi: 'Kantor Pusat - Lantai 2',
      penanggungJawab: 'Ahmad Rizki',
      saldoAwal: 5000000,
      kasMasuk: 2500000,
      kasKeluar: 1800000,
      saldoAkhir: 5700000
    },
    {
      id: 2,
      namaKas: 'Kas Proyek Site A',
      lokasi: 'Site A - Container Office',
      penanggungJawab: 'Siti Nurhaliza',
      saldoAwal: 3000000,
      kasMasuk: 1500000,
      kasKeluar: 1200000,
      saldoAkhir: 3300000
    },
    {
      id: 3,
      namaKas: 'Kas Proyek Site B',
      lokasi: 'Site B - Field Office',
      penanggungJawab: 'Budi Santoso',
      saldoAwal: 2500000,
      kasMasuk: 800000,
      kasKeluar: 650000,
      saldoAkhir: 2650000
    }
  ];

  // Sample data for bank daily report (with additional columns)
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

  // Sample mutation data for demonstration
  const getMutasiData = (itemId: number, type: 'kas' | 'bank'): MutasiData[] => {
    // This would normally come from an API call
    const baseMutasi: MutasiData[] = [
      {
        id: 1,
        tanggal: '2025-01-20',
        noBukti: type === 'kas' ? 'BKM-001' : 'BBM-001',
        keterangan: 'Penerimaan dari customer PT. ABC',
        debet: 2500000,
        kredit: 0,
        saldo: 7500000,
        jenisTransaksi: 'masuk'
      },
      {
        id: 2,
        tanggal: '2025-01-20',
        noBukti: type === 'kas' ? 'BKK-001' : 'BBK-001',
        keterangan: 'Pembayaran supplier material',
        debet: 0,
        kredit: 800000,
        saldo: 6700000,
        jenisTransaksi: 'keluar'
      },
      {
        id: 3,
        tanggal: '2025-01-20',
        noBukti: type === 'kas' ? 'BKK-002' : 'BBK-002',
        keterangan: 'Biaya operasional kantor',
        debet: 0,
        kredit: 1000000,
        saldo: 5700000,
        jenisTransaksi: 'keluar'
      },
      {
        id: 4,
        tanggal: '2025-01-20',
        noBukti: type === 'kas' ? 'BKM-002' : 'BBM-002',
        keterangan: 'Penerimaan pembayaran invoice',
        debet: 1500000,
        kredit: 0,
        saldo: 7200000,
        jenisTransaksi: 'masuk'
      }
    ];
    return baseMutasi;
  };

  // Function to handle viewing mutation details
  const handleViewMutasi = (item: KasData | BankData) => {
    setSelectedItem(item);
    setShowMutasiModal(true);
  };

  // Function to close mutation modal
  const handleCloseMutasiModal = () => {
    setShowMutasiModal(false);
    setSelectedItem(null);
  };

  // Filter data based on selected type (kas or bank)
  const filteredData = useMemo(() => {
    if (filterType === 'kas') {
      return kasData.filter(item =>
        item.namaKas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return bankDataKhusus.filter(item =>
        item.namaBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noRek.includes(searchTerm) ||
        item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [searchTerm, filterType, kasData, bankDataKhusus]);

  // Calculate totals based on filter type
  const totals = useMemo(() => {
    if (filterType === 'kas') {
      return (filteredData as KasData[]).reduce((acc, item) => ({
        saldoAwal: acc.saldoAwal + item.saldoAwal,
        kasMasuk: acc.kasMasuk + item.kasMasuk,
        kasKeluar: acc.kasKeluar + item.kasKeluar,
        saldoAkhir: acc.saldoAkhir + item.saldoAkhir
      }), {
        saldoAwal: 0,
        kasMasuk: 0,
        kasKeluar: 0,
        saldoAkhir: 0
      });
    } else {
      return (filteredData as BankData[]).reduce((acc, item) => ({
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
    }
  }, [filteredData, filterType]);

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
                <p className="text-sm font-medium text-gray-600">
                  Total {filterType === 'kas' ? 'Kas' : 'Bank'} Masuk
                </p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {filterType === 'kas' 
                    ? (totals as any).kasMasuk?.toLocaleString('id-ID') || '0'
                    : (totals as any).bankMasuk?.toLocaleString('id-ID') || '0'
                  }
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
                <p className="text-sm font-medium text-gray-600">
                  Total {filterType === 'kas' ? 'Kas' : 'Bank'} Keluar
                </p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {filterType === 'kas' 
                    ? (totals as any).kasKeluar?.toLocaleString('id-ID') || '0'
                    : (totals as any).bankKeluar?.toLocaleString('id-ID') || '0'
                  }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="h-4 w-4 inline mr-1" />
                Filter Tipe
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'kas' | 'bank')}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="kas">Kas</option>
                <option value="bank">Bank</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10"
                />
                <Calendar className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10"
                />
                <Calendar className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari {filterType === 'kas' ? 'Kas' : 'Bank'}
              </label>
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
          </div>
            <div className="flex items-end justify-end gap-2 mt-2">
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

        {/* Data Table */}
       
      {/* Data Table - Conditional rendering based on filter type */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Laporan {filterType === 'kas' ? 'Kas' : 'Bank'} Harian Khusus ({filteredData.length} {filterType === 'kas' ? 'kas' : 'bank'})
          </h3>
          <div className="text-sm text-gray-500">
            Periode: {new Date(startDate).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })} - {new Date(endDate).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filterType === 'kas' ? (
            // Kas Table
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail Mutasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Kas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penanggung Jawab
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Awal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kas Masuk
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kas Keluar
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Akhir
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredData as KasData[]).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewMutasi(item)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detail
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.namaKas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.lokasi}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.penanggungJawab}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      Rp {item.saldoAwal.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                      Rp {item.kasMasuk.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                      Rp {item.kasKeluar.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-semibold">
                      Rp {item.saldoAkhir.toLocaleString('id-ID')}
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
                    Rp {(totals as any).kasMasuk?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-red-600">
                    Rp {(totals as any).kasKeluar?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-blue-600">
                    Rp {totals.saldoAkhir.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3"></td>
                </tr>
              </tfoot>
            </table>
          ) : (
            // Bank Table
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No Rekening
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail Mutasi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(filteredData as BankData[]).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewMutasi(item)}
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium transition-colors duration-200"
                      >
                        {item.namaBank}
                      </button>
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewMutasi(item)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors duration-200"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detail
                      </button>
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
                    Rp {(totals as any).bankMasuk?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-red-600">
                    Rp {(totals as any).bankKeluar?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-blue-600">
                    Rp {totals.saldoAkhir.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-yellow-600">
                    Rp {(totals as any).saldoTertahan?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-right text-purple-600">
                    Rp {(totals as any).saldoBank?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="px-6 py-3"></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
      </div>

      {/* Mutation Detail Modal */}
      {showMutasiModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    Detail Mutasi - {'namaKas' in selectedItem ? selectedItem.namaKas : selectedItem.namaBank}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={handleCloseMutasiModal}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Summary Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Saldo Awal</div>
                  <div className="text-lg font-semibold text-gray-900">
                    Rp {selectedItem.saldoAwal.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600">
                    {'namaKas' in selectedItem ? 'Kas Masuk' : 'Bank Masuk'}
                  </div>
                  <div className="text-lg font-semibold text-green-700">
                    Rp {('kasMasuk' in selectedItem ? selectedItem.kasMasuk : selectedItem.bankMasuk).toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-red-600">
                    {'namaKas' in selectedItem ? 'Kas Keluar' : 'Bank Keluar'}
                  </div>
                  <div className="text-lg font-semibold text-red-700">
                    Rp {('kasKeluar' in selectedItem ? selectedItem.kasKeluar : selectedItem.bankKeluar).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Mutation Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">Rincian Mutasi Harian</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No. Bukti
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keterangan
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Debet
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kredit
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getMutasiData(selectedItem.id, 'namaKas' in selectedItem ? 'kas' : 'bank').map((mutasi) => (
                        <tr key={mutasi.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(mutasi.tanggal).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {mutasi.noBukti}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {mutasi.keterangan}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            {mutasi.debet > 0 ? (
                              <span className="text-green-600 font-medium">
                                Rp {mutasi.debet.toLocaleString('id-ID')}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                            {mutasi.kredit > 0 ? (
                              <span className="text-red-600 font-medium">
                                Rp {mutasi.kredit.toLocaleString('id-ID')}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-blue-600 font-semibold">
                            Rp {mutasi.saldo.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseMutasiModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FinanceLaporanKasBankHarianDashboard;
