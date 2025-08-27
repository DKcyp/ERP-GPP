import React, { useState, useEffect } from 'react';
import KontrakModal, { KontrakFormData } from './KontrakModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ApprovalActionModal from './ApprovalActionModal'; // Import ApprovalActionModal
import { ApprovalActionData } from '../types'; // Assuming you have this type defined
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
  Check // Import Check icon for approve
} from 'lucide-react';

interface Kontrak {
  id: string;
  no: number;
  noSO: string;
  namaClient: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  nilaiKontrak: string;
  sudahDitagihkan: string;
  sisaPenagihan: string;
  estimasiPenagihan: string;
  delayPenagihan: string;
}

const KontrakDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNamaClient, setSearchNamaClient] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Kontrak | null>(null);
  const [sortField, setSortField] = useState<keyof Kontrak | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // State for Approval Modal
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedKontrakIdForApproval, setSelectedKontrakIdForApproval] = useState<string | null>(null);
  const [approvalActionType, setApprovalActionType] = useState<'approve' | 'reject' | null>(null);


  // Sample data matching the image
  const [kontrakData, setKontrakData] = useState<Kontrak[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO001',
      namaClient: 'PT. Jakarta Tank Terminal',
      tanggalAwal: '01-01-2025',
      tanggalAkhir: '01-06-2025',
      nilaiKontrak: 'Rp. 200.000.000',
      sudahDitagihkan: 'Rp. 150.000.000',
      sisaPenagihan: 'Rp. 50.000.000',
      estimasiPenagihan: 'Rp. 40.000.000',
      delayPenagihan: '150 Hari'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO002',
      namaClient: 'PT. Surabaya Shipping Lines',
      tanggalAwal: '15-02-2025',
      tanggalAkhir: '15-08-2025',
      nilaiKontrak: 'Rp. 500.000.000',
      sudahDitagihkan: 'Rp. 300.000.000',
      sisaPenagihan: 'Rp. 200.000.000',
      estimasiPenagihan: 'Rp. 60.000.000',
      delayPenagihan: '180 Hari'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO003',
      namaClient: 'PT. Bandung Logistics',
      tanggalAwal: '01-03-2025',
      tanggalAkhir: '01-09-2025',
      nilaiKontrak: 'Rp. 300.000.000',
      sudahDitagihkan: 'Rp. 200.000.000',
      sisaPenagihan: 'Rp. 100.000.000',
      estimasiPenagihan: 'Rp. 45.000.000',
      delayPenagihan: '180 Hari'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO004',
      namaClient: 'PT. Medan Cargo Express',
      tanggalAwal: '10-04-2025',
      tanggalAkhir: '10-10-2025',
      nilaiKontrak: 'Rp. 700.000.000',
      sudahDitagihkan: 'Rp. 500.000.000',
      sisaPenagihan: 'Rp. 200.000.000',
      estimasiPenagihan: 'Rp. 30.000.000',
      delayPenagihan: '180 Hari'
    },
    {
      id: '5',
      no: 5,
      noSO: 'SO005',
      namaClient: 'PT. Semarang Port Services',
      tanggalAwal: '01-05-2025',
      tanggalAkhir: '01-11-2025',
      nilaiKontrak: 'Rp. 600.000.000',
      sudahDitagihkan: 'Rp. 400.000.000',
      sisaPenagihan: 'Rp. 200.000.000',
      estimasiPenagihan: 'Rp. 50.000.000',
      delayPenagihan: '180 Hari'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddKontrak = (formData: KontrakFormData) => {
    const newKontrak: Kontrak = {
      id: (kontrakData.length + 1).toString(),
      no: kontrakData.length + 1,
      noSO: `SO${String(kontrakData.length + 1).padStart(3, '0')}`,
      namaClient: formData.namaClient,
      tanggalAwal: new Date(formData.tanggalAwal).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      tanggalAkhir: new Date(formData.tanggalAkhir).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      nilaiKontrak: formData.nilaiKontrak,
      sudahDitagihkan: formData.sudahDitagihkan || 'Rp. 0',
      sisaPenagihan: formData.sisaPenagihan || 'Rp. 0',
      estimasiPenagihan: formData.estimasiPenagihan || 'Rp. 0',
      delayPenagihan: formData.delayPenagihan || '0 Hari'
    };

    setKontrakData(prev => [newKontrak, ...prev.map(k => ({ ...k, no: k.no + 1 }))]);
  };

  const handleDeleteClick = (kontrak: Kontrak) => {
    setItemToDelete(kontrak);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setKontrakData(prev => prev.filter(k => k.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof Kontrak) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = kontrakData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesNamaClient = item.namaClient.toLowerCase().includes(searchNamaClient.toLowerCase());
    
    return matchesNoSO && matchesNamaClient;
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

  // Calculate totals
  const totals = kontrakData.reduce((acc, item) => {
    const nilaiKontrak = parseFloat(item.nilaiKontrak.replace(/[^\d]/g, '')) || 0;
    const sudahDitagihkan = parseFloat(item.sudahDitagihkan.replace(/[^\d]/g, '')) || 0;
    const sisaPenagihan = parseFloat(item.sisaPenagihan.replace(/[^\d]/g, '')) || 0;
    const estimasiPenagihan = parseFloat(item.estimasiPenagihan.replace(/[^\d]/g, '')) || 0;

    return {
      nilaiKontrak: acc.nilaiKontrak + nilaiKontrak,
      sudahDitagihkan: acc.sudahDitagihkan + sudahDitagihkan,
      sisaPenagihan: acc.sisaPenagihan + sisaPenagihan,
      estimasiPenagihan: acc.estimasiPenagihan + estimasiPenagihan
    };
  }, { nilaiKontrak: 0, sudahDitagihkan: 0, sisaPenagihan: 0, estimasiPenagihan: 0 });

  const formatCurrency = (amount: number) => {
    return `Rp. ${amount.toLocaleString('id-ID')}`;
  };

  // Handle Approve Kontrak button click
  const handleApproveKontrakClick = (kontrakId: string) => {
    setSelectedKontrakIdForApproval(kontrakId);
    setApprovalActionType('approve');
    setIsApprovalModalOpen(true);
  };

  // Handle confirmation from ApprovalActionModal
  const handleApprovalConfirm = (data: ApprovalActionData) => {
    console.log('Kontrak Approved:', data);
    // Here you would typically update the status of the kontrak in your state or send to API
    // For demonstration, we'll just log it.
    setIsApprovalModalOpen(false);
    setSelectedKontrakIdForApproval(null);
    setApprovalActionType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            DASHBOARD KONTRAK
          </h1>

          {/* Search and Filter Section */}
<div className="space-y-4 mb-6">
  {/* Inputs Row */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    {/* Search No SO */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Cari No SO
      </label>
      <input
        type="text"
        value={searchNoSO}
        onChange={(e) => setSearchNoSO(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
        placeholder="SO001"
      />
    </div>

    {/* Search Nama Client */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Cari Nama Client
      </label>
      <input
        type="text"
        value={searchNamaClient}
        onChange={(e) => setSearchNamaClient(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
        placeholder="Jhon Doe"
      />
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
    {/* Full-width Button */}
<div className="space-y-2">
<button 
  onClick={handleSearch}
  className="w-full px-3 py-2 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm"
>
  <Search className="h-5 w-5" />
  Cari Data
</button>
</div>
  </div>
</div>


          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Pencapaian On Call</h3>
              <p className="text-xl font-bold">40%</p>
            </div>
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Nominal On Call</h3>
              <p className="text-xl font-bold">Rp 50.000.000</p>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Pencapaian Tender</h3>
              <p className="text-xl font-bold">60%</p>
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-1">Nominal Tender</h3>
              <p className="text-xl font-bold">Rp 90.000.000</p>
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
                    onClick={() => handleSort('namaClient')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Client</span>
                      {sortField === 'namaClient' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Awal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tanggal Akhir</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nilai Kontrak</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sudah Ditagihkan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sisa Penagihan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estimasi Penagihan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delay Penagihan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th> {/* New Aksi column */}
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.namaClient}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalAwal}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.tanggalAkhir}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nilaiKontrak}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.sudahDitagihkan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.sisaPenagihan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.estimasiPenagihan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.delayPenagihan}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleApproveKontrakClick(item.id)}
                          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium text-xs transition-all duration-300 hover:scale-105 transform shadow-sm hover:shadow-md bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-600/30 ring-2 ring-blue-200/50"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve Kontrak</span>
                        </button>
                        {/* You can add other action buttons here if needed */}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td className="px-4 py-3 text-sm text-gray-900" colSpan={5}>Total</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(totals.nilaiKontrak)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(totals.sudahDitagihkan)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(totals.sisaPenagihan)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(totals.estimasiPenagihan)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900"></td>
                  <td className="px-4 py-3 text-sm text-gray-900"></td> {/* Empty cell for Aksi column in total row */}
                </tr>
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

      {/* Kontrak Modal */}
      <KontrakModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddKontrak}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.namaClient}
      />

      {/* Approval Action Modal for Kontrak */}
      <ApprovalActionModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApprovalConfirm}
        invoiceId={selectedKontrakIdForApproval} // Renamed to invoiceId in modal, but used for kontrakId here
        actionType={approvalActionType}
      />
    </div>
  );
};

export default KontrakDashboard;
