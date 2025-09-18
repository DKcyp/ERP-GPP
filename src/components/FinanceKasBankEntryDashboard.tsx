import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Search, Download, Upload, Banknote, Building2 } from 'lucide-react';

// Types for different entry types
interface KasBankEntry {
  id: number;
  tanggal: string; // yyyy-mm-dd
  noBukti: string;
  divisi: string;
  jenisTransaksi: string;
  noDokumen: string;
  terimaDari?: string; // For Masuk entries
  bayarKepada?: string; // For Keluar entries
  keterangan: string;
  total: number;
  tipeEntry: 'kas-masuk' | 'kas-keluar' | 'bank-masuk' | 'bank-keluar';
}

const FinanceKasBankEntryDashboard: React.FC = () => {
  const today = new Date();
  
  const [activeTab, setActiveTab] = useState<'kas-masuk' | 'kas-keluar' | 'bank-masuk' | 'bank-keluar'>('kas-masuk');
  const [searchNoBukti, setSearchNoBukti] = useState('');
  const [searchKeterangan, setSearchKeterangan] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  // Sample data for all entry types
  const [entries, setEntries] = useState<KasBankEntry[]>([
    // Kas Masuk
    { id: 1, tanggal: '2025-09-01', noBukti: 'BKM-2025-09-001', divisi: 'Finance', jenisTransaksi: 'Penerimaan Pendapatan', noDokumen: 'DOC-001', terimaDari: 'Ahmad Rizki', keterangan: 'Pembayaran proyek', total: 3500000, tipeEntry: 'kas-masuk' },
    { id: 2, tanggal: '2025-09-02', noBukti: 'BKM-2025-09-002', divisi: 'Accounting', jenisTransaksi: 'Pelunasan Piutang', noDokumen: 'DOC-002', terimaDari: 'Siti Nurhaliza', keterangan: 'Pelunasan invoice', total: 5000000, tipeEntry: 'kas-masuk' },
    
    // Kas Keluar
    { id: 3, tanggal: '2025-09-03', noBukti: 'BKK-2025-09-001', divisi: 'Finance', jenisTransaksi: 'Pembayaran Operasional', noDokumen: 'DOC-003', bayarKepada: 'Budi Santoso', keterangan: 'Pembayaran listrik kantor', total: 1200000, tipeEntry: 'kas-keluar' },
    { id: 4, tanggal: '2025-09-04', noBukti: 'BKK-2025-09-002', divisi: 'HRD', jenisTransaksi: 'Pembayaran Gaji', noDokumen: 'DOC-004', bayarKepada: 'Dewi Sartika', keterangan: 'Gaji karyawan', total: 8000000, tipeEntry: 'kas-keluar' },
    
    // Bank Masuk
    { id: 5, tanggal: '2025-09-05', noBukti: 'BBM-2025-09-001', divisi: 'Finance', jenisTransaksi: 'Transfer Masuk', noDokumen: 'DOC-005', terimaDari: 'Eko Prasetyo', keterangan: 'Transfer dari client', total: 15000000, tipeEntry: 'bank-masuk' },
    { id: 6, tanggal: '2025-09-06', noBukti: 'BBM-2025-09-002', divisi: 'Marketing', jenisTransaksi: 'Penerimaan DP', noDokumen: 'DOC-006', terimaDari: 'Fitri Handayani', keterangan: 'Down payment proyek', total: 25000000, tipeEntry: 'bank-masuk' },
    
    // Bank Keluar
    { id: 7, tanggal: '2025-09-07', noBukti: 'BBK-2025-09-001', divisi: 'Finance', jenisTransaksi: 'Transfer Keluar', noDokumen: 'DOC-007', bayarKepada: 'Gunawan Wijaya', keterangan: 'Pembayaran supplier', total: 12000000, tipeEntry: 'bank-keluar' },
    { id: 8, tanggal: '2025-09-08', noBukti: 'BBK-2025-09-002', divisi: 'Procurement', jenisTransaksi: 'Pembayaran Invoice', noDokumen: 'DOC-008', bayarKepada: 'Hesti Purwanti', keterangan: 'Pembayaran material', total: 18000000, tipeEntry: 'bank-keluar' },
  ]);

  // Filter entries based on active tab and filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesTab = entry.tipeEntry === activeTab;
      const matchesNoBukti = searchNoBukti ? entry.noBukti.toLowerCase().includes(searchNoBukti.toLowerCase()) : true;
      const matchesKeterangan = searchKeterangan ? entry.keterangan.toLowerCase().includes(searchKeterangan.toLowerCase()) : true;
      const matchesDivisi = filterDivisi ? entry.divisi === filterDivisi : true;
      const matchesTanggal = filterTanggal ? entry.tanggal === filterTanggal : true;
      
      return matchesTab && matchesNoBukti && matchesKeterangan && matchesDivisi && matchesTanggal;
    });
  }, [entries, activeTab, searchNoBukti, searchKeterangan, filterDivisi, filterTanggal]);

  // Tab configuration
  const tabs = [
    { key: 'kas-masuk', label: 'Kas Masuk', icon: Download, color: 'text-green-600', bgColor: 'bg-green-50' },
    { key: 'kas-keluar', label: 'Kas Keluar', icon: Upload, color: 'text-red-600', bgColor: 'bg-red-50' },
    { key: 'bank-masuk', label: 'Bank Masuk', icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'bank-keluar', label: 'Bank Keluar', icon: Banknote, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ] as const;

  const getTabTitle = () => {
    const tabConfig = tabs.find(tab => tab.key === activeTab);
    return tabConfig?.label || 'Kas Bank Entry';
  };

  const getNoPrefix = () => {
    switch (activeTab) {
      case 'kas-masuk': return 'BKM';
      case 'kas-keluar': return 'BKK';
      case 'bank-masuk': return 'BBM';
      case 'bank-keluar': return 'BBK';
      default: return 'BKM';
    }
  };

  const handleAdd = () => {
    alert(`Tambah ${getTabTitle()} - Modal akan diimplementasikan`);
  };

  const handleEdit = (entry: KasBankEntry) => {
    alert(`Edit ${entry.noBukti} - Modal akan diimplementasikan`);
  };

  const handleDelete = (entry: KasBankEntry) => {
    if (confirm(`Hapus ${entry.noBukti}?`)) {
      setEntries(prev => prev.filter(e => e.id !== entry.id));
    }
  };

  const resetFilters = () => {
    setSearchNoBukti('');
    setSearchKeterangan('');
    setFilterDivisi('');
    setFilterTanggal('');
  };

  const exportExcel = () => alert('Export Excel belum diimplementasikan');
  const exportPDF = () => alert('Export PDF belum diimplementasikan');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">KAS BANK ENTRY</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Finance</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Kas Bank Entry</span>
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
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 pt-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? `border-blue-500 ${tab.color}`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Filter {getTabTitle()}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari No Bukti</label>
                <input 
                  type="text" 
                  value={searchNoBukti} 
                  onChange={e => setSearchNoBukti(e.target.value)} 
                  placeholder={`${getNoPrefix()}-...`} 
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Keterangan</label>
                <input 
                  type="text" 
                  value={searchKeterangan} 
                  onChange={e => setSearchKeterangan(e.target.value)} 
                  placeholder="Keterangan..." 
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
                <select 
                  value={filterDivisi} 
                  onChange={e => setFilterDivisi(e.target.value)} 
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                >
                  <option value="">Semua Divisi</option>
                  {['Marketing','HRD','GA','Procurement','Project Control','Operasional','QHSE','Finance','Accounting','Tax','Gudang'].map(d => 
                    <option key={d} value={d}>{d}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                <input 
                  type="date" 
                  value={filterTanggal} 
                  onChange={e => setFilterTanggal(e.target.value)} 
                  className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm" 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end items-center space-y-3 md:space-y-0 md:space-x-3 mt-6">
              <button 
                onClick={resetFilters} 
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
              >
                Reset Filter
              </button>
              <button 
                onClick={handleAdd} 
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> 
                Tambah {getTabTitle()}
              </button>
              <button 
                onClick={exportExcel} 
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 w-full md:w-auto"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
              </button>
              <button 
                onClick={exportPDF} 
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 w-full md:w-auto"
              >
                <FileDown className="h-4 w-4 mr-2" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daftar {getTabTitle()}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Bukti</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Divisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Transaksi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No Dokumen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {activeTab.includes('masuk') ? 'Terima Dari' : 'Bayar Kepada'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {entry.noBukti}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.divisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.jenisTransaksi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.noDokumen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.terimaDari || entry.bayarKepada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      Rp {entry.total.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleEdit(entry)} 
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50" 
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry)} 
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50" 
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Tidak ada data {getTabTitle().toLowerCase()}</div>
                <div className="text-gray-400 text-sm mt-2">Silakan tambah data baru atau ubah filter pencarian</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceKasBankEntryDashboard;
