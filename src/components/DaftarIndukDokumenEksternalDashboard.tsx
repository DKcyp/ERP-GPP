import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, AlertTriangle, Calendar, ExternalLink, Archive } from 'lucide-react';

interface DokumenEksternal {
  id: string;
  kodeDokumen: string;
  namaDokumen: string;
  jenisKategori: 'Standar Internasional' | 'Regulasi Pemerintah' | 'Sertifikat' | 'Kontrak' | 'Panduan Teknis';
  sumberDokumen: string;
  nomorRevisi: string;
  tanggalTerbit: string;
  tanggalBerlaku: string;
  tanggalKadaluarsa: string;
  statusDokumen: 'Active' | 'Expired' | 'Under Review' | 'Archived';
  tingkatKepentingan: 'Critical' | 'Important' | 'Normal';
  lokasiFisik: string;
  lokasisDigital: string;
  picPengelola: string;
  departemenTerkait: string;
  keterangan: string;
}

const DaftarIndukDokumenEksternalDashboard: React.FC = () => {
  const [dokumenList, setDokumenList] = useState<DokumenEksternal[]>([]);
  const [filteredList, setFilteredList] = useState<DokumenEksternal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DokumenEksternal | null>(null);

  // Sample data
  useEffect(() => {
    const sampleData: DokumenEksternal[] = [
      {
        id: '1',
        kodeDokumen: 'EXT-ISO-001',
        namaDokumen: 'ISO 45001:2018 Occupational Health and Safety Management Systems',
        jenisKategori: 'Standar Internasional',
        sumberDokumen: 'International Organization for Standardization',
        nomorRevisi: 'Rev. 2018',
        tanggalTerbit: '2018-03-12',
        tanggalBerlaku: '2018-03-12',
        tanggalKadaluarsa: '2025-03-12',
        statusDokumen: 'Active',
        tingkatKepentingan: 'Critical',
        lokasiFisik: 'Rak A-1, Lantai 2',
        lokasisDigital: '/documents/external/iso45001-2018.pdf',
        picPengelola: 'Ahmad Rizki',
        departemenTerkait: 'QHSE',
        keterangan: 'Standar sistem manajemen K3'
      },
      {
        id: '2',
        kodeDokumen: 'EXT-CERT-002',
        namaDokumen: 'Sertifikat Kalibrasi Alat Ukur Radiasi',
        jenisKategori: 'Sertifikat',
        sumberDokumen: 'BATAN - Badan Tenaga Nuklir Nasional',
        nomorRevisi: 'CERT-2024-001',
        tanggalTerbit: '2024-01-15',
        tanggalBerlaku: '2024-01-15',
        tanggalKadaluarsa: '2025-01-15',
        statusDokumen: 'Active',
        tingkatKepentingan: 'Critical',
        lokasiFisik: 'Safe Box QHSE',
        lokasisDigital: '/documents/external/cert-kalibrasi-2024.pdf',
        picPengelola: 'Siti Nurhaliza',
        departemenTerkait: 'QHSE',
        keterangan: 'Sertifikat kalibrasi untuk survey meter'
      },
      {
        id: '3',
        kodeDokumen: 'EXT-REG-003',
        namaDokumen: 'Peraturan Menteri ESDM No. 2/2023',
        jenisKategori: 'Regulasi Pemerintah',
        sumberDokumen: 'Kementerian ESDM',
        nomorRevisi: 'Rev. 2023',
        tanggalTerbit: '2023-02-10',
        tanggalBerlaku: '2023-02-10',
        tanggalKadaluarsa: '2024-02-10',
        statusDokumen: 'Expired',
        tingkatKepentingan: 'Important',
        lokasiFisik: 'Rak B-2, Lantai 1',
        lokasisDigital: '/documents/external/permen-esdm-2-2023.pdf',
        picPengelola: 'Budi Santoso',
        departemenTerkait: 'Legal',
        keterangan: 'Perlu update ke versi terbaru'
      }
    ];
    setDokumenList(sampleData);
    setFilteredList(sampleData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = dokumenList.filter(item => {
      const matchesSearch = item.namaDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.kodeDokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sumberDokumen.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJenis = filterJenis === '' || item.jenisKategori === filterJenis;
      const matchesStatus = filterStatus === '' || item.statusDokumen === filterStatus;
      
      return matchesSearch && matchesJenis && matchesStatus;
    });
    
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterJenis, filterStatus, dokumenList]);

  // Check for expiring documents (within 90 days)
  const getExpiringDocuments = () => {
    const today = new Date();
    const ninetyDaysFromNow = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
    
    return dokumenList.filter(doc => {
      const expiryDate = new Date(doc.tanggalKadaluarsa);
      return expiryDate <= ninetyDaysFromNow && expiryDate > today;
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  // Statistics
  const totalDokumen = dokumenList.length;
  const activeDokumen = dokumenList.filter(item => item.statusDokumen === 'Active').length;
  const expiredDokumen = dokumenList.filter(item => item.statusDokumen === 'Expired').length;
  const expiringDokumen = getExpiringDocuments().length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKepentinganColor = (kepentingan: string) => {
    switch (kepentingan) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Important': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (tanggalKadaluarsa: string) => {
    const today = new Date();
    const expiryDate = new Date(tanggalKadaluarsa);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Induk Dokumen Eksternal</h1>
        <p className="text-gray-600">Kelola dokumen eksternal dengan tracking expiry dan version control</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Dokumen</p>
              <p className="text-2xl font-bold text-gray-900">{totalDokumen}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ExternalLink className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeDokumen}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{expiringDokumen}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Archive className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{expiredDokumen}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari dokumen, kode, atau sumber..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                <option value="Standar Internasional">Standar Internasional</option>
                <option value="Regulasi Pemerintah">Regulasi Pemerintah</option>
                <option value="Sertifikat">Sertifikat</option>
                <option value="Kontrak">Kontrak</option>
                <option value="Panduan Teknis">Panduan Teknis</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Under Review">Under Review</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Dokumen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Dokumen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kadaluarsa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kepentingan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.kodeDokumen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate">{item.namaDokumen}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jenisKategori}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate">{item.sumberDokumen}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {isExpiringSoon(item.tanggalKadaluarsa) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                      )}
                      {new Date(item.tanggalKadaluarsa).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.statusDokumen)}`}>
                      {item.statusDokumen}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKepentinganColor(item.tingkatKepentingan)}`}>
                      {item.tingkatKepentingan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.picPengelola}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredList.length)}</span> of{' '}
                <span className="font-medium">{filteredList.length}</span> results
              </p>
              <select
                className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarIndukDokumenEksternalDashboard;
