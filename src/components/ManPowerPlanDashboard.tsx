import React, { useState, useEffect } from 'react';
import ManPowerPlanDetailModal from './ManPowerPlanDetailModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { ManPowerPlanDetailData } from '../types';
import { 
  Search, 
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface ManPowerPlan {
  id: string;
  no: number;
  kodePegawai: string;
  namaPegawai: string;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  lokasi: string;
  kualifikasi: string;
  ratePerHari: string;
  mob: string;
  demob: string;
  durasi: string;
  total: string;
}

const ManPowerPlanDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedManPowerPlanForDetail, setSelectedManPowerPlanForDetail] = useState<ManPowerPlanDetailData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ManPowerPlan | null>(null);
  const [sortField, setSortField] = useState<keyof ManPowerPlan | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [manPowerPlanData, setManPowerPlanData] = useState<ManPowerPlan[]>([
    {
      id: '1',
      no: 1,
      kodePegawai: 'KP001',
      namaPegawai: 'John Doe',
      noSO: 'SO001',
      soTurunan: 'SO001.31',
      namaProyek: 'Proyek Jembatan A',
      lokasi: 'Jakarta',
      kualifikasi: 'Welder',
      ratePerHari: 'Rp 15,000,000',
      mob: '2025-02-01',
      demob: '2025-02-15',
      durasi: '15 Hari',
      total: 'Rp 225,000,000'
    },
    {
      id: '2',
      no: 2,
      kodePegawai: 'KP002',
      namaPegawai: 'Siti Aminah',
      noSO: 'SO002',
      soTurunan: 'SO002.43',
      namaProyek: 'Proyek Gedung B',
      lokasi: 'Bandung',
      kualifikasi: 'Pipe Fitter',
      ratePerHari: 'Rp 12,500,000',
      mob: '2025-02-05',
      demob: '2025-02-20',
      durasi: '16 Hari',
      total: 'Rp 200,000,000'
    },
    {
      id: '3',
      no: 3,
      kodePegawai: 'KP003',
      namaPegawai: 'David Lee',
      noSO: 'SO003',
      soTurunan: 'SO003.12',
      namaProyek: 'Proyek Jalan C',
      lokasi: 'Surabaya',
      kualifikasi: 'Welder',
      ratePerHari: 'Rp 16,800,000',
      mob: '2025-02-10',
      demob: '2025-02-25',
      durasi: '16 Hari',
      total: 'Rp 268,800,000'
    },
    {
      id: '4',
      no: 4,
      kodePegawai: 'KP004',
      namaPegawai: 'Sarah Jonas',
      noSO: 'SO004',
      soTurunan: 'SO004.12',
      namaProyek: 'Proyek Pelabuhan D',
      lokasi: 'Semarang',
      kualifikasi: 'Quality Inspector',
      ratePerHari: 'Rp 18,200,000',
      mob: '2025-02-15',
      demob: '2025-03-01',
      durasi: '15 Hari',
      total: 'Rp 273,000,000'
    },
    {
      id: '5',
      no: 5,
      kodePegawai: 'KP005',
      namaPegawai: 'Michael Brown',
      noSO: 'SO005',
      soTurunan: 'SO005.87',
      namaProyek: 'Proyek Pabrik E',
      lokasi: 'Medan',
      kualifikasi: 'Fabricator',
      ratePerHari: 'Rp 14,750,000',
      mob: '2025-02-20',
      demob: '2025-03-05',
      durasi: '15 Hari',
      total: 'Rp 221,250,000'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleViewDetail = (manPowerPlan: ManPowerPlan) => {
    const detailData: ManPowerPlanDetailData = {
      id: manPowerPlan.id,
      kodePegawai: manPowerPlan.kodePegawai,
      namaPegawai: manPowerPlan.namaPegawai,
      noSO: manPowerPlan.noSO,
      soTurunan: manPowerPlan.soTurunan,
      namaProyek: manPowerPlan.namaProyek,
      lokasi: manPowerPlan.lokasi,
      kualifikasi: manPowerPlan.kualifikasi,
      ratePerHari: manPowerPlan.ratePerHari,
      mob: manPowerPlan.mob,
      demob: manPowerPlan.demob,
      durasi: manPowerPlan.durasi,
      total: manPowerPlan.total,
      // Data Pemohon
      nama: 'Budi setiadi',
      tanggalMulaiKerja: '13/02/2024',
      jabatan: 'Software Engineer',
      departemen: 'IT',
      // Data Pegawai
      kodePegawaiDetail: 'k-001',
      namaPegawaiDetail: 'John Doe',
      level: 'Senior',
      lokasiKerja: 'Jakarta',
      // Kompensasi
      gaji: 'Rp 15.000.000',
      tunjanganTransport: 'Rp 1.000.000',
      tunjanganJabatan: 'Rp 2.000.000',
      tunjanganMakan: 'Rp 750.000',
      tunjanganLainnya: 'Rp 500.000',
      hariKerja: 'Senin - Jumat',
      jamKerja: '08:00 - 17:00',
      // Deskripsi Jabatan
      deskripsiJabatan: 'Merancang dan mengembangkan perangkat lunak...',
      // Kualifikasi
      usia: '25 - 35 Tahun',
      status: 'Lajang',
      jenisKelamin: 'Laki-laki',
      pendidikan: 'S1 Teknik Informatika / Sistem Informasi',
      // Lampiran Dokumen
      mcu: 'PEMERIKSAAN GENERAL CHEK UP',
      sertifikasi: 'Certificate Document'
    };
    
    setSelectedManPowerPlanForDetail(detailData);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (manPowerPlan: ManPowerPlan) => {
    setItemToDelete(manPowerPlan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setManPowerPlanData(prev => prev.filter(m => m.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleApprove = () => {
    console.log('Man Power Plan approved');
    // Handle approval logic here
  };

  const handleReject = () => {
    console.log('Man Power Plan rejected');
    // Handle rejection logic here
  };

  const handleSort = (field: keyof ManPowerPlan) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = manPowerPlanData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesNamaProject = item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    
    return matchesNoSO && matchesNamaProject;
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
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Daftar Man Power Plan
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search No SO */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari No SO
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNoSO}
                    onChange={(e) => setSearchNoSO(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="SO001"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Nama Project */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Project
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaProject}
                    onChange={(e) => setSearchNamaProject(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Proyek Medco"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Second Row - Date Range and Search Button */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 opacity-0">
                  Search
                </label>
                <button 
                  onClick={handleSearch}
                  className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Man Power Plan Detail Modal */}
      <ManPowerPlanDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        manPowerPlanData={selectedManPowerPlanForDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaPegawai}
      />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Export Bar */}
        <div className="flex items-center justify-between">
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
          <div className="flex space-x-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
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
                    onClick={() => handleSort('noSO')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO</span>
                      {sortField === 'noSO' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SO Turunan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Proyek</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lokasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kualifikasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate Per Hari</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">DEMOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Durasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.soTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.lokasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.kualifikasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.ratePerHari}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.durasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleViewDetail(item)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-all duration-200 hover:scale-110"
                          title="Approve/View Details"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 hover:scale-110"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110"
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
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
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

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>2023 © Mazar</p>
          <p className="mt-1">
            Crafted with <span className="text-red-500">♥</span> by <span className="text-blue-600">Saugi</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManPowerPlanDashboard;
