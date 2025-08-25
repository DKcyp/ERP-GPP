import React, { useState, useEffect } from 'react';
import ManPowerModal, { ManPowerFormData } from './ManPowerModal';
import ManPowerDetailModal from './ManPowerDetailModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { ManPowerDetailData } from '../types';
import { Search, Plus, FileSpreadsheet, FileText, File, Edit, Trash2, Eye, Calendar, Clock, Info, ChevronLeft, ChevronRight, ArrowUp, Printer as Print } from 'lucide-react';

interface ManPower {
  id: string;
  no: number;
  proyek: string;
  lokasi: string;
  kualifikasi: string[];
  ratePerHari: string[];
  estimasiRate: string;
  totalOrang: string;
  catatanTambahan: string;
  mob: string;
  demob: string;
  durasi: string;
  total: string;
  status: 'Selesai' | 'Dalam Proses' | 'Pending';
}

const ManPowerDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ManPower | null>(null);
  const [isManPowerModalOpen, setIsManPowerModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedManPowerForDetail, setSelectedManPowerForDetail] = useState<ManPowerDetailData | null>(null);
  const [sortField, setSortField] = useState<keyof ManPower | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [manPowerData, setManPowerData] = useState<ManPower[]>([
    {
      id: '1',
      no: 1,
      proyek: 'Pembatan A',
      lokasi: 'Jakarta',
      kualifikasi: ['Welder', 'Pipe Fitter'],
      ratePerHari: ['Rp 15.000.000', 'Rp 10.000.000'],
      estimasiRate: 'Rp 26.700.000',
      totalOrang: '15',
      catatanTambahan: 'Proyek pembangunan gedung dengan spesifikasi khusus untuk welding dan pipe fitting',
      mob: '2025-02-01',
      demob: '2025-02-15',
      durasi: '15 Hari',
      total: 'Rp 225.000.000',
      status: 'Selesai'
    },
    {
      id: '2',
      no: 2,
      proyek: 'Gedung B',
      lokasi: 'Bandung',
      kualifikasi: ['Pipe Fitter', 'Quality Inspector'],
      ratePerHari: ['Rp 12.500.000', 'RP 14.000.000'],
      estimasiRate: 'Rp 26.500.000',
      totalOrang: '12',
      catatanTambahan: 'Proyek gedung bertingkat dengan fokus pada quality control dan pipe fitting',
      mob: '2025-02-05',
      demob: '2025-02-20',
      durasi: '16 Hari',
      total: 'Rp 200.000.000',
      status: 'Selesai'
    },
    {
      id: '3',
      no: 3,
      proyek: 'Jalan C',
      lokasi: 'Surabaya',
      kualifikasi: ['Welder', 'Fabricator'],
      ratePerHari: ['Rp 16.800.000', 'Rp 13.000.000'],
      estimasiRate: 'Rp 29.800.000',
      totalOrang: '18',
      catatanTambahan: 'Proyek infrastruktur jalan dengan kebutuhan welding dan fabrication khusus',
      mob: '2025-02-10',
      demob: '2025-02-25',
      durasi: '16 Hari',
      total: 'Rp 268.800.000',
      status: 'Dalam Proses'
    }
  ]);

  const statusOptions = ['Selesai', 'Dalam Proses', 'Pending'];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddManPower = (formData: ManPowerFormData) => {
    // Calculate estimasi rate from kebutuhan tenaga kerja
    const totalRate = formData.kebutuhanTenagaKerja.reduce((sum, item) => {
      const rate = parseFloat(item.rateKualifikasi?.replace(/[^\d]/g, '') || '0');
      return sum + rate;
    }, 0);
    
    // Calculate total orang from kebutuhan tenaga kerja
    const totalOrang = formData.kebutuhanTenagaKerja.reduce((sum, item) => {
      const jumlah = parseInt(item.jumlahKebutuhan || '0');
      return sum + jumlah;
    }, 0);

    const newManPower: ManPower = {
      id: (manPowerData.length + 1).toString(),
      no: manPowerData.length + 1,
      proyek: `Proyek ${formData.untukKebutuhanSOTurunan}`,
      lokasi: formData.lokasiKerja || 'Jakarta',
      kualifikasi: formData.kebutuhanTenagaKerja.map(k => k.jabatan),
      ratePerHari: formData.kebutuhanTenagaKerja.map(k => k.rateKualifikasi || 'Rp 0'),
      estimasiRate: `Rp ${totalRate.toLocaleString('id-ID')}`,
      totalOrang: totalOrang.toString(),
      catatanTambahan: formData.deskripsiJabatan || 'Tidak ada catatan tambahan',
      mob: formData.mob,
      demob: formData.demob,
      durasi: '15 Hari',
      total: 'Rp 100.000.000',
      status: 'Pending'
    };

    setManPowerData(prev => [newManPower, ...prev.map(m => ({ ...m, no: m.no + 1 }))]);
  };

  const handleViewDetail = (manPower: ManPower) => {
    const detailData: ManPowerDetailData = {
      soNumber: `SO-${String(manPower.no).padStart(4, '0')}`,
      namaProyek: manPower.proyek,
      lokasi: manPower.lokasi,
      kualifikasi: manPower.kualifikasi,
      estimasiRate: manPower.estimasiRate,
      mob: manPower.mob,
      demob: manPower.demob,
      totalOrang: manPower.totalOrang,
      catatanTambahan: manPower.catatanTambahan
    };
    
    setSelectedManPowerForDetail(detailData);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (manPower: ManPower) => {
    setItemToDelete(manPower);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setManPowerData(prev => prev.filter(m => m.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof ManPower) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-800 border-green-200';
      case 'Dalam Proses': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter data based on search criteria
  const filteredData = manPowerData.filter(item => {
    const matchesNoSO = item.no.toString().includes(searchNoSO);
    const matchesNamaProject = item.proyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    
    return matchesNoSO && matchesNamaProject && matchesStatus;
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
            Permintaan Man Power
          </h1>

          {/* Man Power Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Man Power</h2>
              <button 
                onClick={() => setIsManPowerModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Search and Filter Section */}
            <div className="space-y-4 mb-6">
              {/* Inputs Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Search No SO */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cari No SO
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchNoSO}
                        onChange={(e) => setSearchNoSO(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                        placeholder="SO001"
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
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
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchNamaProject}
                        onChange={(e) => setSearchNamaProject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                        placeholder="Proyek Medco"
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pilih Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  >
                    <option value="">--Pilih Status--</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Range and Search Button Row */}
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
      </div>

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
                    onClick={() => handleSort('proyek')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Proyek</span>
                      {sortField === 'proyek' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lokasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Kualifikasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate Per Hari</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">DEMOB</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Durasi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.proyek}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.lokasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="space-y-1">
                        {item.kualifikasi.map((kual, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{kual}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="space-y-1">
                        {item.ratePerHari.map((rate, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{rate}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.durasi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.total}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleViewDetail(item)}
                          className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded transition-all duration-200 hover:scale-110"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
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
                        <button 
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-all duration-200 hover:scale-110"
                          title="Print"
                        >
                          <Print className="h-3.5 w-3.5" />
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
      </div>

      {/* Man Power Modal */}
      <ManPowerModal
        isOpen={isManPowerModalOpen}
        onClose={() => setIsManPowerModalOpen(false)}
        onSave={handleAddManPower}
      />

      {/* Man Power Detail Modal */}
      <ManPowerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        manPowerData={selectedManPowerForDetail}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.proyek}
      />
    </div>
  );
};

export default ManPowerDashboard;
