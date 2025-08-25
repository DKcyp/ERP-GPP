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
  id: string;
  no: number;
  namaClient: string;
  namaProject: string;
  lokasi: string;
  estimasiHPP: string;
  statusDokumen: 'Open' | 'Close';
  tanggalUpdate: string;
}

const HPPIndukDashboard: React.FC = () => {
  const [searchNamaClient, setSearchNamaClient] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatusDokumen, setSelectedStatusDokumen] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHPPForDetail, setSelectedHPPForDetail] = useState<HPPIndukDetailData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HPPInduk | null>(null);

  // Sample data
  const [hppIndukData, setHppIndukData] = useState<HPPInduk[]>([
    {
      id: '1',
      no: 1,
      namaClient: 'PT Teknologi Maju',
      namaProject: 'ERP Implementation Phase 1',
      lokasi: 'Jakarta Selatan',
      estimasiHPP: 'Rp 2.500.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '15-01-2025'
    },
    {
      id: '2',
      no: 2,
      namaClient: 'CV Digital Solutions',
      namaProject: 'Website Development Project',
      lokasi: 'Bandung',
      estimasiHPP: 'Rp 750.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '14-01-2025'
    },
    {
      id: '3',
      no: 3,
      namaClient: 'PT Industri Kreatif',
      namaProject: 'IT Infrastructure Upgrade',
      lokasi: 'Surabaya',
      estimasiHPP: 'Rp 1.200.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '13-01-2025'
    },
    {
      id: '4',
      no: 4,
      namaClient: 'UD Berkah Jaya',
      namaProject: 'POS System Integration',
      lokasi: 'Yogyakarta',
      estimasiHPP: 'Rp 450.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '12-01-2025'
    },
    {
      id: '5',
      no: 5,
      namaClient: 'PT Global Mandiri',
      namaProject: 'Mobile App Development',
      lokasi: 'Medan',
      estimasiHPP: 'Rp 1.800.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '11-01-2025'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddHPPInduk = (formData: HPPIndukFormData) => {
    const newHPPInduk: HPPInduk = {
      id: (hppIndukData.length + 1).toString(),
      no: hppIndukData.length + 1,
      namaClient: formData.namaClient,
      namaProject: formData.namaProject,
      lokasi: formData.lokasiPekerjaan,
      estimasiHPP: formData.estimasiNilaiKontrak || 'Rp 0',
      statusDokumen: 'Open' as 'Open' | 'Close',
      tanggalUpdate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };

    setHppIndukData(prev => [newHPPInduk, ...prev.map(h => ({ ...h, no: h.no + 1 }))]);
  };

  const handleViewDetail = (hpp: HPPInduk) => {
    const detailData: HPPIndukDetailData = {
      id: hpp.id,
      namaClient: hpp.namaClient,
      namaProject: hpp.namaProject,
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
      setHppIndukData(prev => prev.filter(h => h.id !== itemToDelete.id));
      setItemToDelete(null);
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
            {/* Search Nama Client */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Nama Client
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNamaClient}
                  onChange={(e) => setSearchNamaClient(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan nama client..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search Nama Project */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Nama Project
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNamaProject}
                  onChange={(e) => setSearchNamaProject(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan nama project..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status Dokumen Dropdown */}
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

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-1.5 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-1.5 text-sm">
              <Search className="h-5 w-5" />
              <span>Cari Data</span>
            </button>
          </div>
        </div>

        {/* Quick Export Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Excel</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-1.5">
                <File className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-1.5">
                <FileText className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* HPP Induk Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Project</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estimasi HPP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status Dokumen</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hppIndukData.map((hpp, index) => (
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
                    <td className="px-6 py-4 font-medium text-gray-900">{hpp.namaClient}</td>
                    <td className="px-6 py-4 text-gray-600">{hpp.namaProject}</td>
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
                          onClick={() => setIsModalOpen(true)}
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
        onSave={handleAddHPPInduk}
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
        itemName={itemToDelete?.namaProject}
      />
    </div>
  );
};

export default HPPIndukDashboard;
