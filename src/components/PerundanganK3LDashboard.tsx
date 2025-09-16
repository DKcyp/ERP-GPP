import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, AlertTriangle, CheckCircle, Clock, FileCheck } from 'lucide-react';

interface PerundanganK3L {
  id: string;
  nomorPerundangan: string;
  judulPerundangan: string;
  jenisPerundangan: 'Undang-Undang' | 'Peraturan Pemerintah' | 'Peraturan Menteri' | 'Keputusan Menteri' | 'Standar Nasional';
  instansiPenerbit: string;
  tanggalTerbit: string;
  tanggalBerlaku: string;
  tanggalKadaluarsa: string;
  statusCompliance: 'Compliant' | 'Non-Compliant' | 'Under Review' | 'Expired';
  tingkatPrioritas: 'High' | 'Medium' | 'Low';
  deskripsi: string;
  dokumenPath: string;
  picResponsible: string;
  lastReview: string;
  nextReview: string;
  keterangan: string;
}

const PerundanganK3LDashboard: React.FC = () => {
  const [perundanganList, setPerundanganList] = useState<PerundanganK3L[]>([]);
  const [filteredList, setFilteredList] = useState<PerundanganK3L[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PerundanganK3L | null>(null);

  // Sample data
  useEffect(() => {
    const sampleData: PerundanganK3L[] = [
      {
        id: '1',
        nomorPerundangan: 'UU No. 1/1970',
        judulPerundangan: 'Undang-Undang Keselamatan Kerja',
        jenisPerundangan: 'Undang-Undang',
        instansiPenerbit: 'Pemerintah RI',
        tanggalTerbit: '1970-01-12',
        tanggalBerlaku: '1970-01-12',
        tanggalKadaluarsa: '2030-12-31',
        statusCompliance: 'Compliant',
        tingkatPrioritas: 'High',
        deskripsi: 'Mengatur tentang keselamatan kerja di tempat kerja',
        dokumenPath: '/documents/uu-1-1970.pdf',
        picResponsible: 'Ahmad Santoso',
        lastReview: '2024-01-15',
        nextReview: '2024-07-15',
        keterangan: 'Compliance check completed'
      },
      {
        id: '2',
        nomorPerundangan: 'PP No. 50/2012',
        judulPerundangan: 'Sistem Manajemen Keselamatan dan Kesehatan Kerja',
        jenisPerundangan: 'Peraturan Pemerintah',
        instansiPenerbit: 'Pemerintah RI',
        tanggalTerbit: '2012-04-12',
        tanggalBerlaku: '2012-04-12',
        tanggalKadaluarsa: '2025-04-12',
        statusCompliance: 'Under Review',
        tingkatPrioritas: 'High',
        deskripsi: 'Mengatur tentang penerapan SMK3 di perusahaan',
        dokumenPath: '/documents/pp-50-2012.pdf',
        picResponsible: 'Siti Rahayu',
        lastReview: '2023-12-01',
        nextReview: '2024-06-01',
        keterangan: 'Sedang dalam proses review compliance'
      }
    ];
    setPerundanganList(sampleData);
    setFilteredList(sampleData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = perundanganList.filter(item => {
      const matchesSearch = item.judulPerundangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nomorPerundangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.instansiPenerbit.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJenis = filterJenis === '' || item.jenisPerundangan === filterJenis;
      const matchesStatus = filterStatus === '' || item.statusCompliance === filterStatus;
      
      return matchesSearch && matchesJenis && matchesStatus;
    });
    
    setFilteredList(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterJenis, filterStatus, perundanganList]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList.slice(startIndex, endIndex);

  // Statistics
  const totalPerundangan = perundanganList.length;
  const compliantCount = perundanganList.filter(item => item.statusCompliance === 'Compliant').length;
  const underReviewCount = perundanganList.filter(item => item.statusCompliance === 'Under Review').length;
  const expiredCount = perundanganList.filter(item => item.statusCompliance === 'Expired').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Non-Compliant': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Under Review': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Expired': return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default: return <FileCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Perundangan K3L</h1>
        <p className="text-gray-600">Kelola peraturan Keselamatan, Kesehatan Kerja dan Lingkungan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileCheck className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Perundangan</p>
              <p className="text-2xl font-bold text-gray-900">{totalPerundangan}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-gray-900">{compliantCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{underReviewCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{expiredCount}</p>
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
                  placeholder="Cari perundangan, nomor, atau instansi..."
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
                <option value="">Semua Jenis</option>
                <option value="Undang-Undang">Undang-Undang</option>
                <option value="Peraturan Pemerintah">Peraturan Pemerintah</option>
                <option value="Peraturan Menteri">Peraturan Menteri</option>
                <option value="Keputusan Menteri">Keputusan Menteri</option>
                <option value="Standar Nasional">Standar Nasional</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Under Review">Under Review</option>
                <option value="Expired">Expired</option>
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
                Tambah Perundangan
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Perundangan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instansi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Berlaku</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nomorPerundangan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate">{item.judulPerundangan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jenisPerundangan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.instansiPenerbit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.tanggalBerlaku).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(item.statusCompliance)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.statusCompliance)}`}>
                        {item.statusCompliance}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.tingkatPrioritas)}`}>
                      {item.tingkatPrioritas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.picResponsible}</td>
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

export default PerundanganK3LDashboard;
