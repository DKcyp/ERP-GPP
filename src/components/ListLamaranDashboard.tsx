import React, { useState, useEffect } from 'react';
import {
  Search,
  FileSpreadsheet,
  FileText,
  File,
  ThumbsUp, // Changed to ThumbsUp icon
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import { LamaranData } from '../types'; // Import LamaranData from types

const ListLamaranDashboard: React.FC = () => {
  const [searchNamaPelamar, setSearchNamaPelamar] = useState('');
  const [selectedKualifikasi, setSelectedKualifikasi] = useState('');
  const [kualifikasiDropdownOpen, setKualifikasiDropdownOpen] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof LamaranData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image, now with status and keterangan
  const [lamaranData, setLamaranData] = useState<LamaranData[]>([
    {
      id: '1',
      no: 1,
      namaPelamar: 'Rahmat Hidayat',
      noTelp: '0812-3456-7890',
      email: 'rahmat.hidayat@email.com',
      kualifikasi: 'Sarjana Teknik Sipil, pengalaman 4 tahun di bidang konstruksi',
      status: 'Pending',
      keterangan: 'Menunggu review HRD.'
    },
    {
      id: '2',
      no: 2,
      namaPelamar: 'Siti Aisyah',
      noTelp: '0813-9876-5432',
      email: 'siti.aisyah@email.com',
      kualifikasi: 'D3 Manajemen, pengalaman 2 tahun sebagai Admin HRD',
      status: 'Accepted',
      keterangan: 'Lolos seleksi administrasi, menunggu jadwal interview.'
    },
    {
      id: '3',
      no: 3,
      namaPelamar: 'Fauzan Alfarizi',
      noTelp: '0857-6543-2109',
      email: 'fauzan.alfarizi@email.com',
      kualifikasi: 'Sarjana Teknik Sipil, pengalaman 4 tahun di bidang konstruksi',
      status: 'Rejected',
      keterangan: 'Kualifikasi tidak sesuai.'
    },
    {
      id: '4',
      no: 4,
      namaPelamar: 'Lestari Putri',
      noTelp: '0821-1234-5678',
      email: 'lestari.putri@email.com',
      kualifikasi: 'Sarjana Akuntansi, pengalaman 5 tahun sebagai Finance Officer',
      status: 'Interview',
      keterangan: 'Jadwal interview tanggal 10 April 2025.'
    }
  ]);

  const kualifikasiOptions = [
    'Sarjana Teknik Sipil, pengalaman 4 tahun di bidang konstruksi',
    'D3 Manajemen, pengalaman 2 tahun sebagai Admin HRD',
    'Sarjana Akuntansi, pengalaman 5 tahun sebagai Finance Officer'
  ];

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof LamaranData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = lamaranData.filter(item => {
    const matchesNamaPelamar = item.namaPelamar.toLowerCase().includes(searchNamaPelamar.toLowerCase());
    const matchesKualifikasi = selectedKualifikasi ? item.kualifikasi === selectedKualifikasi : true;

    return matchesNamaPelamar && matchesKualifikasi;
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

  const handleThumbUpClick = (item: LamaranData) => {
    console.log(`Thumb up clicked for ${item.namaPelamar}`);
    // Implement your logic for the thumb up button here
    alert(`Approving application for ${item.namaPelamar}`);
  };

  const getStatusColor = (status: LamaranData['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Interview': return 'bg-blue-100 text-blue-800';
      case 'Hired': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            LIST LAMARAN
          </h1>

          {/* Search and Filter Section */}
          <div className="space-y-4 mb-6">
            {/* Search Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Search Nama Pelamar */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cari Nama Pelamar
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchNamaPelamar}
                    onChange={(e) => setSearchNamaPelamar(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    placeholder="Agus"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Kualifikasi Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Kualifikasi
                </label>
                <div className="relative">
                  <button
                    onClick={() => setKualifikasiDropdownOpen(!kualifikasiDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-sm"
                  >
                    <span className={selectedKualifikasi ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedKualifikasi ? selectedKualifikasi.substring(0, 30) + '...' : '--Pilih Kualifikasi--'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${kualifikasiDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {kualifikasiDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedKualifikasi('');
                          setKualifikasiDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500 text-sm"
                      >
                        --Pilih Kualifikasi--
                      </button>
                      {kualifikasiOptions.map((kualifikasi) => (
                        <button
                          key={kualifikasi}
                          onClick={() => {
                            setSelectedKualifikasi(kualifikasi);
                            setKualifikasiDropdownOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                          title={kualifikasi}
                        >
                          {kualifikasi.length > 50 ? kualifikasi.substring(0, 50) + '...' : kualifikasi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                    onClick={() => handleSort('namaPelamar')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nama Pelamar</span>
                      {sortField === 'namaPelamar' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
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
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      {sortField === 'email' && (
                        <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('kualifikasi')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Kualifikasi</span>
                      {sortField === 'kualifikasi' && (
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
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.namaPelamar}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.noTelp}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={item.kualifikasi}>
                        {item.kualifikasi}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleThumbUpClick(item)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-all duration-200 hover:scale-110"
                          title="Approve Application"
                        >
                          <ThumbsUp className="h-4 w-4" />
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
    </div>
  );
};

export default ListLamaranDashboard;
