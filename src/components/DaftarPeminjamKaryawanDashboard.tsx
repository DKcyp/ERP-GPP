import React, { useState, useEffect } from 'react';
import EntryPinjamanPegawaiModal, { EntryPinjamanPegawaiFormData } from './EntryPinjamanPegawaiModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus,
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface PeminjamKaryawanData {
  id: string;
  no: number;
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  tanggalPinjam: string;
  keterangan: string;
  status: 'Lunas' | 'Belum Lunas';
}

const DaftarPeminjamKaryawanDashboard: React.FC = () => {
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [kodePegawai, setKodePegawai] = useState('');
  const [namaPegawai, setNamaPegawai] = useState('Mr. White');
  const [searchQuery, setSearchQuery] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PeminjamKaryawanData | null>(null);
  const [sortField, setSortField] = useState<keyof PeminjamKaryawanData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the second image
  const [peminjamKaryawanData, setPeminjamKaryawanData] = useState<PeminjamKaryawanData[]>([
    {
      id: '1',
      no: 1,
      kodePegawai: 'EMP001',
      namaPegawai: 'Ahmad',
      jenisPegawai: 'Tetap',
      tanggalPinjam: '2024-08-15',
      keterangan: 'Keperluan Pribadi',
      status: 'Belum Lunas'
    },
    {
      id: '2',
      no: 2,
      kodePegawai: 'EMP002',
      namaPegawai: 'Budi',
      jenisPegawai: 'Kontrak',
      tanggalPinjam: '2024-07-20',
      keterangan: 'Keperluan Pribadi',
      status: 'Lunas'
    },
    {
      id: '3',
      no: 3,
      kodePegawai: 'EMP003',
      namaPegawai: 'Callista',
      jenisPegawai: 'Magang',
      tanggalPinjam: '2024-09-01',
      keterangan: 'Keperluan Pribadi',
      status: 'Lunas'
    },
    {
      id: '4',
      no: 4,
      kodePegawai: 'EMP004',
      namaPegawai: 'Dani',
      jenisPegawai: 'Freelance',
      tanggalPinjam: '2024-08-10',
      keterangan: 'Keperluan Pribadi',
      status: 'Belum Lunas'
    },
    {
      id: '5',
      no: 5,
      kodePegawai: 'EMP005',
      namaPegawai: 'Eko',
      jenisPegawai: 'Tetap',
      tanggalPinjam: '2024-06-18',
      keterangan: 'Keperluan Pribadi',
      status: 'Lunas'
    }
  ]);

  const kodePegawaiOptions = [
    'EMP001',
    'EMP002',
    'EMP003',
    'EMP004',
    'EMP005'
  ];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddPeminjamKaryawan = (formData: EntryPinjamanPegawaiFormData) => {
    const newPeminjamKaryawan: PeminjamKaryawanData = {
      id: (peminjamKaryawanData.length + 1).toString(),
      no: peminjamKaryawanData.length + 1,
      kodePegawai: formData.kodePegawai,
      namaPegawai: formData.namaPegawai,
      jenisPegawai: formData.jenisPegawai,
      tanggalPinjam: new Date(formData.periode).toLocaleDateString('en-CA'),
      keterangan: 'Keperluan Pribadi',
      status: 'Belum Lunas'
    };

    setPeminjamKaryawanData(prev => [newPeminjamKaryawan, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleSort = (field: keyof PeminjamKaryawanData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (peminjamKaryawan: PeminjamKaryawanData) => {
    setItemToDelete(peminjamKaryawan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setPeminjamKaryawanData(prev => prev.filter(p => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas': return 'bg-green-600 text-white';
      case 'Belum Lunas': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJenisPegawaiColor = (jenis: string) => {
    switch (jenis) {
      case 'Tetap': return 'bg-green-100 text-green-800 border-green-200';
      case 'Kontrak': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Magang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Freelance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter data based on search criteria
  const filteredData = peminjamKaryawanData.filter(item => {
    const matchesKodePegawai = kodePegawai ? item.kodePegawai === kodePegawai : true;
    const matchesNamaPegawai = item.namaPegawai.toLowerCase().includes(namaPegawai.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      item.kodePegawai.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaPegawai.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesKodePegawai && matchesNamaPegawai && matchesSearch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">
            Daftar Peminjaman Karyawan
          </h1>

          {/* Filter Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Periode Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Periode</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Awal
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tanggalAwal}
                      onChange={(e) => setTanggalAwal(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Akhir
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tanggalAkhir}
                      onChange={(e) => setTanggalAkhir(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pegawai Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Pegawai</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pegawai
                  </label>
                  <select
                    value={kodePegawai}
                    onChange={(e) => setKodePegawai(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Pilih Kode Pegawai</option>
                    {kodePegawaiOptions.map((kode) => (
                      <option key={kode} value={kode}>{kode}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pegawai
                  </label>
                  <input
                    type="text"
                    value={namaPegawai}
                    onChange={(e) => setNamaPegawai(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Mr. White"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={handleSearch}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Cari Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center justify-center space-x-2">
              <FileSpreadsheet className="h-5 w-5" />
              <span>Cetak Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center justify-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Cetak PDF</span>
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-600/25 flex items-center justify-center space-x-2">
              <File className="h-5 w-5" />
              <span>Cetak Semua Pinjaman</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Table Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Daftar Pinjaman</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center space-x-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </button>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between">
          {/* Show entries control */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('no')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No</span>
                      {sortField === 'no' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('kodePegawai')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kode Pegawai</span>
                      {sortField === 'kodePegawai' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('namaPegawai')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pegawai</span>
                      {sortField === 'namaPegawai' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('jenisPegawai')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Jenis Pegawai</span>
                      {sortField === 'jenisPegawai' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tanggalPinjam')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal Pinjam</span>
                      {sortField === 'tanggalPinjam' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('keterangan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Keterangan</span>
                      {sortField === 'keterangan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.kodePegawai}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaPegawai}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getJenisPegawaiColor(item.jenisPegawai)}`}>
                        {item.jenisPegawai}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalPinjam}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.keterangan}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="p-1.5 bg-yellow-500 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-yellow-600"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 bg-red-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  1
                </button>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entry Pinjaman Pegawai Modal */}
      <EntryPinjamanPegawaiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPeminjamKaryawan}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaPegawai}
      />
    </div>
  );
};

export default DaftarPeminjamKaryawanDashboard;
