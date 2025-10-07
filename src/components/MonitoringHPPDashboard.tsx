import React, { useState, useEffect } from 'react';
import {
  Search,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  Calendar,
  Clock,
  Info,
  RefreshCw
} from 'lucide-react';

interface HPPInduk {
  id: string; // No HPP
  no: number;
  pic: string;
  jenisPekerjaan: string;
  lokasi: string;
  estimasiHPP: string;
  statusDokumen: 'Open' | 'Close';
  tanggalUpdate: string;
}

const MonitoringHPPDashboard: React.FC = () => {
  // Filter states
  const [searchNoHPP, setSearchNoHPP] = useState('');
  const [searchPIC, setSearchPIC] = useState('');
  const [searchJenisPekerjaan, setSearchJenisPekerjaan] = useState('');
  const [searchLokasiPekerjaan, setSearchLokasiPekerjaan] = useState('');
  const [selectedStatusDokumen, setSelectedStatusDokumen] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [jenisPekerjaanDropdownOpen, setJenisPekerjaanDropdownOpen] = useState(false);

  // Animation state
  const [animateRows, setAnimateRows] = useState(false);

  // Sample data - same as HPPIndukDashboard
  const [hppIndukData] = useState<HPPInduk[]>([
    {
      id: 'HPP001',
      no: 1,
      pic: 'Budi Santoso',
      jenisPekerjaan: 'ERP Implementation',
      lokasi: 'Jakarta Selatan',
      estimasiHPP: 'Rp 2.500.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '15-01-2025'
    },
    {
      id: 'HPP002',
      no: 2,
      pic: 'Siti Aminah',
      jenisPekerjaan: 'Website Development',
      lokasi: 'Bandung',
      estimasiHPP: 'Rp 750.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '14-01-2025'
    },
    {
      id: 'HPP003',
      no: 3,
      pic: 'Joko Susilo',
      jenisPekerjaan: 'IT Infrastructure Upgrade',
      lokasi: 'Surabaya',
      estimasiHPP: 'Rp 1.200.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '13-01-2025'
    },
    {
      id: 'HPP004',
      no: 4,
      pic: 'Dewi Lestari',
      jenisPekerjaan: 'POS System Integration',
      lokasi: 'Yogyakarta',
      estimasiHPP: 'Rp 450.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '12-01-2025'
    },
    {
      id: 'HPP005',
      no: 5,
      pic: 'Agus Salim',
      jenisPekerjaan: 'Mobile App Development',
      lokasi: 'Medan',
      estimasiHPP: 'Rp 1.800.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '11-01-2025'
    },
    {
      id: 'HPP006',
      no: 6,
      pic: 'Maya Sari',
      jenisPekerjaan: 'Cloud Migration',
      lokasi: 'Makassar',
      estimasiHPP: 'Rp 950.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '10-01-2025'
    },
    {
      id: 'HPP007',
      no: 7,
      pic: 'Rudi Hartono',
      jenisPekerjaan: 'Database Optimization',
      lokasi: 'Palembang',
      estimasiHPP: 'Rp 320.000.000',
      statusDokumen: 'Close',
      tanggalUpdate: '09-01-2025'
    },
    {
      id: 'HPP008',
      no: 8,
      pic: 'Indira Putri',
      jenisPekerjaan: 'Security Audit',
      lokasi: 'Denpasar',
      estimasiHPP: 'Rp 680.000.000',
      statusDokumen: 'Open',
      tanggalUpdate: '08-01-2025'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setAnimateRows(true), 100);
  }, []);

  const getStatusDokumenColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800 border-green-200';
      case 'Close': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusDokumenOptions = ['Open', 'Close'];
  const jenisPekerjaanOptions = ['ERP Implementation', 'Website Development', 'IT Infrastructure Upgrade', 'POS System Integration', 'Mobile App Development', 'Cloud Migration', 'Database Optimization', 'Security Audit', 'Lainnya'];

  const filteredHPPIndukData = hppIndukData.filter(hpp => {
    const matchesNoHPP = searchNoHPP ? hpp.id.toLowerCase().includes(searchNoHPP.toLowerCase()) : true;
    const matchesPIC = searchPIC ? hpp.pic.toLowerCase().includes(searchPIC.toLowerCase()) : true;
    const matchesJenisPekerjaan = searchJenisPekerjaan ? hpp.jenisPekerjaan.toLowerCase().includes(searchJenisPekerjaan.toLowerCase()) : true;
    const matchesLokasi = searchLokasiPekerjaan ? hpp.lokasi.toLowerCase().includes(searchLokasiPekerjaan.toLowerCase()) : true;
    const matchesStatus = selectedStatusDokumen ? hpp.statusDokumen === selectedStatusDokumen : true;

    const hppDate = new Date(hpp.tanggalUpdate.split('-').reverse().join('-')); // Convert DD-MM-YYYY to YYYY-MM-DD for comparison
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = (!fromDate || hppDate >= fromDate) && (!toDate || hppDate <= toDate);

    return matchesNoHPP && matchesPIC && matchesJenisPekerjaan && matchesLokasi && matchesStatus && matchesDate;
  });

  // Summary statistics
  const totalRecords = hppIndukData.length;
  const openRecords = hppIndukData.filter(hpp => hpp.statusDokumen === 'Open').length;
  const closeRecords = hppIndukData.filter(hpp => hpp.statusDokumen === 'Close').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 text-sm">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide mb-1">
                MONITORING HPP
              </h1>
              <nav className="text-xs text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">HRD</span>
                <span className="mx-2">›</span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Monitoring</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring HPP</span>
              </nav>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total HPP</p>
                <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Status Open</p>
                <p className="text-2xl font-bold text-green-600">{openRecords}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Status Close</p>
                <p className="text-2xl font-bold text-red-600">{closeRecords}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Action Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Cari No HPP */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari No HPP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchNoHPP}
                  onChange={(e) => setSearchNoHPP(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari No HPP..."
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Cari PIC */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari PIC
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPIC}
                  onChange={(e) => setSearchPIC(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari PIC..."
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Cari Jenis Pekerjaan Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari Jenis Pekerjaan
              </label>
              <div className="relative">
                <button
                  onClick={() => setJenisPekerjaanDropdownOpen(!jenisPekerjaanDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={searchJenisPekerjaan ? 'text-gray-900' : 'text-gray-500'}>
                    {searchJenisPekerjaan || 'Pilih jenis pekerjaan...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${jenisPekerjaanDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {jenisPekerjaanDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-xs">
                    <button
                      onClick={() => {
                        setSearchJenisPekerjaan('');
                        setJenisPekerjaanDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Jenis Pekerjaan
                    </button>
                    {jenisPekerjaanOptions.map((jenis) => (
                      <button
                        key={jenis}
                        onClick={() => {
                          setSearchJenisPekerjaan(jenis);
                          setJenisPekerjaanDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span>{jenis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cari Lokasi Kerja */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Cari Lokasi Kerja
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchLokasiPekerjaan}
                  onChange={(e) => setSearchLokasiPekerjaan(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                  placeholder="Cari lokasi kerja..."
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Pilih Status Dokumen Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Pilih Status Dokumen
              </label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white text-xs"
                >
                  <span className={selectedStatusDokumen ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedStatusDokumen || 'Pilih status dokumen...'}
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden text-xs">
                    <button
                      onClick={() => {
                        setSelectedStatusDokumen('');
                        setStatusDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-gray-500"
                    >
                      Semua Status
                    </button>
                    {statusDokumenOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatusDokumen(status);
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          status === 'Open' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span>{status}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Periode Dari */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Periode Dari
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Periode Sampai */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Periode Sampai
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Cari Data Button */}
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-xs">
                <Search className="h-3 w-3" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          {/* Export Buttons - No Add Button */}
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 text-xs">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2">
              <FileSpreadsheet className="h-3 w-3" />
              <span>Export Excel</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2">
              <FileText className="h-3 w-3" />
              <span>Export PDF</span>
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2">
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* HPP Monitoring Table - No Action Column */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">No HPP</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">PIC</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Jenis Pekerjaan</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Lokasi</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Estimasi HPP</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Status Dokumen</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">Tanggal Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHPPIndukData.map((hpp, index) => (
                  <tr
                    key={hpp.id}
                    className={`hover:bg-gray-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    } ${animateRows ? 'animate-in fade-in slide-in-from-bottom-2' : 'opacity-0'}`}
                    style={{
                      animationDelay: animateRows ? `${index * 100}ms` : '0ms',
                      animationFillMode: 'forwards'
                    }}
                  >
                    <td className="px-3 py-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 bg-purple-500 rounded-full flex-shrink-0">
                          <Info className="h-1.5 w-1.5 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-900">{hpp.no}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 text-xs">{hpp.id}</td>
                    <td className="px-3 py-2 font-medium text-gray-900 text-xs">{hpp.pic}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{hpp.jenisPekerjaan}</td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{hpp.lokasi}</td>
                    <td className="px-3 py-2 text-gray-600 font-medium text-xs">{hpp.estimasiHPP}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusDokumenColor(hpp.statusDokumen)}`}>
                        {hpp.statusDokumen}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 text-xs">{hpp.tanggalUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Menampilkan {filteredHPPIndukData.length} dari {totalRecords} data
              </div>
              <div className="text-xs text-gray-500">
                Total Estimasi HPP: Rp {hppIndukData.reduce((total, hpp) => {
                  const value = parseInt(hpp.estimasiHPP.replace(/[^\d]/g, ''));
                  return total + value;
                }, 0).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringHPPDashboard;
