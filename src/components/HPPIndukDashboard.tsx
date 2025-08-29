import React, { useState, useEffect } from 'react';
import HPPIndukModal, { HPPIndukFormData } from './HPPIndukModal';
import HPPIndukDetailModal, { HPPIndukDetailData } from './HPPIndukDetailModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Clock,
  Info
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
  const [editingHPP, setEditingHPP] = useState<HPPIndukFormData | null>(null); // For edit functionality

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

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSaveHPPInduk = (formData: HPPIndukFormData) => {
    if (editingHPP) {
      // Edit existing HPP
      setHppIndukData(prev =>
        prev.map(hpp =>
          hpp.id === formData.noHPP
            ? {
                ...hpp,
                pic: formData.pic,
                jenisPekerjaan: formData.jenisPekerjaan,
                lokasi: formData.lokasiPekerjaan,
                estimasiHPP: formData.estimasiNilaiKontrak,
                tanggalUpdate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
              }
            : hpp
        )
      );
      setEditingHPP(null);
    } else {
      // Add new HPP
      const newHPPInduk: HPPInduk = {
        id: formData.noHPP, // Use noHPP from form as ID
        no: hppIndukData.length + 1, // Simple sequential number
        pic: formData.pic,
        jenisPekerjaan: formData.jenisPekerjaan,
        lokasi: formData.lokasiPekerjaan,
        estimasiHPP: formData.estimasiNilaiKontrak || 'Rp 0',
        statusDokumen: 'Open',
        tanggalUpdate: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      };
      setHppIndukData(prev => [newHPPInduk, ...prev.map(h => ({ ...h, no: h.no + 1 }))]);
    }
    setIsModalOpen(false);
  };

  const handleAddClick = () => {
    setEditingHPP(null); // Clear any previous edit data
    setIsModalOpen(true);
  };

  const handleEditClick = (hpp: HPPInduk) => {
    setEditingHPP({
      noHPP: hpp.id,
      pic: hpp.pic,
      jenisPekerjaan: hpp.jenisPekerjaan,
      lokasiPekerjaan: hpp.lokasi,
      estimasiNilaiKontrak: hpp.estimasiHPP,
    });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR HPP INDUK
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HPP Induk</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filter & Action Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Cari No HPP */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari No HPP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNoHPP}
                  onChange={(e) => setSearchNoHPP(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari No HPP..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cari PIC */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari PIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari PIC..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Cari Jenis Pekerjaan Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() => setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span className={searchJenisPekerjaan ? 'text-gray-900' : 'text-gray-500'}>
                    {searchJenisPekerjaan || 'Pilih jenis pekerjaan...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${jenisPekerjaanDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSearchJenisPekerjaan('');
                        setJenisPekerjaanDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
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
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchLokasiPekerjaan}
                  onChange={(e) => setSearchLokasiPekerjaan(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari lokasi kerja..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Pilih Status Dokumen Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pilih Status Dokumen
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span className={selectedStatusDokumen ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusDokumen || 'Pilih status dokumen...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStatusDokumen('');
                        setStatusDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
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
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-3 h-3 rounded-full ${
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode Dari
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode Sampai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Data Button */}
            <div className="flex items-end"> {/* Removed justify-end */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center space-x-2 text-sm"> {/* Added w-full and justify-center */}
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Action Buttons at the bottom */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah HPP Induk</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Export Bar - REMOVED */}

        {/* HPP Induk Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No HPP</th> {/* New Column */}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">PIC</th> {/* Changed from Nama Client */}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis Pekerjaan</th> {/* Changed from Nama Project */}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estimasi HPP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status Dokumen</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full flex-shrink-0">
                          <Info className="h-2 w-2 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{hpp.no}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{hpp.id}</td> {/* Display No HPP */}
                    <td className="px-6 py-4 font-medium text-gray-900">{hpp.pic}</td> {/* Display PIC */}
                    <td className="px-6 py-4 text-gray-600">{hpp.jenisPekerjaan}</td> {/* Display Jenis Pekerjaan */}
                    <td className="px-6 py-4 text-gray-600">{hpp.lokasi}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{hpp.estimasiHPP}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusDokumenColor(hpp.statusDokumen)}`}>
                        {hpp.statusDokumen}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(hpp)} // Use handleEditClick
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(hpp)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewDetail(hpp)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Eye className="h-4 w-4" />
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
        onSave={handleSaveHPPInduk} // Changed from handleAddHPPInduk
        initialData={editingHPP} // Pass initial data for editing
        title={editingHPP ? "Edit HPP Induk" : "Tambah HPP Induk"} // Dynamic title
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
    </div>
  );
};

export default HPPIndukDashboard;
