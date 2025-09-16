import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, FileText, Package, Users, AlertCircle } from 'lucide-react';

interface APDRecord {
  id: string;
  kodeAPD: string;
  namaAPD: string;
  kategori: string;
  ukuran: string;
  serialNumber: string;
  tanggalDistribusi: string;
  namaPenerima: string;
  departemen: string;
  kuota: number;
  terdistribusi: number;
  sisa: number;
  status: 'Tersedia' | 'Terdistribusi' | 'Habis';
  kondisi: 'Baik' | 'Rusak' | 'Perlu Penggantian';
  keterangan: string;
}

const PembagianAPDRecordDashboard: React.FC = () => {
  const [apdRecords, setApdRecords] = useState<APDRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<APDRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample data
  useEffect(() => {
    const sampleData: APDRecord[] = [
      {
        id: '1',
        kodeAPD: 'APD-001',
        namaAPD: 'Helm Safety',
        kategori: 'Pelindung Kepala',
        ukuran: 'L',
        serialNumber: 'HS-2024-001',
        tanggalDistribusi: '2024-01-15',
        namaPenerima: 'Ahmad Rizki',
        departemen: 'Produksi',
        kuota: 50,
        terdistribusi: 35,
        sisa: 15,
        status: 'Tersedia',
        kondisi: 'Baik',
        keterangan: 'Distribusi rutin bulanan'
      },
      {
        id: '2',
        kodeAPD: 'APD-002',
        namaAPD: 'Sarung Tangan Karet',
        kategori: 'Pelindung Tangan',
        ukuran: 'M',
        serialNumber: 'STK-2024-002',
        tanggalDistribusi: '2024-01-20',
        namaPenerima: 'Siti Nurhaliza',
        departemen: 'Quality Control',
        kuota: 100,
        terdistribusi: 100,
        sisa: 0,
        status: 'Habis',
        kondisi: 'Baik',
        keterangan: 'Perlu restock segera'
      }
    ];
    setApdRecords(sampleData);
    setFilteredRecords(sampleData);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = apdRecords.filter(record => {
      const matchesSearch = record.namaAPD.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.kodeAPD.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === '' || record.status === filterStatus;
      const matchesKategori = filterKategori === '' || record.kategori === filterKategori;
      
      return matchesSearch && matchesStatus && matchesKategori;
    });
    
    setFilteredRecords(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterKategori, apdRecords]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Statistics
  const totalAPD = apdRecords.length;
  const totalTerdistribusi = apdRecords.reduce((sum, record) => sum + record.terdistribusi, 0);
  const totalSisa = apdRecords.reduce((sum, record) => sum + record.sisa, 0);
  const habisStock = apdRecords.filter(record => record.status === 'Habis').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tersedia': return 'bg-green-100 text-green-800';
      case 'Terdistribusi': return 'bg-blue-100 text-blue-800';
      case 'Habis': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi) {
      case 'Baik': return 'bg-green-100 text-green-800';
      case 'Rusak': return 'bg-red-100 text-red-800';
      case 'Perlu Penggantian': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembagian APD Record</h1>
        <p className="text-gray-600">Kelola distribusi dan pencatatan Alat Pelindung Diri</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total APD</p>
              <p className="text-2xl font-bold text-gray-900">{totalAPD}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terdistribusi</p>
              <p className="text-2xl font-bold text-gray-900">{totalTerdistribusi}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sisa Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalSisa}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Habis Stock</p>
              <p className="text-2xl font-bold text-gray-900">{habisStock}</p>
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
                  placeholder="Cari APD, kode, atau penerima..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Terdistribusi">Terdistribusi</option>
                <option value="Habis">Habis</option>
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                <option value="Pelindung Kepala">Pelindung Kepala</option>
                <option value="Pelindung Tangan">Pelindung Tangan</option>
                <option value="Pelindung Kaki">Pelindung Kaki</option>
                <option value="Pelindung Mata">Pelindung Mata</option>
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
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Tambah APD
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode APD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama APD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kuota/Distribusi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.kodeAPD}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.namaAPD}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.kategori}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.serialNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div className="font-medium">{record.namaPenerima}</div>
                      <div className="text-gray-400">{record.departemen}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{record.kuota} / {record.terdistribusi}</div>
                      <div className="text-gray-400">Sisa: {record.sisa}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKondisiColor(record.kondisi)}`}>
                      {record.kondisi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
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
                <span className="font-medium">{Math.min(endIndex, filteredRecords.length)}</span> of{' '}
                <span className="font-medium">{filteredRecords.length}</span> results
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

export default PembagianAPDRecordDashboard;
