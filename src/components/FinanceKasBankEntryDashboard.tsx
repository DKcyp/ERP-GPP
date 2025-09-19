import React, { useMemo, useState } from 'react';
import { Clock, PlusCircle, FileSpreadsheet, FileDown, Edit, Trash2, Download, Upload, Banknote, Building2, X, Save, Calendar } from 'lucide-react';

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
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingEntry, setEditingEntry] = useState<KasBankEntry | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    tanggal: today.toISOString().split('T')[0],
    noBukti: '',
    tipeTransaksi: '', // New field for transaction type selection
    divisi: '',
    jenisTransaksi: '',
    noDokumen: '',
    terimaDari: '',
    bayarKepada: '',
    keterangan: '',
    total: 0,
  });

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

  // Transaction type options for the modal
  const transactionTypeOptions = [
    { value: 'kas-masuk', label: 'Bukti Kas Masuk', prefix: 'BKM' },
    { value: 'kas-keluar', label: 'Bukti Kas Keluar', prefix: 'BKK' },
    { value: 'bank-masuk', label: 'Bank Masuk', prefix: 'BBM' },
    { value: 'bank-keluar', label: 'Bank Keluar', prefix: 'BBK' },
  ];

  const getNoPrefix = () => {
    switch (activeTab) {
      case 'kas-masuk': return 'BKM';
      case 'kas-keluar': return 'BKK';
      case 'bank-masuk': return 'BBM';
      case 'bank-keluar': return 'BBK';
      default: return 'BKM';
    }
  };

  // Generate next number based on transaction type
  const generateNextNumberByType = (tipeTransaksi: string) => {
    const selectedType = transactionTypeOptions.find(opt => opt.value === tipeTransaksi);
    if (!selectedType) return '';
    
    const prefix = selectedType.prefix;
    const existingNumbers = entries
      .filter(e => e.tipeEntry === tipeTransaksi as any)
      .map(e => {
        const match = e.noBukti.match(/-\d{3}$/);
        return match ? parseInt(match[0].substring(1)) : 0;
      });
    const nextNum = Math.max(0, ...existingNumbers) + 1;
    return `${prefix}-${String(nextNum).padStart(3, '0')}`;
  };



  const resetForm = () => {
    setFormData({
      tanggal: today.toISOString().split('T')[0],
      noBukti: '',
      tipeTransaksi: '',
      divisi: '',
      jenisTransaksi: '',
      noDokumen: '',
      terimaDari: '',
      bayarKepada: '',
      keterangan: '',
      total: 0,
    });
  };

  const handleAdd = () => {
    setModalMode('add');
    setEditingEntry(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (entry: KasBankEntry) => {
    setModalMode('edit');
    setEditingEntry(entry);
    setFormData({
      tanggal: entry.tanggal,
      noBukti: entry.noBukti,
      tipeTransaksi: entry.tipeEntry,
      divisi: entry.divisi,
      jenisTransaksi: entry.jenisTransaksi,
      noDokumen: entry.noDokumen,
      terimaDari: entry.terimaDari || '',
      bayarKepada: entry.bayarKepada || '',
      keterangan: entry.keterangan,
      total: entry.total,
    });
    setShowModal(true);
  };

  const handleDelete = (entry: KasBankEntry) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${entry.noBukti}?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      alert(`${entry.noBukti} berhasil dihapus!`);
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.divisi || !formData.jenisTransaksi || !formData.keterangan || formData.total <= 0) {
      alert('Mohon lengkapi semua field yang diperlukan!');
      return;
    }

    // For add mode, validate transaction type selection
    if (modalMode === 'add' && !formData.tipeTransaksi) {
      alert('Mohon pilih tipe transaksi!');
      return;
    }

    // Determine the entry type based on mode
    const entryType = modalMode === 'add' ? formData.tipeTransaksi as KasBankEntry['tipeEntry'] : activeTab;

    if (entryType.includes('masuk') && !formData.terimaDari) {
      alert('Field "Terima Dari" harus diisi!');
      return;
    }

    if (entryType.includes('keluar') && !formData.bayarKepada) {
      alert('Field "Bayar Kepada" harus diisi!');
      return;
    }

    if (modalMode === 'add') {
      // Add new entry
      const newEntry: KasBankEntry = {
        id: Math.max(0, ...entries.map(e => e.id)) + 1,
        tanggal: formData.tanggal,
        noBukti: formData.noBukti,
        divisi: formData.divisi,
        jenisTransaksi: formData.jenisTransaksi,
        noDokumen: formData.noDokumen,
        terimaDari: entryType.includes('masuk') ? formData.terimaDari : undefined,
        bayarKepada: entryType.includes('keluar') ? formData.bayarKepada : undefined,
        keterangan: formData.keterangan,
        total: formData.total,
        tipeEntry: entryType,
      };
      setEntries(prev => [...prev, newEntry]);
      alert(`Data ${transactionTypeOptions.find(opt => opt.value === entryType)?.label} berhasil ditambahkan!`);
    } else {
      // Update existing entry
      setEntries(prev => prev.map(entry => 
        entry.id === editingEntry?.id 
          ? {
              ...entry,
              tanggal: formData.tanggal,
              noBukti: formData.noBukti,
              divisi: formData.divisi,
              jenisTransaksi: formData.jenisTransaksi,
              noDokumen: formData.noDokumen,
              terimaDari: activeTab.includes('masuk') ? formData.terimaDari : undefined,
              bayarKepada: activeTab.includes('keluar') ? formData.bayarKepada : undefined,
              keterangan: formData.keterangan,
              total: formData.total,
            }
          : entry
      ));
      alert(`${formData.noBukti} berhasil diperbarui!`);
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setEditingEntry(null);
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
                <span>Tambah</span>
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalMode === 'add' ? `Tambah ${getTabTitle()}` : `Edit ${getTabTitle()}`}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Tanggal *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Tipe Transaksi - Only show in add mode */}
                {modalMode === 'add' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Transaksi *
                    </label>
                    <select
                      value={formData.tipeTransaksi}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          tipeTransaksi: newType,
                          noBukti: newType ? generateNextNumberByType(newType) : ''
                        }));
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Pilih Tipe Transaksi</option>
                      {transactionTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* No Bukti */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No Bukti *
                  </label>
                  <input
                    type="text"
                    value={formData.noBukti}
                    onChange={(e) => setFormData(prev => ({ ...prev, noBukti: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={modalMode === 'add' ? "Akan diisi otomatis setelah memilih tipe transaksi" : "Masukkan nomor bukti"}
                    readOnly={modalMode === 'add' && !formData.tipeTransaksi}
                    required
                  />
                </div>

                {/* Divisi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Divisi *
                  </label>
                  <select
                    value={formData.divisi}
                    onChange={(e) => setFormData(prev => ({ ...prev, divisi: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    <option value="Finance">Finance</option>
                    <option value="Accounting">Accounting</option>
                    <option value="HRD">HRD</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                {/* Jenis Transaksi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Transaksi *
                  </label>
                  <select
                    value={formData.jenisTransaksi}
                    onChange={(e) => setFormData(prev => ({ ...prev, jenisTransaksi: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={modalMode === 'add' && !formData.tipeTransaksi}
                  >
                    <option value="">{modalMode === 'add' && !formData.tipeTransaksi ? 'Pilih tipe transaksi terlebih dahulu' : 'Pilih Jenis Transaksi'}</option>
                    {(modalMode === 'edit' ? activeTab : formData.tipeTransaksi).includes('masuk') ? (
                      <>
                        <option value="Penerimaan Pendapatan">Penerimaan Pendapatan</option>
                        <option value="Pelunasan Piutang">Pelunasan Piutang</option>
                        <option value="Transfer Masuk">Transfer Masuk</option>
                        <option value="Penerimaan DP">Penerimaan DP</option>
                        <option value="Penerimaan Lainnya">Penerimaan Lainnya</option>
                      </>
                    ) : (
                      <>
                        <option value="Pembayaran Operasional">Pembayaran Operasional</option>
                        <option value="Pembayaran Gaji">Pembayaran Gaji</option>
                        <option value="Transfer Keluar">Transfer Keluar</option>
                        <option value="Pembayaran Invoice">Pembayaran Invoice</option>
                        <option value="Pembayaran Supplier">Pembayaran Supplier</option>
                        <option value="Pembayaran Lainnya">Pembayaran Lainnya</option>
                      </>
                    )}
                  </select>
                </div>

                {/* No Dokumen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No Dokumen
                  </label>
                  <input
                    type="text"
                    value={formData.noDokumen}
                    onChange={(e) => setFormData(prev => ({ ...prev, noDokumen: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nomor dokumen"
                  />
                </div>

                {/* Terima Dari / Bayar Kepada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {(modalMode === 'edit' ? activeTab : formData.tipeTransaksi).includes('masuk') ? 'Terima Dari *' : 'Bayar Kepada *'}
                  </label>
                  <input
                    type="text"
                    value={(modalMode === 'edit' ? activeTab : formData.tipeTransaksi).includes('masuk') ? formData.terimaDari : formData.bayarKepada}
                    onChange={(e) => {
                      if ((modalMode === 'edit' ? activeTab : formData.tipeTransaksi).includes('masuk')) {
                        setFormData(prev => ({ ...prev, terimaDari: e.target.value }));
                      } else {
                        setFormData(prev => ({ ...prev, bayarKepada: e.target.value }));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={(modalMode === 'edit' ? activeTab : formData.tipeTransaksi).includes('masuk') ? 'Nama penerima' : 'Nama pembayar'}
                    disabled={modalMode === 'add' && !formData.tipeTransaksi}
                    required
                  />
                </div>

                {/* Total */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total (Rp) *
                  </label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                {/* Keterangan */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan *
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Masukkan keterangan transaksi"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{modalMode === 'add' ? 'Simpan' : 'Update'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceKasBankEntryDashboard;
