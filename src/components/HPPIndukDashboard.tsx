import React, { useState, useEffect } from 'react';
import HPPIndukModal, { HPPIndukFormData } from './HPPIndukModal';
import HPPIndukDetailModal, { HPPIndukDetailData } from './HPPIndukDetailModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  History
} from 'lucide-react';

interface HPPInduk {
  id: string; // No HPP
  no: number;
  pic: string; // New field
  jenisPekerjaan: string; // New field
  lokasi: string;
  estimasiHPP: string;
  statusDokumen: 'Open' | 'Close';
  tanggalUpdate: string;
}

const HPPIndukDashboard: React.FC = () => {
  // Filter states
  const [searchNoHPP, setSearchNoHPP] = useState('');
  const [searchPIC, setSearchPIC] = useState('');
  const [searchJenisPekerjaan, setSearchJenisPekerjaan] = useState('');
  const [searchLokasiPekerjaan, setSearchLokasiPekerjaan] = useState('');
  const [selectedStatusDokumen, setSelectedStatusDokumen] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [jenisPekerjaanDropdownOpen, setJenisPekerjaanDropdownOpen] = useState(false); // New dropdown state

  // Modal states
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHPPForDetail, setSelectedHPPForDetail] = useState<HPPIndukDetailData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HPPInduk | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  // Note: editing functionality disabled for now to match HPPIndukModal props

  // Sample data
  const [hppIndukData, setHppIndukData] = useState<HPPInduk[]>([
    {
      id: 'HPP001',
      no: 1,
      pic: 'Budi Santoso',
      jenisPekerjaan: 'ERP Implementation',
      lokasi: 'Jakarta Selatan',
      estimasiHPP: 'Rp 2.500.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '15-01-2025'
    },
    {
      id: 'HPP002',
      no: 2,
      pic: 'Siti Aminah',
      jenisPekerjaan: 'Website Development',
      lokasi: 'Bandung',
      estimasiHPP: 'Rp 750.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '14-01-2025'
    },
    {
      id: 'HPP003',
      no: 3,
      pic: 'Joko Susilo',
      jenisPekerjaan: 'IT Infrastructure Upgrade',
      lokasi: 'Surabaya',
      estimasiHPP: 'Rp 1.200.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '13-01-2025'
    },
    {
      id: 'HPP004',
      no: 4,
      pic: 'Dewi Lestari',
      jenisPekerjaan: 'POS System Integration',
      lokasi: 'Yogyakarta',
      estimasiHPP: 'Rp 450.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '12-01-2025'
    },
    {
      id: 'HPP005',
      no: 5,
      pic: 'Agus Salim',
      jenisPekerjaan: 'Mobile App Development',
      lokasi: 'Medan',
      estimasiHPP: 'Rp 1.800.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '11-01-2025'
    }
  ]);

  type HistoryEntry = { timestamp: string; formData: HPPIndukFormData };
  const [histories, setHistories] = useState<Record<string, HistoryEntry[]>>({});

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSaveHPPInduk = (formData: HPPIndukFormData) => {
    // Map fields from HPPIndukModal to dashboard model
    const newHPPInduk: HPPInduk = {
      id: formData.noKontrak || `HPP${String(Date.now()).slice(-3)}`,
      no: hppIndukData.length + 1,
      pic: formData.namaClient || '-',
      jenisPekerjaan: formData.jenisPekerjaan || '-',
      lokasi: formData.lokasiPekerjaan || '-',
      estimasiHPP: formData.estimasiNilaiKontrak || 'Rp 0',
      statusDokumen: 'Open',
      tanggalUpdate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };
    setHppIndukData(prev => [newHPPInduk, ...prev.map(h => ({ ...h, no: h.no + 1 }))]);
    setIsModalOpen(false);

    // Save to history using new id
    const historyId = newHPPInduk.id;
    setHistories(prev => ({
      ...prev,
      [historyId]: [
        { timestamp: new Date().toLocaleString('id-ID'), formData },
        ...(prev[historyId] || [])
      ]
    }));
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleEditClick = (_hpp: HPPInduk) => {
    // Open modal without prefill (HPPIndukModal does not support initialData)
    setIsModalOpen(true);
  };

  const handleViewDetail = (hpp: HPPInduk) => {
    const detailData: HPPIndukDetailData = {
      id: hpp.id,
      pic: hpp.pic,
      jenisPekerjaan: hpp.jenisPekerjaan,
      lokasi: hpp.lokasi,
      estimasiHPP: hpp.estimasiHPP,
      statusDokumen: hpp.statusDokumen,
      tanggalUpdate: hpp.tanggalUpdate
    };

    setSelectedHPPForDetail(detailData);
    setIsDetailModalOpen(true);
  };

  const handleViewHistory = (hpp: HPPInduk) => {
    setSelectedHistoryId(hpp.id);
    setIsHistoryModalOpen(true);
  };

  const handleDeleteClick = (hpp: HPPInduk) => {
    setItemToDelete(hpp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setHppIndukData(prev => prev.filter(h => h.id !== itemToDelete.id).map((h, index) => ({ ...h, no: index + 1 })));
      setItemToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const getStatusDokumenColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'Close': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusDokumenOptions = ['Open', 'Close'];
  const jenisPekerjaanOptions = ['ERP Implementation', 'Website Development', 'IT Infrastructure Upgrade', 'POS System Integration', 'Mobile App Development', 'Lainnya'];

  const filteredHPPIndukData = hppIndukData.filter(hpp => {
    const matchesNoHPP = searchNoHPP ? hpp.id.toLowerCase().includes(searchNoHPP.toLowerCase()) : true;
    const matchesPIC = searchPIC ? hpp.pic.toLowerCase().includes(searchPIC.toLowerCase()) : true;
    const matchesJenisPekerjaan = searchJenisPekerjaan ? hpp.jenisPekerjaan.toLowerCase().includes(searchJenisPekerjaan.toLowerCase()) : true;
    const matchesLokasi = searchLokasiPekerjaan ? hpp.lokasi.toLowerCase().includes(searchLokasiPekerjaan.toLowerCase()) : true;
    const matchesStatus = selectedStatusDokumen ? hpp.statusDokumen === selectedStatusDokumen : true;

    const hppDate = new Date(hpp.tanggalUpdate.split('-').reverse().join('-')); // Convert DD-MM-YYYY to YYYY-MM-DD for comparison
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || hppDate >= fromDate) && (!toDate || hppDate <= toDate);

    return matchesNoHPP && matchesPIC && matchesJenisPekerjaan && matchesLokasi && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide mb-1">
                DAFTAR HPP INDUK
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">HPP Induk</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari No HPP */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari No HPP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNoHPP}
                  onChange={(e) => setSearchNoHPP(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari No HPP..."
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Cari PIC */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari PIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari PIC..."
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Cari Jenis Pekerjaan Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() => setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={searchJenisPekerjaan ? 'text-gray-900' : 'text-gray-500'}>
                    {searchJenisPekerjaan || 'Pilih jenis pekerjaan...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${jenisPekerjaanDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-xs">
                    <button
                      onClick={() => {
                        setSearchJenisPekerjaan('');
                        setJenisPekerjaanDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Jenis Pekerjaan
                    </button>
                    {jenisPekerjaanOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSearchJenisPekerjaan(jenis);
                          setJenisPekerjaanDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchLokasiPekerjaan}
                  onChange={(e) => setSearchLokasiPekerjaan(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari lokasi kerja..."
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Pilih Status Dokumen Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Pilih Status Dokumen
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={selectedStatusDokumen ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusDokumen || 'Pilih status dokumen...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-xs">
                    <button
                      onClick={() => {
                        setSelectedStatusDokumen('');
                        setStatusDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Status
                    </button>
                    {statusDokumenOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatusDokumen(status);
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Periode Dari */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Periode Dari
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Periode Sampai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Data Button */}
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-xs">
                <Search className="h-3 w-3" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons at the bottom */}
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 text-xs">
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="h-3 w-3" />
              <span>Tambah HPP Induk</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2">
              <FileSpreadsheet className="h-3 w-3" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2">
              <FileText className="h-3 w-3" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Export Bar - REMOVED */}

        {/* HPP Induk Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No HPP</th> {/* New Column */}
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th> {/* Changed from Nama Client */}
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Jenis Pekerjaan</th> {/* Changed from Nama Project */}
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Lokasi</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Estimasi HPP</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status Dokumen</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHPPIndukData.map((hpp, index) => (
                  <tr
                    key={hpp.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-3 py-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-purple-500 rounded-full flex-shrink-0">
                          <Info className="h-1.5 w-1.5 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{hpp.no}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 text-xs">{hpp.id}</td> {/* Display No HPP */}
                    <td className="px-3 py-2 font-medium text-gray-900 text-xs">{hpp.pic}</td> {/* Display PIC */}
                    <td className="px-3 py-2 text-gray-600 text-xs">{hpp.jenisPekerjaan}</td> {/* Display Jenis Pekerjaan */}
                    <td className="px-3 py-2 text-gray-600 text-xs">{hpp.lokasi}</td>
                    <td className="px-3 py-2 text-gray-600 font-medium text-xs">{hpp.estimasiHPP}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusDokumenColor(hpp.statusDokumen)}`}>
                        {hpp.statusDokumen}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleEditClick(hpp)} // Use handleEditClick
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(hpp)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleViewDetail(hpp)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-all duration-200"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleViewHistory(hpp)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-all duration-200"
                          title="History"
                        >
                          <History className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HPP Induk Modal */}
      <HPPIndukModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHPPInduk}
      />

      {/* HPP Induk Detail Modal */}
      <HPPIndukDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        hppData={selectedHPPForDetail}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.id} // Changed to itemToDelete?.id
      />

      {/* History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsHistoryModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-3xl mx-4 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">History Entry HPP Induk</h3>
                <p className="text-xs text-gray-500">No HPP: {selectedHistoryId}</p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {selectedHistoryId && (histories[selectedHistoryId]?.length ?? 0) > 0 ? (
                <div className="space-y-4">
                  {histories[selectedHistoryId]!.map((entry, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{entry.timestamp}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">Entry #{histories[selectedHistoryId]!.length - idx}</span>
                      </div>
                      <div className="p-3 text-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Input 1</h4>
                            <div className="space-y-1">
                              {[
                                { label: 'No Kontrak', key: 'noKontrak' },
                                { label: 'Durasi Kontrak', key: 'durasiKontrak' },
                                { label: 'Nama Client', key: 'namaClient' },
                                { label: 'Lokasi Pekerjaan', key: 'lokasiPekerjaan' },
                                { label: 'Nama Project', key: 'namaProject' },
                                { label: 'Jenis Pekerjaan', key: 'jenisPekerjaan' },
                                { label: 'Estimasi Nilai Kontrak', key: 'estimasiNilaiKontrak' },
                                { label: 'Sertifikat', key: 'sertifikat' },
                              ].map(f => (
                                <div key={f.key} className="flex items-center justify-between">
                                  <span className="text-gray-500">{f.label}</span>
                                  <span className="text-gray-900 font-medium ml-4">
                                    {f.key === 'sertifikat'
                                      ? ((entry.formData as any).sertifikat ? 'Terunggah' : '-')
                                      : (entry.formData as any)[f.key] || '-'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Input 2</h4>
                            {/* Pekerjaan Ringkas */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-600">Pekerjaan Ringkas</span>
                                <span className="text-gray-400 text-[10px]">{entry.formData.pekerjaanRingkas?.length || 0} item</span>
                              </div>
                              {(entry.formData.pekerjaanRingkas?.length || 0) > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full border border-gray-100 rounded">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-2 py-1 text-left">Jenis</th>
                                        <th className="px-2 py-1 text-right">Harga</th>
                                        <th className="px-2 py-1 text-right">Jumlah</th>
                                        <th className="px-2 py-1 text-right">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {entry.formData.pekerjaanRingkas.map((r, i) => (
                                        <tr key={i} className="border-t">
                                          <td className="px-2 py-1">{r.jenisPekerjaan || '-'}</td>
                                          <td className="px-2 py-1 text-right">{r.hargaSatuan || '-'}</td>
                                          <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                          <td className="px-2 py-1 text-right">{r.total || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-gray-400">-</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detail Tabs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Tenaga Kerja */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">Tenaga Kerja</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.tenagaKerja?.length || 0} item</span>
                            </div>
                            {(entry.formData.tenagaKerja?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Tenaga</th>
                                      <th className="px-2 py-1 text-right">Tunjangan</th>
                                      <th className="px-2 py-1 text-right">Project Rate</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.tenagaKerja.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.tenaga || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.tunjangan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.projectRate || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>

                          {/* Jasa */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">Jasa</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.jasa?.length || 0} item</span>
                            </div>
                            {(entry.formData.jasa?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Jasa</th>
                                      <th className="px-2 py-1 text-right">Tunjangan</th>
                                      <th className="px-2 py-1 text-right">Project Rate</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.jasa.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.jasa || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.tunjangan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.projectRate || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>

                          {/* Alat */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">Alat</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.alat?.length || 0} item</span>
                            </div>
                            {(entry.formData.alat?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Alat</th>
                                      <th className="px-2 py-1 text-right">Harga</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-right">Hari</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                      <th className="px-2 py-1 text-right">Harga Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.alat.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.alat || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.harga || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.hari || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.hargaSatuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>

                          {/* Barang & Consumeble */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">Barang & Consumeble</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.barang?.length || 0} item</span>
                            </div>
                            {(entry.formData.barang?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Nama Barang</th>
                                      <th className="px-2 py-1 text-right">Harga</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-right">Hari</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                      <th className="px-2 py-1 text-right">Harga Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.barang.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.namaBarang || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.harga || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.hari || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.hargaSatuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>

                          {/* PPE */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">PPE</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.ppe?.length || 0} item</span>
                            </div>
                            {(entry.formData.ppe?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Nama Barang</th>
                                      <th className="px-2 py-1 text-right">Harga</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-right">Hari</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                      <th className="px-2 py-1 text-right">Harga Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.ppe.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.namaBarang || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.harga || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.hari || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.hargaSatuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>

                          {/* MobDemob */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">MobDemob</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.mobDemob?.length || 0} item</span>
                            </div>
                            {(entry.formData.mobDemob?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Transportasi</th>
                                      <th className="px-2 py-1 text-right">Tunjangan</th>
                                      <th className="px-2 py-1 text-right">Project Rate</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.mobDemob.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.namaTransportasi || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.tunjangan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.projectRate || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>

                          {/* Biaya Lain-lain */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">Biaya Lain-lain</h5>
                              <span className="text-gray-400 text-[10px]">{entry.formData.biayaLainLain?.length || 0} item</span>
                            </div>
                            {(entry.formData.biayaLainLain?.length || 0) > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-100 rounded">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-2 py-1 text-left">Nama Biaya</th>
                                      <th className="px-2 py-1 text-right">Tunjangan</th>
                                      <th className="px-2 py-1 text-right">Project Rate</th>
                                      <th className="px-2 py-1 text-right">Jumlah</th>
                                      <th className="px-2 py-1 text-left">Satuan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {entry.formData.biayaLainLain.map((r, i) => (
                                      <tr key={i} className="border-t">
                                        <td className="px-2 py-1">{r.namaBiaya || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.tunjangan || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.projectRate || '-'}</td>
                                        <td className="px-2 py-1 text-right">{r.jumlah || '-'}</td>
                                        <td className="px-2 py-1">{r.satuan || '-'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-xs py-8">Belum ada history untuk No HPP ini.</div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HPPIndukDashboard;
