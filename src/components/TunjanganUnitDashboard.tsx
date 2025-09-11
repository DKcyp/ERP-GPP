import React, { useState, useEffect } from 'react';
import TunjanganUnitModal, { TunjanganUnitFormData } from './TunjanganUnitModal';
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
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface TunjanganUnitData {
  id: string;
  no: number;
  namaTeknisi: string;
  tanggal: string;
  progressHarian: string;
  zonaKerja: string;
  proyek: string;
  tunjangan: string;
}

const TunjanganUnitDashboard: React.FC = () => {
  const [searchNamaProyek, setSearchNamaProyek] = useState('');
  const [searchNamaTeknisi, setSearchNamaTeknisi] = useState('');
  const [searchZonaKerja, setSearchZonaKerja] = useState('');
  const [dateFrom, setDateFrom] = useState('03/03/2025');
  const [dateTo, setDateTo] = useState('03/03/2025');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TunjanganUnitData | null>(null);
  const [sortField, setSortField] = useState<keyof TunjanganUnitData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatRupiah = (val: string | number) => {
    const n = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, '')) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  };

  // Sample data matching the image
  const [tunjanganUnitData, setTunjanganUnitData] = useState<TunjanganUnitData[]>([
    {
      id: '1',
      no: 1,
      namaTeknisi: 'Ahmad Fauzi',
      tanggal: '01-01-2025',
      progressHarian: '80%',
      zonaKerja: 'Zona Utara',
      proyek: 'Proyek Jaringan Fiber Optik',
      tunjangan: 'Rp 250.000'
    },
    {
      id: '2',
      no: 2,
      namaTeknisi: 'Budi Santoso',
      tanggal: '01-01-2025',
      progressHarian: '60%',
      zonaKerja: 'Zona Timur',
      proyek: 'Proyek Internet Sekolah',
      tunjangan: 'Rp 150.000'
    },
    {
      id: '3',
      no: 3,
      namaTeknisi: 'Citra Dewi',
      tanggal: '01-01-2025',
      progressHarian: '90%',
      zonaKerja: 'Zona Selatan',
      proyek: 'Proyek Smart City',
      tunjangan: 'Rp 300.000'
    },
    {
      id: '4',
      no: 4,
      namaTeknisi: 'Dedi Kurniawan',
      tanggal: '01-01-2025',
      progressHarian: '50%',
      zonaKerja: 'Zona Barat',
      proyek: 'Proyek Perluasan Jaringan',
      tunjangan: 'Rp 200.000'
    },
    {
      id: '5',
      no: 5,
      namaTeknisi: 'Eka Prasetya',
      tanggal: '01-01-2025',
      progressHarian: '70%',
      zonaKerja: 'Zona Pusat',
      proyek: 'Proyek Data Center',
      tunjangan: 'Rp 225.000'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof TunjanganUnitData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (item: TunjanganUnitData) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setTunjanganUnitData(prev => prev.filter(t => t.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Filter data based on search criteria
  const filteredData = tunjanganUnitData.filter(item => {
    const matchesNamaProyek = item.proyek.toLowerCase().includes(searchNamaProyek.toLowerCase());
    const matchesNamaTeknisi = item.namaTeknisi.toLowerCase().includes(searchNamaTeknisi.toLowerCase());
    const matchesZonaKerja = item.zonaKerja.toLowerCase().includes(searchZonaKerja.toLowerCase());
    
    return matchesNamaProyek && matchesNamaTeknisi && matchesZonaKerja;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const getComparable = (item: TunjanganUnitData) => {
      if (sortField === 'tunjangan') {
        const n = Number(String(item.tunjangan).replace(/[^0-9]/g, '')) || 0;
        return n;
      }
      return item[sortField] as any;
    };
    const aValue = getComparable(a);
    const bValue = getComparable(b);
    if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
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

  const handleAddTunjanganUnit = (formData: TunjanganUnitFormData) => {
    const newTunjanganUnit: TunjanganUnitData = {
      id: (tunjanganUnitData.length + 1).toString(),
      no: tunjanganUnitData.length + 1,
      namaTeknisi: formData.namaTeknisi,
      tanggal: new Date(formData.tanggal).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      progressHarian: formData.progress,
      zonaKerja: formData.zonaKerja,
      proyek: formData.proyek,
      tunjangan: formatRupiah(formData.tunjangan || 0)
    };

    setTunjanganUnitData(prev => [newTunjanganUnit, ...prev.map(t => ({ ...t, no: t.no + 1 }))]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Tunjangan Unit Production
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search Nama Proyek */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Proyek
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaProyek}
                    onChange={(e) => setSearchNamaProyek(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Proyek A"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Nama Teknisi */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Teknisi
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaTeknisi}
                    onChange={(e) => setSearchNamaTeknisi(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Budi Santoso"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search Zona Kerja */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Zona Kerja
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchZonaKerja}
                    onChange={(e) => setSearchZonaKerja(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Zona Timur"
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

            {/* Date Range and Search Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="text"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
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
                  className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end space-x-2 mb-6">
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
                    onClick={() => handleSort('namaTeknisi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Teknisi</span>
                      {sortField === 'namaTeknisi' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
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
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('progressHarian')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Progress Harian</span>
                      {sortField === 'progressHarian' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('tunjangan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Tunjangan</span>
                      {sortField === 'tunjangan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('zonaKerja')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Zona Kerja</span>
                      {sortField === 'zonaKerja' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaTeknisi}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggal}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.progressHarian}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.tunjangan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.zonaKerja}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.proyek}</td>
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
                  className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
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

      {/* Tunjangan Unit Modal */}
      <TunjanganUnitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTunjanganUnit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaTeknisi}
      />
    </div>
  );
};

export default TunjanganUnitDashboard;
