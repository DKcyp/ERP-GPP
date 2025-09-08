import React, { useState, useEffect } from 'react';
import SOTurunanModal, { SOTurunanFormData } from './SOTurunanModal';
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
  ArrowUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SOTurunan {
  id: string;
  no: number;
  noSO: string;
  soTurunan: string;
  namaClient: string;
  tanggalDibuat: string;
  total: string;
}

interface SOTurunanDashboardProps {
  role?: string;
}

const SOTurunanDashboard: React.FC<SOTurunanDashboardProps> = ({ role }) => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNamaProject, setSearchNamaProject] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const [initialModalData, setInitialModalData] = useState<Partial<SOTurunanFormData> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SOTurunan | null>(null);
  const [sortField, setSortField] = useState<keyof SOTurunan | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [soTurunanData, setSOTurunanData] = useState<SOTurunan[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO001',
      soTurunan: 'SO001.3',
      namaClient: 'PT Adem Ayem',
      tanggalDibuat: '10-02-2025',
      total: 'Rp 90.000.000'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO002',
      soTurunan: 'SO002.1',
      namaClient: 'PT Permata Buana',
      tanggalDibuat: '15-02-2025',
      total: 'Rp 150.000.000'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO002',
      soTurunan: 'SO002.2',
      namaClient: 'CV Sejahtera',
      tanggalDibuat: '18-02-2025',
      total: 'Rp 200.000.000'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO003',
      soTurunan: 'SO003.23',
      namaClient: 'CV Makmur',
      tanggalDibuat: '22-02-2025',
      total: 'Rp 175.000.000'
    },
    {
      id: '5',
      no: 5,
      noSO: 'SO004',
      soTurunan: 'SO004.1',
      namaClient: 'PT WorkHome',
      tanggalDibuat: '25-02-2025',
      total: 'Rp 250.000.000'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddSOTurunan = (formData: SOTurunanFormData) => {
    const newSOTurunan: SOTurunan = {
      id: (soTurunanData.length + 1).toString(),
      no: soTurunanData.length + 1,
      noSO: formData.soInduk,
      soTurunan: formData.soTurunan,
      namaClient: formData.namaClient,
      tanggalDibuat: new Date(formData.tanggalDibuat).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      total: formData.estimasiSO || 'Rp 0'
    };

    setSOTurunanData(prev => [newSOTurunan, ...prev.map(s => ({ ...s, no: s.no + 1 }))]);
  };

  const handleDeleteClick = (soTurunan: SOTurunan) => {
    setItemToDelete(soTurunan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSOTurunanData(prev => prev.filter(s => s.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof SOTurunan) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = soTurunanData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesNamaProject = item.namaClient.toLowerCase().includes(searchNamaProject.toLowerCase());
    
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

  const openAddModal = () => {
    setReadOnlyModal(false);
    setInitialModalData(null);
    setIsModalOpen(true);
  };

  const toISODate = (ddmmyyyy: string) => {
    // input expected 'DD-MM-YYYY'
    const parts = ddmmyyyy.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return ddmmyyyy;
  };

  const openViewModal = (item: SOTurunan) => {
    setReadOnlyModal(true);
    setInitialModalData({
      soInduk: item.noSO,
      soTurunan: item.soTurunan,
      namaClient: item.namaClient,
      tanggalDibuat: toISODate(item.tanggalDibuat),
      estimasiSO: item.total,
      // Fields not present in list remain empty
      nomorKontrak: '',
      namaProyek: '',
      jenisPekerjaan: '',
      tanggalMOB: '',
      tanggalDemob: '',
      keterangan: '',
    });
    setIsModalOpen(true);
  };

  const isReadOnly = role === 'operational2';
  const isApprover = role === 'operational3';

  const handleApprove = (item: SOTurunan) => {
    console.log('Approved SO Turunan:', item);
  };

  const handleReject = (item: SOTurunan) => {
    console.log('Rejected SO Turunan:', item);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR SO TURUNAN
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Operational</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Sales Order</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">SO Turunan</span>
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
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="SO001"
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
                      className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="PHE ONWJ"
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

              {/* Date Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Periode
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  <span className="text-sm text-gray-500">s.d</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Search Button Row */}
                          <div className="grid grid-cols-3 gap-3">
                <div className="relative">
<button 
  onClick={handleSearch}
  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 text-sm flex items-center justify-center gap-2"
>
  <Search className="h-4 w-4" />
  Cari data
</button>

            </div>
                          </div>
                            
            <div className="flex justify-end">
              {!isReadOnly && (
                <button 
                  onClick={openAddModal}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah</span>
                </button>
              )}
            </div>
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

        {/* Export Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-2">
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
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
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
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
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('namaClient')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Client</span>
                      {sortField === 'namaClient' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Dibuat</th>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0">
                          <Info className="h-2 w-2 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{item.no}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.soTurunan}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaClient}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalDibuat}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-1">
                        {!isReadOnly && !isApprover && (
                          <>
                            <button 
                              onClick={() => { setReadOnlyModal(false); setInitialModalData({
                                soInduk: item.noSO,
                                soTurunan: item.soTurunan,
                                namaClient: item.namaClient,
                                tanggalDibuat: toISODate(item.tanggalDibuat),
                                estimasiSO: item.total,
                                nomorKontrak: '',
                                namaProyek: '',
                                jenisPekerjaan: '',
                                tanggalMOB: '',
                                tanggalDemob: '',
                                keterangan: '',
                              }); setIsModalOpen(true); }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {isApprover && (
                          <>
                            <button
                              onClick={() => handleApprove(item)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => openViewModal(item)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="View"
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

      {/* SO Turunan Modal */}
      <SOTurunanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSOTurunan}
        readOnly={readOnlyModal}
        initialData={initialModalData}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaClient}
      />
    </div>
  );
};

export default SOTurunanDashboard;
