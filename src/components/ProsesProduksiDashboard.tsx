import React, { useState, useEffect } from 'react';
import ProsesProduksiModal, { ProsesProduksiFormData } from './ProsesProduksiModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  File,
  ArrowUp,
  ChevronDown
} from 'lucide-react';

interface ProsesProduksiData {
  id: string;
  no: number;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  mob: string;
  demob: string;
  tglPenerimaanReportTeknisi: string;
  tglPenerimaanFinalReport: string;
  nilaiProduksi: string;
  statusReport: 'Approved' | 'Pending' | 'Revisi';
  fileUrl?: string;
  fileName?: string;
}

const ProsesProduksiDashboard: React.FC = () => {
  const [searchSO, setSearchSO] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [selectedStatusReport, setSelectedStatusReport] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProsesProduksiData | null>(null);
  const [sortField, setSortField] = useState<keyof ProsesProduksiData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [produksiData, setProduksiData] = useState<ProsesProduksiData[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO101',
      soTurunan: 'SO101.12',
      namaProyek: 'Proyek A',
      mob: '01-02-2025',
      demob: '20-02-2025',
      tglPenerimaanReportTeknisi: '22-02-2025',
      tglPenerimaanFinalReport: '25-02-2025',
      nilaiProduksi: 'Rp 80,000,000',
      statusReport: 'Approved'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO102',
      soTurunan: 'SO102.33',
      namaProyek: 'Proyek B',
      mob: '05-02-2025',
      demob: '25-02-2025',
      tglPenerimaanReportTeknisi: '27-02-2025',
      tglPenerimaanFinalReport: '-',
      nilaiProduksi: 'Rp 30,000,000',
      statusReport: 'Pending'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO103',
      soTurunan: '-',
      namaProyek: 'Proyek C',
      mob: '10-02-2025',
      demob: '28-02-2025',
      tglPenerimaanReportTeknisi: '02-03-2025',
      tglPenerimaanFinalReport: '06-03-2025',
      nilaiProduksi: 'Rp 45,000,000',
      statusReport: 'Approved'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO104',
      soTurunan: 'SO104.87',
      namaProyek: 'Proyek D',
      mob: '15-02-2025',
      demob: '05-03-2025',
      tglPenerimaanReportTeknisi: '07-03-2025',
      tglPenerimaanFinalReport: '-',
      nilaiProduksi: 'Rp 10,000,000',
      statusReport: 'Revisi'
    }
  ]);

  const statusReportOptions = ['Approved', 'Pending', 'Revisi'];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddProsesProduksi = (formData: ProsesProduksiFormData) => {
    const newProsesProduksi: ProsesProduksiData = {
      id: (produksiData.length + 1).toString(),
      no: produksiData.length + 1,
      noSO: `SO${String(Date.now()).slice(-3)}`,
      soTurunan: formData.noSOTurunan,
      namaProyek: formData.namaProyek,
      mob: new Date(formData.mob).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      demob: new Date(formData.demob).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      tglPenerimaanReportTeknisi: new Date(formData.tglPenerimaanReportTeknisi).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      tglPenerimaanFinalReport: formData.tglPenerimaanFinalReport ? new Date(formData.tglPenerimaanFinalReport).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : '-',
      nilaiProduksi: formData.nilaiProduksi,
      statusReport: formData.statusReport,
      fileUrl: formData.fileUrl,
      fileName: formData.fileName
    };

    setProduksiData(prev => [newProsesProduksi, ...prev.map(p => ({ ...p, no: p.no + 1 }))]);
  };

  const handleDeleteClick = (produksi: ProsesProduksiData) => {
    setItemToDelete(produksi);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setProduksiData(prev => prev.filter(p => p.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof ProsesProduksiData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Revisi': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter data based on search criteria
  const filteredData = produksiData.filter(item => {
    const matchesSO = item.noSO.toLowerCase().includes(searchSO.toLowerCase());
    const matchesSOTurunan = item.soTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProject = item.namaProyek.toLowerCase().includes(searchNamaProject.toLowerCase());
    const matchesStatus = selectedStatusReport ? item.statusReport === selectedStatusReport : true;
    
    return matchesSO && matchesSOTurunan && matchesNamaProject && matchesStatus;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const field = sortField as keyof ProsesProduksiData;
    const aValue = (a[field] ?? '') as any;
    const bValue = (b[field] ?? '') as any;
    if (aValue === bValue) return 0;
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

  const handleViewFile = (item: ProsesProduksiData) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              PROSES PRODUKSI
            </h1>
          </div>

          {/* Search and Filter Section */}
          <div className="space-y-3 mb-4">
            {/* First Row - Search Inputs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              {/* Search SO */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Cari SO
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchSO}
                    onChange={(e) => setSearchSO(e.target.value)}
                    className="w-full px-2.5 py-1.5 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="SO001"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Search SO Turunan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Cari SO Turunan
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchSOTurunan}
                    onChange={(e) => setSearchSOTurunan(e.target.value)}
                    className="w-full px-2.5 py-1.5 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="SO001.12"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Search Nama Project */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Cari Nama Project
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchNamaProject}
                    onChange={(e) => setSearchNamaProject(e.target.value)}
                    className="w-full px-2.5 py-1.5 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="Proyek Medco"
                  />
                  <button 
                    onClick={handleSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Report Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">
                  Pilih Status Report
                </label>
                <div className="relative">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                  >
                    <span className={selectedStatusReport ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedStatusReport || '--Pilih Status Report--'}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {statusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStatusReport('');
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-2.5 py-1.5 text-left hover:bg-gray-50 transition-colors text-gray-500 text-xs"
                      >
                        --Pilih Status Report--
                      </button>
                      {statusReportOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedStatusReport(status);
                            setStatusDropdownOpen(false);
                          }}
                          className="w-full px-2.5 py-1.5 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2 text-xs"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            status === 'Approved' ? 'bg-green-500' : 
                            status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                          <span>{status}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second Row - Date Range and Search Button */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Periode */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="03/03/2025"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs"
                    placeholder="03/03/2025"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700 opacity-0">
                  Search
                </label>
                <button 
                  onClick={handleSearch}
                  className="w-full px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-xs flex items-center justify-center gap-2"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Buttons + Tambah */}
          <div className="flex justify-end space-x-2 mb-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1">
              <File className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center space-x-1">
              <FileText className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Show entries control */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-700">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2.5 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-xs text-gray-700">entries</span>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs">
                <tr>
                  <th 
                    className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('noSO')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>No SO</span>
                      {sortField === 'noSO' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('soTurunan')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>SO Turunan</span>
                      {sortField === 'soTurunan' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('namaProyek')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Proyek</span>
                      {sortField === 'namaProyek' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">MOB</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">DEMOB</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Tgl Penerimaan Report Teknisi</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Tgl Penerimaan Final Report</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Nilai Produksi</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Status Report</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
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
                    <td className="px-3 py-2 text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-3 py-2 text-gray-900">{item.soTurunan}</td>
                    <td className="px-3 py-2 text-gray-900">{item.namaProyek}</td>
                    <td className="px-3 py-2 text-gray-600">{item.mob}</td>
                    <td className="px-3 py-2 text-gray-600">{item.demob}</td>
                    <td className="px-3 py-2 text-gray-600">{item.tglPenerimaanReportTeknisi}</td>
                    <td className="px-3 py-2 text-gray-600">{item.tglPenerimaanFinalReport}</td>
                    <td className="px-3 py-2 text-gray-900 font-medium">{item.nilaiProduksi}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(item.statusReport)}`}>
                        {item.statusReport}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewFile(item)}
                          disabled={!item.fileUrl}
                          title={item.fileName || (item.fileUrl ? 'Lihat File' : 'Tidak ada file')}
                          className={`p-1.5 rounded-md transition-all duration-200 ${item.fileUrl ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                          <File className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-3 py-2.5 border-t border-gray-200 text-xs">
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
                
                <div className="flex items-center space-x-1">
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
                </div>
                
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

      {/* Proses Produksi Modal */}
      <ProsesProduksiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProsesProduksi}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaProyek}
      />
    </div>
  );
};

export default ProsesProduksiDashboard;
