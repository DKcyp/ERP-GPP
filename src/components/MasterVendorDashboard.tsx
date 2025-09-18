import React, { useState, useEffect } from 'react';
import VendorModal, { VendorFormData } from './VendorModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import VendorPODetailModal from './VendorPODetailModal';
import { 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  File,
  Edit,
  Trash2,
  ArrowUp
} from 'lucide-react';

interface MasterVendorData {
  id: string;
  no: number;
  tanggal: string;
  namaVendor: string;
  kodeVendor: string;
  alamatVendor: string;
  picVendor: string;
  noTelp: string;
  status: string;
  barang?: string; // daftar barang/jasa terkait vendor (untuk filter)
}

const MasterVendorDashboard: React.FC = () => {
  const [searchNamaVendor, setSearchNamaVendor] = useState('');
  const [searchKodeVendor, setSearchKodeVendor] = useState('');
  const [searchPICVendor, setSearchPICVendor] = useState('');
  const [searchBarang, setSearchBarang] = useState('');
  const [dateFrom, setDateFrom] = useState('03/03/2025');
  const [dateTo, setDateTo] = useState('03/03/2025');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<MasterVendorData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MasterVendorData | null>(null);
  const [sortField, setSortField] = useState<keyof MasterVendorData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isPODetailOpen, setIsPODetailOpen] = useState(false);
  const [vendorPODetail, setVendorPODetail] = useState<
    { id: string; namaVendor: string; kodeVendor: string } | null
  >(null);

  // Sample data matching the image
  const [masterVendorData, setMasterVendorData] = useState<MasterVendorData[]>([
    {
      id: '1',
      no: 1,
      tanggal: '01-02-2024',
      namaVendor: 'PT Maju Jaya',
      kodeVendor: 'VND001',
      alamatVendor: 'Jl. Merdeka No. 1, Jakarta',
      picVendor: 'Andi Saputra',
      noTelp: '081234567890',
      status: 'Aktif',
      barang: 'Peralatan Inspeksi; Alat keselamatan kerja'
    },
    {
      id: '2',
      no: 2,
      tanggal: '05-02-2024',
      namaVendor: 'CV Sejahtera',
      kodeVendor: 'VND002',
      alamatVendor: 'Jl. Diponegoro No. 5, Bandung',
      picVendor: 'Budi Santoso',
      noTelp: '081298765432',
      status: 'Aktif',
      barang: 'P3K; Peralatan peraga pelatihan'
    },
    {
      id: '3',
      no: 3,
      tanggal: '10-02-2024',
      namaVendor: 'UD Sukses Makmur',
      kodeVendor: 'VND003',
      alamatVendor: 'Jl. Gatot Subroto No. 7, Surabaya',
      picVendor: 'Cahyo Widodo',
      noTelp: '082112345678',
      status: 'Aktif',
      barang: 'Dokumen sertifikasi; Stiker/Segel'
    },
    {
      id: '4',
      no: 4,
      tanggal: '15-02-2024',
      namaVendor: 'PT Berkah Abadi',
      kodeVendor: 'VND004',
      alamatVendor: 'Jl. Ahmad Yani No. 10, Yogyakarta',
      picVendor: 'Dewi Lestari',
      noTelp: '085612345678',
      status: 'Aktif',
      barang: 'Kendaraan operasional; Suku cadang'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddVendor = (formData: VendorFormData) => {
    const newVendor: MasterVendorData = {
      id: (masterVendorData.length + 1).toString(),
      no: masterVendorData.length + 1,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      namaVendor: formData.namaVendor,
      kodeVendor: formData.kodeVendor,
      alamatVendor: formData.alamatVendor,
      picVendor: formData.picVendor,
      noTelp: formData.noTelp,
      status: formData.status || 'Aktif',
      barang: formData.barang || ''
    };

    setMasterVendorData(prev => [newVendor, ...prev.map(v => ({ ...v, no: v.no + 1 }))]);
  };

  const handleSaveVendor = (data: VendorFormData) => {
    if (editingVendor) {
      // Update existing vendor
      setMasterVendorData(prev => prev.map(v => v.id === editingVendor.id ? {
        ...v,
        tanggal: data.tanggal || v.tanggal,
        namaVendor: data.namaVendor || v.namaVendor,
        kodeVendor: data.kodeVendor || v.kodeVendor,
        alamatVendor: data.alamatVendor || v.alamatVendor,
        picVendor: data.picVendor || v.picVendor,
        noTelp: data.noTelp || v.noTelp,
        status: data.status || v.status,
        barang: data.barang ?? v.barang,
      } : v));
      setEditingVendor(null);
    } else {
      // Create new vendor
      handleAddVendor(data);
    }
  };

  const handleSort = (field: keyof MasterVendorData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (vendor: MasterVendorData) => {
    setItemToDelete(vendor);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setMasterVendorData(prev => prev.filter(v => v.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Filter data based on search criteria
  const filteredData = masterVendorData.filter(item => {
    const matchesNamaVendor = item.namaVendor.toLowerCase().includes(searchNamaVendor.toLowerCase());
    const matchesKodeVendor = item.kodeVendor.toLowerCase().includes(searchKodeVendor.toLowerCase());
    const matchesPICVendor = item.picVendor.toLowerCase().includes(searchPICVendor.toLowerCase());
    const matchesBarang = (item.barang || '').toLowerCase().includes(searchBarang.toLowerCase());
    
    return matchesNamaVendor && matchesKodeVendor && matchesPICVendor && matchesBarang;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aRaw = a[sortField] ?? '';
    const bRaw = b[sortField] ?? '';

    if (typeof aRaw === 'number' && typeof bRaw === 'number') {
      return sortDirection === 'asc' ? aRaw - bRaw : bRaw - aRaw;
    }

    const aStr = String(aRaw);
    const bStr = String(bRaw);
    return sortDirection === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
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
    <div className="min-h-screen bg-gray-50 text-xs">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              DAFTAR MASTER VENDOR
            </h1>
            <button 
              onClick={() => { setEditingVendor(null); setIsModalOpen(true); }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Vendor</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search Nama Vendor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Vendor
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaVendor}
                    onChange={(e) => setSearchNamaVendor(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="PT Maju Jaya"
                  />
                </div>
              </div>

              {/* Search Kode Vendor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Kode Vendor
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchKodeVendor}
                    onChange={(e) => setSearchKodeVendor(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="VND001"
                  />
                </div>
              </div>

              {/* Search PIC Vendor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari PIC Vendor
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchPICVendor}
                    onChange={(e) => setSearchPICVendor(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              {/* Search Barang/Jasa */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Barang/Jasa
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchBarang}
                    onChange={(e) => setSearchBarang(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="Nama barang atau jasa"
                  />
                </div>
              </div>
            </div>

            {/* Date Range and Search Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2 text-xs">
                  <input
                    type="text"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="text"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="03/03/2025"
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
                  className="w-full px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-xs flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
            <button className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1">
              <File className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
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

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
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
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tanggal')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tanggal</span>
                      {sortField === 'tanggal' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('namaVendor')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Vendor</span>
                      {sortField === 'namaVendor' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('kodeVendor')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kode Vendor</span>
                      {sortField === 'kodeVendor' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('alamatVendor')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Alamat Vendor</span>
                      {sortField === 'alamatVendor' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('picVendor')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>PIC Vendor</span>
                      {sortField === 'picVendor' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('noTelp')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No. Telp</span>
                      {sortField === 'noTelp' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('barang')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Barang / Jasa Terkait</span>
                      {sortField === 'barang' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">Aksi</th>
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
                    <td className="px-3 py-2 text-xs text-gray-900">{item.no}</td>
                    <td className="px-3 py-2 text-xs text-gray-600">{item.tanggal}</td>
                    <td className="px-3 py-2 text-xs text-gray-900 font-medium">{item.namaVendor}</td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.kodeVendor}</td>
                    <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate" title={item.alamatVendor}>
                      {item.alamatVendor}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.picVendor}</td>
                    <td className="px-3 py-2 text-xs text-gray-900">{item.noTelp}</td>
                    <td className="px-3 py-2 text-xs text-gray-700 max-w-xs truncate" title={item.barang || ''}>
                      {item.barang || '-'}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setVendorPODetail({
                              id: item.id,
                              namaVendor: item.namaVendor,
                              kodeVendor: item.kodeVendor,
                            });
                            setIsPODetailOpen(true);
                          }}
                          className="p-1 bg-emerald-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-emerald-700"
                          title="Detail PO"
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingVendor(item);
                            setIsModalOpen(true);
                          }}
                          className="p-1 bg-blue-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1 bg-red-600 text-white rounded transition-all duration-200 hover:scale-110 hover:bg-red-700"
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
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
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
                  className="px-2.5 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Modal */}
      <VendorModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingVendor(null); }}
        onSave={handleSaveVendor}
        initialData={editingVendor ? {
          tanggal: editingVendor.tanggal,
          namaVendor: editingVendor.namaVendor,
          kodeVendor: editingVendor.kodeVendor,
          alamatVendor: editingVendor.alamatVendor,
          picVendor: editingVendor.picVendor,
          noTelp: editingVendor.noTelp,
          status: editingVendor.status,
          barang: editingVendor.barang || '',
        } : undefined}
        title={editingVendor ? 'Edit Vendor' : 'Entry Vendor'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaVendor}
      />

      {/* Vendor PO Detail Modal */}
      <VendorPODetailModal
        isOpen={isPODetailOpen}
        onClose={() => {
          setIsPODetailOpen(false);
          setVendorPODetail(null);
        }}
        vendor={vendorPODetail}
      />
    </div>
  );
};

export default MasterVendorDashboard;
