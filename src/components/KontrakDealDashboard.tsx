import React, { useState, useEffect } from 'react';
import KontrakDealModal, { KontrakDealFormData } from './KontrakDealModal';
import KickOffModal, { KickOffFormData } from './KickOffModal';
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

interface KontrakDeal {
  id: string;
  no: number;
  namaClient: string;
  namaKontrak: string;
  jenisKontrak: string;
  tanggalKontrak: string;
  durasiKontrak: string;
  nilaiKontrak: string;
  lokasiPekerjaan: string;
  scopeOfWork: string;
}

const KontrakDealDashboard: React.FC = () => {
  const [searchNamaClient, setSearchNamaClient] = useState('');
  const [searchNamaKontrak, setSearchNamaKontrak] = useState('');
  const [selectedJenisKontrak, setSelectedJenisKontrak] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [jenisKontrakDropdownOpen, setJenisKontrakDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKickOffModalOpen, setIsKickOffModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KontrakDeal | null>(null);

  // Sample data
  const [kontrakDeals, setKontrakDeals] = useState<KontrakDeal[]>([
    {
      id: '1',
      no: 1,
      namaClient: 'PT Teknologi Maju',
      namaKontrak: 'Implementasi ERP System',
      jenisKontrak: 'Software Development',
      tanggalKontrak: '15-01-2025',
      durasiKontrak: '12 Bulan',
      nilaiKontrak: 'Rp 2.500.000.000',
      lokasiPekerjaan: 'Jakarta Selatan',
      scopeOfWork: 'Full ERP Implementation'
    },
    {
      id: '2',
      no: 2,
      namaClient: 'CV Digital Solutions',
      namaKontrak: 'Website Development',
      jenisKontrak: 'Web Development',
      tanggalKontrak: '14-01-2025',
      durasiKontrak: '6 Bulan',
      nilaiKontrak: 'Rp 750.000.000',
      lokasiPekerjaan: 'Bandung',
      scopeOfWork: 'Corporate Website & CMS'
    },
    {
      id: '3',
      no: 3,
      namaClient: 'PT Industri Kreatif',
      namaKontrak: 'IT Infrastructure Setup',
      jenisKontrak: 'Infrastructure',
      tanggalKontrak: '13-01-2025',
      durasiKontrak: '8 Bulan',
      nilaiKontrak: 'Rp 1.200.000.000',
      lokasiPekerjaan: 'Surabaya',
      scopeOfWork: 'Network & Server Setup'
    },
    {
      id: '4',
      no: 4,
      namaClient: 'UD Berkah Jaya',
      namaKontrak: 'POS System Integration',
      jenisKontrak: 'System Integration',
      tanggalKontrak: '12-01-2025',
      durasiKontrak: '4 Bulan',
      nilaiKontrak: 'Rp 450.000.000',
      lokasiPekerjaan: 'Yogyakarta',
      scopeOfWork: 'POS & Inventory System'
    },
    {
      id: '5',
      no: 5,
      namaClient: 'PT Global Mandiri',
      namaKontrak: 'Mobile App Development',
      jenisKontrak: 'Mobile Development',
      tanggalKontrak: '11-01-2025',
      durasiKontrak: '10 Bulan',
      nilaiKontrak: 'Rp 1.800.000.000',
      lokasiPekerjaan: 'Medan',
      scopeOfWork: 'iOS & Android App'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddKontrakDeal = (formData: KontrakDealFormData) => {
    const newKontrakDeal: KontrakDeal = {
      id: (kontrakDeals.length + 1).toString(),
      no: kontrakDeals.length + 1,
      namaClient: formData.namaClient,
      namaKontrak: formData.namaKontrak,
      jenisKontrak: formData.jenisKontrak,
      tanggalKontrak: new Date(formData.tanggalKontrak).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      durasiKontrak: `${formData.durasiKontrakStart} s.d ${formData.durasiKontrakEnd}`,
      nilaiKontrak: formData.nilaiKontrak,
      lokasiPekerjaan: formData.lokasiPekerjaan,
      scopeOfWork: formData.scopeOfWork || 'Kontrak baru'
    };

    setKontrakDeals(prev => [newKontrakDeal, ...prev]);
  };

  const handleKickOffSave = (formData: KickOffFormData) => {
    console.log('Kick Off data saved:', formData);
    // Handle kick off data save logic here
  };

  const handleDeleteClick = (kontrak: KontrakDeal) => {
    setItemToDelete(kontrak);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setKontrakDeals(prev => prev.filter(k => k.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const jenisKontrakOptions = ['Software Development', 'Web Development', 'Mobile Development', 'Infrastructure', 'System Integration', 'Consulting'];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR KONTRAK DEAL
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Kontrak Deal</span>
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

            {/* Search Nama Kontrak */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Nama Kontrak
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNamaKontrak}
                  onChange={(e) => setSearchNamaKontrak(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan nama kontrak..."
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Jenis Kontrak Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Jenis Kontrak
              </label>
              <div className="relative">
                <button
                  onClick={() => setJenisKontrakDropdownOpen(!jenisKontrakDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span className={selectedJenisKontrak ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedJenisKontrak || 'Pilih jenis kontrak...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${jenisKontrakDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {jenisKontrakDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedJenisKontrak('');
                        setJenisKontrakDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Jenis Kontrak
                    </button>
                    {jenisKontrakOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSelectedJenisKontrak(jenis);
                          setJenisKontrakDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span>{jenis}</span>
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

        {/* Kontrak Deal Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Kontrak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis Kontrak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal Kontrak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Durasi Kontrak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nilai Kontrak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lokasi Pekerjaan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Scope Of Work</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {kontrakDeals.map((kontrak, index) => (
                  <tr 
                    key={kontrak.id}
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
                        <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0">
                          <Info className="h-2 w-2 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">{kontrak.no}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{kontrak.namaClient}</td>
                    <td className="px-6 py-4 text-gray-600">{kontrak.namaKontrak}</td>
                    <td className="px-6 py-4 text-gray-600">{kontrak.jenisKontrak}</td>
                    <td className="px-6 py-4 text-gray-600">{kontrak.tanggalKontrak}</td>
                    <td className="px-6 py-4 text-gray-600">{kontrak.durasiKontrak}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{kontrak.nilaiKontrak}</td>
                    <td className="px-6 py-4 text-gray-600">{kontrak.lokasiPekerjaan}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={kontrak.scopeOfWork}>
                      {kontrak.scopeOfWork}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(kontrak)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setIsKickOffModalOpen(true)}
                          className="p-2 text-green-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <File className="h-4 w-4" />
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

      {/* Kontrak Deal Modal */}
      <KontrakDealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddKontrakDeal}
      />

      {/* Kick Off Modal */}
      <KickOffModal
        isOpen={isKickOffModalOpen}
        onClose={() => setIsKickOffModalOpen(false)}
        onSave={handleKickOffSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaKontrak}
      />
    </div>
    </>
  );
};

export default KontrakDealDashboard;
