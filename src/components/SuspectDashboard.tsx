import React, { useState, useEffect } from 'react';
import SuspectModal, { SuspectFormData } from './SuspectModal';
import SuspectDetailModal, { SuspectDetailData } from './SuspectDetailModal';
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
  Clock,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Suspect {
  id: string;
  no: number;
  namaPerusahaan: string;
  noTelp: string;
  alamatPerusahaan: string;
  bidangUsaha: string;
  pic: string;
  emailPIC: string;
}

const SuspectDashboard: React.FC = () => {
  const [searchNama, setSearchNama] = useState('');
  const [searchBidangUsaha, setSearchBidangUsaha] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSuspectForDetail, setSelectedSuspectForDetail] = useState<SuspectDetailData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Suspect | null>(null);

  // Sample data
  const [suspects, setSuspects] = useState<Suspect[]>([
    {
      id: '1',
      no: 1,
      namaPerusahaan: 'PT Teknologi Maju',
      noTelp: '021-12345678',
      alamatPerusahaan: 'Jl. Sudirman No. 123, Jakarta Selatan',
      bidangUsaha: 'Teknologi Informasi',
      pic: 'John Doe',
      emailPIC: 'john@teknologimaju.com'
    },
    {
      id: '2',
      no: 2,
      namaPerusahaan: 'CV Digital Solutions',
      noTelp: '022-87654321',
      alamatPerusahaan: 'Jl. Asia Afrika No. 456, Bandung',
      bidangUsaha: 'Jasa Konsultasi',
      pic: 'Jane Smith',
      emailPIC: 'jane@digitalsol.com'
    },
    {
      id: '3',
      no: 3,
      namaPerusahaan: 'PT Industri Kreatif',
      noTelp: '031-11223344',
      alamatPerusahaan: 'Jl. Pemuda No. 789, Surabaya',
      bidangUsaha: 'Manufaktur',
      pic: 'Bob Wilson',
      emailPIC: 'bob@industrikreatif.co.id'
    },
    {
      id: '4',
      no: 4,
      namaPerusahaan: 'UD Berkah Jaya',
      noTelp: '0274-556677',
      alamatPerusahaan: 'Jl. Malioboro No. 321, Yogyakarta',
      bidangUsaha: 'Perdagangan',
      pic: 'Alice Brown',
      emailPIC: 'alice@berkahjaya.com'
    },
    {
      id: '5',
      no: 5,
      namaPerusahaan: 'PT Global Mandiri',
      noTelp: '061-998877',
      alamatPerusahaan: 'Jl. Gatot Subroto No. 654, Medan',
      bidangUsaha: 'Konstruksi',
      pic: 'Charlie Davis',
      emailPIC: 'charlie@globalmandiri.com'
    },
    {
      id: '6',
      no: 6,
      namaPerusahaan: 'PT Inovasi Digital',
      noTelp: '024-334455',
      alamatPerusahaan: 'Jl. Pandanaran No. 987, Semarang',
      bidangUsaha: 'Teknologi Informasi',
      pic: 'Diana Evans',
      emailPIC: 'diana@inovasidigital.com'
    },
    {
      id: '7',
      no: 7,
      namaPerusahaan: 'CV Solusi Terpadu',
      noTelp: '0341-667788',
      alamatPerusahaan: 'Jl. Ijen No. 147, Malang',
      bidangUsaha: 'Jasa Konsultasi',
      pic: 'Frank Miller',
      emailPIC: 'frank@solusiterpadu.com'
    },
    {
      id: '8',
      no: 8,
      namaPerusahaan: 'PT Mitra Sejahtera',
      noTelp: '0361-445566',
      alamatPerusahaan: 'Jl. Sunset Road No. 258, Denpasar',
      bidangUsaha: 'Transportasi',
      pic: 'Grace Lee',
      emailPIC: 'grace@mitrasejahtera.com'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddSuspect = (formData: SuspectFormData) => {
    const newSuspect: Suspect = {
      id: (suspects.length + 1).toString(),
      no: suspects.length + 1,
      namaPerusahaan: formData.namaPerusahaan,
      noTelp: formData.noTelp,
      alamatPerusahaan: formData.alamatPerusahaan,
      bidangUsaha: formData.bidangUsaha,
      pic: formData.pic,
      emailPIC: formData.emailPIC
    };

    setSuspects(prev => [newSuspect, ...prev.map(s => ({ ...s, no: s.no + 1 }))]);
  };

  const handleViewDetail = (suspect: Suspect) => {
    const detailData: SuspectDetailData = {
      id: suspect.id,
      namaPerusahaan: suspect.namaPerusahaan,
      pic: suspect.pic,
      emailPIC: suspect.emailPIC,
      noTelp: suspect.noTelp,
      alamatPerusahaan: suspect.alamatPerusahaan,
      bidangUsaha: suspect.bidangUsaha
    };
    
    setSelectedSuspectForDetail(detailData);
    setIsDetailModalOpen(true);
  };

  // Filter suspects based on search criteria
  const filteredSuspects = suspects.filter(suspect => {
    const matchesNama = suspect.namaPerusahaan.toLowerCase().includes(searchNama.toLowerCase());
    const matchesBidangUsaha = suspect.bidangUsaha.toLowerCase().includes(searchBidangUsaha.toLowerCase());
    return matchesNama && matchesBidangUsaha;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredSuspects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuspects = filteredSuspects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (suspect: Suspect) => {
    setItemToDelete(suspect);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSuspects(prev => prev.filter(s => s.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR SUSPECT
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Suspect</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Search Nama Perusahaan */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Nama Perusahaan
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchNama}
                    onChange={(e) => setSearchNama(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan nama perusahaan..."
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search Bidang Usaha */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Bidang Usaha
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchBidangUsaha}
                    onChange={(e) => setSearchBidangUsaha(e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan bidang usaha..."
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
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

        {/* Suspect Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Perusahaan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No. Telp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Alamat Perusahaan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bidang Usaha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">PIC</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email PIC</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSuspects.map((suspect, index) => (
                  <tr 
                    key={suspect.id}
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
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0">
                          <Info className="h-2 w-2 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{suspect.no}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{suspect.namaPerusahaan}</td>
                    <td className="px-6 py-4 text-gray-600">{suspect.noTelp}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={suspect.alamatPerusahaan}>
                      {suspect.alamatPerusahaan}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{suspect.bidangUsaha}</td>
                    <td className="px-6 py-4 text-gray-600">{suspect.pic}</td>
                    <td className="px-6 py-4">
                      <a 
                        href={`mailto:${suspect.emailPIC}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {suspect.emailPIC}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => setIsModalOpen(true)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(suspect)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewDetail(suspect)}
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

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSuspects.length)} of {filteredSuspects.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suspect Modal */}
      <SuspectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSuspect}
      />

      {/* Suspect Detail Modal */}
      <SuspectDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        suspectData={selectedSuspectForDetail}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaPerusahaan}
      />
    </div>
  );
};

export default SuspectDashboard;
