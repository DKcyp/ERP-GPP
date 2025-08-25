import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  FileText, 
  File,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUp
} from 'lucide-react';

interface TrainingNotHeldData {
  id: string;
  no: number;
  namaTraining: string;
  jumlahOrang: number;
  alasanTidakTerlaksana: string;
}

const TrainingNotHeld: React.FC = () => {
  const [searchTraining, setSearchTraining] = useState('');
  const [dateFrom, setDateFrom] = useState('03/03/2025');
  const [dateTo, setDateTo] = useState('03/03/2025');
  const [animateRows, setAnimateRows] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof TrainingNotHeldData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Sample data matching the image
  const [trainingNotHeldData] = useState<TrainingNotHeldData[]>([
    {
      id: '1',
      no: 1,
      namaTraining: 'Pelatihan Keamanan Jaringan',
      jumlahOrang: 5,
      alasanTidakTerlaksana: 'Peserta kurang dari minimum'
    },
    {
      id: '2',
      no: 2,
      namaTraining: 'Training Public Speaking',
      jumlahOrang: 10,
      alasanTidakTerlaksana: 'Trainer berhalangan'
    },
    {
      id: '3',
      no: 3,
      namaTraining: 'Pelatihan Teknik Rope Access Level 1',
      jumlahOrang: 8,
      alasanTidakTerlaksana: 'Peralatan tidak tersedia'
    },
    {
      id: '4',
      no: 4,
      namaTraining: 'Workshop Pengujian Non-Destruktif (NDT)',
      jumlahOrang: 12,
      alasanTidakTerlaksana: 'Materi belum siap'
    },
    {
      id: '5',
      no: 5,
      namaTraining: 'Pelatihan Keselamatan Kerja di Ketinggian',
      jumlahOrang: 15,
      alasanTidakTerlaksana: 'Cuaca buruk'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const handleSort = (field: keyof TrainingNotHeldData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter data based on search criteria
  const filteredData = trainingNotHeldData.filter(item => {
    const matchesTraining = item.namaTraining.toLowerCase().includes(searchTraining.toLowerCase());
    return matchesTraining;
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

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs font-bold">⚠</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Training Tidak Terlaksana</h2>
      </div>

      {/* Search Section */}
      <div className="space-y-4 mb-6">
        {/* Search Training */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Cari Training
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchTraining}
              onChange={(e) => setSearchTraining(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              placeholder="Training Public Speaking"
            />
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
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
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors flex items-center space-x-1"
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

      {/* Show entries control */}
      <div className="flex items-center space-x-4 mb-4">
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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
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
                  onClick={() => handleSort('namaTraining')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nama Training</span>
                    {sortField === 'namaTraining' && (
                      <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('jumlahOrang')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Jumlah Orang</span>
                    {sortField === 'jumlahOrang' && (
                      <ArrowUp className={`h-3 w-3 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('alasanTidakTerlaksana')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Alasan Tidak Terlaksana</span>
                    {sortField === 'alasanTidakTerlaksana' && (
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
                  <td className="px-4 py-3 text-sm text-gray-900">{item.namaTraining}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.jumlahOrang}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.alasanTidakTerlaksana}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingNotHeld;
