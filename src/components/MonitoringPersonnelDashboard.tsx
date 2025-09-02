import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock } from 'lucide-react';

interface Personnel {
  nama: string;
  posisi: string;
}

const sampleData: Personnel[] = [
  { nama: 'Andi Saputra', posisi: 'Radiographer Level 2' },
  { nama: 'Budi Santoso', posisi: 'Assistant Radiographer' },
  { nama: 'Citra Dewi', posisi: 'QHSE Officer' },
  { nama: 'Dewi Kencana', posisi: 'Radiographer Level 1' },
  { nama: 'Eko Prasetyo', posisi: 'Assistant Radiographer' },
  { nama: 'Fajar Nugraha', posisi: 'QHSE Officer' },
];

const MonitoringPersonnelDashboard: React.FC = () => {
  const [searchNama, setSearchNama] = useState('');
  const [filterPosisi, setFilterPosisi] = useState<string>('');
  const [showEntries, setShowEntries] = useState<string>('10');

  const posisiOptions = useMemo(() => {
    const set = new Set(sampleData.map((d) => d.posisi));
    return Array.from(set).sort();
  }, []);

  const filteredData = useMemo(() => {
    const base = sampleData.filter((row) => {
      const matchNama = row.nama.toLowerCase().includes(searchNama.toLowerCase());
      const matchPosisi = filterPosisi ? row.posisi === filterPosisi : true;
      return matchNama && matchPosisi;
    });
    return base;
  }, [searchNama, filterPosisi]);

  const pagedData = useMemo(() => {
    const n = parseInt(showEntries, 10);
    return filteredData.slice(0, n);
  }, [filteredData, showEntries]);

  const handleExport = (type: 'excel' | 'csv' | 'pdf') => {
    // placeholder: integrate real export later
    console.log('Export', type, filteredData);
  };

  const lastUpdated = useMemo(() => new Date().toLocaleString('id-ID'), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section (mirror MCU) */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">MONITORING PERSONNEL</h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Personnel</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section (mirror MCU, only two filters) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Search Nama */}
            <div>
              <label htmlFor="searchNama" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Pegawai</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchNama"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama pegawai..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="posisiFilter" className="block text-sm font-medium text-gray-700 mb-2">Pilih Posisi/Competency</label>
              <div className="relative">
                <select
                  id="posisiFilter"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterPosisi}
                  onChange={(e) => setFilterPosisi(e.target.value)}
                >
                  <option value="">Pilih jenis...</option>
                  {posisiOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {/* Mirror MCU: use Clock as dropdown chevron */}
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" />
              </div>
            </div>

            <div className="lg:col-span-2"></div>
          </div>

          <div className="flex justify-end space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Personnel
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Search className="h-5 w-5 mr-2" /> Cari Data
            </button>
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => handleExport('excel')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button onClick={() => handleExport('csv')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button onClick={() => handleExport('pdf')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
              <Download className="h-5 w-5 mr-2" /> PDF
            </button>
          </div>
        </div>

      

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi/Competency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedData.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-6 text-center text-sm text-gray-500">Tidak ada data</td>
                  </tr>
                ) : (
                  pagedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.posisi}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPersonnelDashboard;
