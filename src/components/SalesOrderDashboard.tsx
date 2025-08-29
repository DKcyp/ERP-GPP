import React, { useState, useEffect } from 'react';
import SalesOrderModal, { SalesOrderFormData } from './SalesOrderModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  File,
  Edit,
  Trash2,
  Truck,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SalesOrder {
  id: string;
  no: number;
  noSO: string;
  nomorKontrak: string;
  namaClient: string;
  namaProyek: string;
  sow: string;
  lokasi: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  tanggalMOB: string;
  tanggalDeMOB: string;
  tanggalDibuat: string;
  estimasiSO: string;
}

const SalesOrderDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchNomorKontrak, setSearchNomorKontrak] = useState('');
  const [searchClient, setSearchClient] = useState('');
  const [selectedJenisPekerjaan, setSelectedJenisPekerjaan] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [jenisPekerjaanDropdownOpen, setJenisPekerjaanDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SalesOrder | null>(null);

  // Sample data matching the image
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO001',
      nomorKontrak: '001/02/P0810',
      namaClient: 'Client A',
      namaProyek: 'Project Alpha',
      sow: 'Maintenance Server',
      lokasi: 'Jakarta',
      jenisPekerjaan: 'On Call',
      tanggalMOB: '01-01-2025',
      tanggalDeMOB: '31-01-2025',
      tanggalDibuat: '01-01-2025',
      estimasiSO: 'Rp 20.000.000'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO032',
      nomorKontrak: '001/03/P0811',
      namaClient: 'Client B',
      namaProyek: 'Project Beta',
      sow: 'Software Development',
      lokasi: 'Bandung',
      jenisPekerjaan: 'Tender',
      tanggalMOB: '03-01-2025',
      tanggalDeMOB: '28-02-2025',
      tanggalDibuat: '03-01-2025',
      estimasiSO: 'Rp 15.500.000'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO023',
      nomorKontrak: '001/04/P0810',
      namaClient: 'Client C',
      namaProyek: 'Project Gamma',
      sow: 'Network Installation',
      lokasi: 'Surabaya',
      jenisPekerjaan: 'On Call',
      tanggalMOB: '05-01-2025',
      tanggalDeMOB: '30-03-2025',
      tanggalDibuat: '05-01-2025',
      estimasiSO: 'Rp 30.000.000'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO012',
      nomorKontrak: '002/02/P0819',
      namaClient: 'Client D',
      namaProyek: 'Project Delta',
      sow: 'Data Center Setup',
      lokasi: 'Yogyakarta',
      jenisPekerjaan: 'Tender',
      tanggalMOB: '07-01-2025',
      tanggalDeMOB: '30-04-2025',
      tanggalDibuat: '07-01-2025',
      estimasiSO: 'Rp 22.800.000'
    }
  ]);

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleAddSalesOrder = (formData: SalesOrderFormData) => {
    const newSalesOrder: SalesOrder = {
      id: (salesOrders.length + 1).toString(),
      no: salesOrders.length + 1,
      noSO: `SO${String(Date.now()).slice(-6)}`,
      nomorKontrak: formData.nomorKontrak,
      namaClient: formData.namaClient,
      namaProyek: formData.namaProyek,
      sow: formData.sow,
      lokasi: formData.lokasi,
      jenisPekerjaan: formData.jenisPekerjaan,
      tanggalMOB: formData.tanggalMOB,
      tanggalDeMOB: formData.tanggalDeMOB,
      tanggalDibuat: new Date(formData.tanggalDibuat).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      estimasiSO: formData.estimasiSO
    };

    setSalesOrders(prev => [newSalesOrder, ...prev.map(s => ({ ...s, no: s.no + 1 }))]);
  };

  const handleDeleteClick = (salesOrder: SalesOrder) => {
    setItemToDelete(salesOrder);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSalesOrders(prev => prev.filter(s => s.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const getJenisPekerjaanColor = (jenis: string) => {
    switch (jenis) {
      case 'On Call': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Tender': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const jenisPekerjaanOptions = ['On Call', 'Tender'];

  // Filter data based on search criteria
  const filteredData = salesOrders.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesNomorKontrak = item.nomorKontrak.toLowerCase().includes(searchNomorKontrak.toLowerCase());
    const matchesClient = item.namaClient.toLowerCase().includes(searchClient.toLowerCase());
    const matchesJenisPekerjaan = selectedJenisPekerjaan ? item.jenisPekerjaan === selectedJenisPekerjaan : true;
    
    // Date filtering logic (if dates are provided)
    const itemDate = new Date(item.tanggalDibuat.split('-').reverse().join('-')); // Assuming dd-mm-yyyy format
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || itemDate >= fromDate) && (!toDate || itemDate <= toDate);

    return matchesNoSO && matchesNomorKontrak && matchesClient && matchesJenisPekerjaan && matchesDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                DAFTAR SALES ORDER
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Marketing</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Sales Order</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Dashboard</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Cari No SO */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari No SO
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNoSO}
                  onChange={(e) => setSearchNoSO(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari No SO..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Nomor Kontrak */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Nomor Kontrak
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNomorKontrak}
                  onChange={(e) => setSearchNomorKontrak(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari Nomor Kontrak..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Pilih Jenis Pekerjaan Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Pilih Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() => setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white"
                >
                  <span className={selectedJenisPekerjaan ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedJenisPekerjaan || 'Pilih jenis pekerjaan...'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${jenisPekerjaanDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedJenisPekerjaan('');
                        setJenisPekerjaanDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Jenis Pekerjaan
                    </button>
                    {jenisPekerjaanOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSelectedJenisPekerjaan(jenis);
                          setJenisPekerjaanDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-3 h-3 rounded-full ${
                          jenis === 'On Call' ? 'bg-cyan-500' : 'bg-red-500'
                        }`}></span>
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Client */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cari Client
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Cari Client..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Dari */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode Dari
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Periode Sampai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            {/* Changed lg:col-span-2 to lg:col-span-1 to match input width */}
            <div className="lg:col-span-1 flex items-end">
              <button 
                onClick={handleSearch}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Cari</span>
              </button>
            </div>
          </div>
          
          {/* Action Buttons below filter panel */}
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Sales Order</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25 flex items-center space-x-2 text-sm">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 flex items-center space-x-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Export Bar - REMOVED */}

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nomor SO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nomor Kontrak</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Proyek</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SOW</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis Pekerjaan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal MOB</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal DeMOB</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estimasi SO</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.map((item, index) => (
                  <tr 
                    key={item.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{ 
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{item.no}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.noSO}</td>
                    <td className="px-6 py-4 text-gray-600">{item.nomorKontrak}</td>
                    <td className="px-6 py-4 text-gray-600">{item.namaClient}</td>
                    <td className="px-6 py-4 text-gray-600">{item.namaProyek}</td>
                    <td className="px-6 py-4 text-gray-600">{item.sow}</td>
                    <td className="px-6 py-4 text-gray-600">{item.lokasi}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getJenisPekerjaanColor(item.jenisPekerjaan)}`}>
                        {item.jenisPekerjaan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.tanggalMOB}</td>
                    <td className="px-6 py-4 text-gray-600">{item.tanggalDeMOB}</td>
                    <td className="px-6 py-4 text-gray-600">{item.tanggalDibuat}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{item.estimasiSO}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110"
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
                        <button 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                          title="View Details"
                        >
                          <Truck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-700 hover:bg-white hover:text-blue-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Order Modal */}
      <SalesOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSalesOrder}
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

export default SalesOrderDashboard;
