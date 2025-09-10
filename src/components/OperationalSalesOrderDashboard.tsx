import React, { useState, useEffect } from 'react';
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

interface SalesOrderOperational {
  id: string;
  no: number;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  mob: string;
  demob: string;
  nilaiKontrak: string;
  hpp: string;
  planPenagihan: string;
  nilaiProduksi: string;
  actualPenagihan: string;
}

const OperationalSalesOrderDashboard: React.FC = () => {
  const [searchNoSO, setSearchNoSO] = useState('');
  const [searchSOTurunan, setSearchSOTurunan] = useState('');
  const [searchNamaProyek, setSearchNamaProyek] = useState('');
  const [selectedStatusInvoice, setSelectedStatusInvoice] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SalesOrderOperational | null>(null);
  const [sortField, setSortField] = useState<keyof SalesOrderOperational | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [salesOrderData, setSalesOrderData] = useState<SalesOrderOperational[]>([
    {
      id: '1',
      no: 1,
      noSO: 'SO001',
      soTurunan: 'SO001.12',
      namaProyek: 'Proyek PHE ONWJ',
      mob: '24-12-2024',
      demob: '24-01-2025',
      nilaiKontrak: 'Rp 100.000.000',
      hpp: 'Rp 50.000.000',
      planPenagihan: 'Rp 70.000.000',
      nilaiProduksi: 'Rp 75.000.000',
      actualPenagihan: 'Rp 68.000.000'
    },
    {
      id: '2',
      no: 2,
      noSO: 'SO002',
      soTurunan: 'SO002.22',
      namaProyek: 'Proyek OSES',
      mob: '24-12-2024',
      demob: '24-01-2025',
      nilaiKontrak: 'Rp 90.000.000',
      hpp: 'Rp 45.000.000',
      planPenagihan: 'Rp 65.000.000',
      nilaiProduksi: 'Rp 60.000.000',
      actualPenagihan: 'Rp 50.000.000'
    },
    {
      id: '3',
      no: 3,
      noSO: 'SO003',
      soTurunan: 'SO003.124',
      namaProyek: 'Proyek MEDCO',
      mob: '01-01-2025',
      demob: '20-01-2025',
      nilaiKontrak: 'Rp 150.000.000',
      hpp: 'Rp 80.000.000',
      planPenagihan: 'Rp 120.000.000',
      nilaiProduksi: 'Rp 130.000.000',
      actualPenagihan: 'Rp 115.000.000'
    },
    {
      id: '4',
      no: 4,
      noSO: 'SO004',
      soTurunan: 'SO004.21',
      namaProyek: 'Proyek A',
      mob: '01-01-2025',
      demob: '01-01-2025',
      nilaiKontrak: 'Rp 120.000.000',
      hpp: 'Rp 60.000.000',
      planPenagihan: 'Rp 90.000.000',
      nilaiProduksi: 'Rp 100.000.000',
      actualPenagihan: 'Rp 85.000.000'
    }
  ]);

  // Chart data for the bar chart
  const chartData = [
    { label: 'Nilai Kontrak', value: 0.9, color: '#3B82F6' },
    { label: 'HPP', value: 0.8, color: '#3B82F6' },
    { label: 'Plan Penagihan', value: 0.7, color: '#3B82F6' },
    { label: 'Nilai Produksi', value: 0.6, color: '#3B82F6' },
    { label: 'Actual Penagihan', value: 0.5, color: '#3B82F6' },
    { label: 'Margin', value: 0.4, color: '#3B82F6' }
  ];

  useEffect(() => {
    // Trigger animation on component mount
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleDeleteClick = (salesOrder: SalesOrderOperational) => {
    setItemToDelete(salesOrder);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setSalesOrderData(prev => prev.filter(s => s.id !== itemToDelete.id));
      setItemToDelete(null);
    }
  };

  const handleSort = (field: keyof SalesOrderOperational) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = salesOrderData.filter(item => {
    const matchesNoSO = item.noSO.toLowerCase().includes(searchNoSO.toLowerCase());
    const matchesSOTurunan = item.soTurunan.toLowerCase().includes(searchSOTurunan.toLowerCase());
    const matchesNamaProyek = item.namaProyek.toLowerCase().includes(searchNamaProyek.toLowerCase());
    
    return matchesNoSO && matchesSOTurunan && matchesNamaProyek;
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

  // Compute delay penagihan based on DEMOB date (format: DD-MM-YYYY)
  const computeDelayPenagihan = (demob: string): string => {
    if (!demob) return "-";
    const [dd, mm, yyyy] = demob.split("-").map((v) => parseInt(v, 10));
    if (!dd || !mm || !yyyy) return "-";
    const demobDate = new Date(yyyy, (mm - 1), dd);
    const today = new Date();
    // zero out time
    demobDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - demobDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    return `${diffDays} Hari`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            DASHBOARD SALES ORDER
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Chart */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Grafik Sales Order</h2>
              
              {/* Chart Container */}
              <div className="relative h-80">
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  {/* Y-axis labels */}
                  {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((value, index) => (
                    <g key={value}>
                      <text
                        x="25"
                        y={280 - (value * 240)}
                        textAnchor="end"
                        className="text-xs fill-gray-500"
                      >
                        {value.toFixed(1)}
                      </text>
                      <line
                        x1="30"
                        y1={280 - (value * 240)}
                        x2="380"
                        y2={280 - (value * 240)}
                        stroke="#E5E7EB"
                        strokeWidth="1"
                      />
                    </g>
                  ))}

                  {/* Chart bars */}
                  {chartData.map((item, index) => {
                    const barHeight = item.value * 240;
                    const x = 50 + index * 50;
                    const y = 280 - barHeight;
                    
                    return (
                      <g key={item.label}>
                        {/* Bar */}
                        <rect
                          x={x}
                          y={y}
                          width="35"
                          height={barHeight}
                          fill={item.color}
                          rx="2"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                        
                        {/* X-axis label */}
                        <text
                          x={x + 17.5}
                          y={295}
                          textAnchor="middle"
                          className="text-xs fill-gray-600"
                          transform={`rotate(-45, ${x + 17.5}, 295)`}
                        >
                          {item.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Legend */}
                  <g>
                    <rect x="50" y="20" width="12" height="12" fill="#3B82F6" />
                    <text x="70" y="30" className="text-xs fill-gray-700">Data Belum 6 Bulan</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column - Metrics */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column Metrics */}
              <div className="space-y-4">
                {/* Pencapaian On Call */}
                <div className="bg-cyan-400 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Pencapaian On Call</h3>
                      <p className="text-2xl font-bold">44%</p>
                    </div>
                  </div>
                </div>

                {/* Nominal On Call */}
                <div className="bg-indigo-600 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Nominal On Call</h3>
                      <p className="text-lg font-bold">Rp. 200.000.000</p>
                    </div>
                  </div>
                </div>

                {/* Pencapaian Tender */}
                <div className="bg-green-600 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Pencapaian Tender</h3>
                      <p className="text-2xl font-bold">60%</p>
                    </div>
                  </div>
                </div>

                {/* Nominal Tender */}
                <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Nominal Tender</h3>
                      <p className="text-lg font-bold">Rp. 600.000.000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Metrics */}
              <div className="space-y-4">
                {/* SO Ontime */}
                <div className="bg-cyan-400 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">SO Ontime</h3>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </div>

                {/* SO Delay */}
                <div className="bg-indigo-600 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">SO Delay</h3>
                      <p className="text-2xl font-bold">6</p>
                    </div>
                  </div>
                </div>

                {/* On Call */}
                <div className="bg-green-600 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">On Call</h3>
                      <p className="text-2xl font-bold">150</p>
                    </div>
                  </div>
                </div>

                {/* Tender */}
                <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Tender</h3>
                      <p className="text-2xl font-bold">350</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Sales Order Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Sales Order</h2>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Inputs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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

              {/* Search SO Turunan */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari SO Turunan
                </label>
                <input
                  type="text"
                  value={searchSOTurunan}
                  onChange={(e) => setSearchSOTurunan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="SO001.12"
                />
              </div>

              {/* Search Nama Proyek */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Proyek
                </label>
                <input
                  type="text"
                  value={searchNamaProyek}
                  onChange={(e) => setSearchNamaProyek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                  placeholder="Proyek Medco"
                />
              </div>

              {/* Status Invoice Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Status Invoice
                </label>
                <select
                  value={selectedStatusInvoice}
                  onChange={(e) => setSelectedStatusInvoice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                >
                  <option value="">--Pilih Status Invoice</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Date Range and Search Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                  className="w-full h-10 px-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Export Bar */}
          <div className="flex items-center justify-between mb-6">
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
                        <span>No SO</span>
                        {sortField === 'no' && (
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
                      onClick={() => handleSort('namaProyek')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Nama Proyek</span>
                        {sortField === 'namaProyek' && (
                          <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">MOB</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">DEMOB</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nilai Kontrak</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">HPP</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nilai Produksi</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actual Penagihan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delay Penagihan</th>
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
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.noSO}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.soTurunan}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.namaProyek}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.mob}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.demob}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.nilaiKontrak}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.hpp}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.nilaiProduksi}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.actualPenagihan}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{computeDelayPenagihan(item.demob)}</td>
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
      </div>

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

export default OperationalSalesOrderDashboard;
