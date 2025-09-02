import React, { useMemo, useState } from 'react';
import { Search, PlusCircle, Download, Clock, AlertTriangle } from 'lucide-react';

interface MCURecord {
  nama: string;
  posisi: string;
  provider: string; // Medical Provider
  expiry: string; // ISO date string (Masa Berlaku)
}

const sampleData: MCURecord[] = [
  { nama: 'Andi Wijaya', posisi: 'Radiographer', provider: 'RS Medika Sejahtera', expiry: '2025-01-15' },
  { nama: 'Budi Santoso', posisi: 'Assistant Radiographer', provider: 'Klinik Prima', expiry: '2024-10-20' },
  { nama: 'Citra Lestari', posisi: 'QHSE Officer', provider: 'RSU Harapan', expiry: '2025-12-31' },
  { nama: 'Dewi Puspita', posisi: 'Technician', provider: 'Klinik Mitra', expiry: '2024-11-05' },
  { nama: 'Eko Prasetyo', posisi: 'Supervisor', provider: 'RS Duta', expiry: '2024-12-10' },
];

const positions = Array.from(new Set(sampleData.map((d) => d.posisi)));

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const daysUntil = (iso: string) => {
  const today = new Date();
  const target = new Date(iso);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

const MedicalCheckUpDashboard: React.FC = () => {
  const [searchNama, setSearchNama] = useState('');
  const [filterPosisi, setFilterPosisi] = useState('');
  const [showEntries, setShowEntries] = useState<string>('10');

  const filteredData = useMemo(() => {
    return sampleData.filter((row) => {
      const byNama = row.nama.toLowerCase().includes(searchNama.toLowerCase());
      const byPosisi = filterPosisi ? row.posisi === filterPosisi : true;
      return byNama && byPosisi;
    });
  }, [searchNama, filterPosisi]);

  const displayedData = useMemo(() => {
    const limit = parseInt(showEntries, 10);
    return filteredData.slice(0, isNaN(limit) ? filteredData.length : limit);
  }, [filteredData, showEntries]);

  const handleSearch = () => {
    alert(`Cari: ${searchNama} | Posisi: ${filterPosisi || 'Semua'}`);
  };

  const handleAdd = () => alert('Tambah Data MCU');
  const handleExport = (type: string) => alert(`Export ${type}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section (mirror MCU style) */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MEDICAL CHECK UP (MCU)
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Monitoring Personnel</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Medical Check Up</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Pegawai</label>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama pegawai..."
                  value={searchNama}
                  onChange={(e) => setSearchNama(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posisi / Jabatan</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={filterPosisi}
                  onChange={(e) => setFilterPosisi(e.target.value)}
                >
                  <option value="">Semua Posisi</option>
                  {positions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" />
              </div>
            </div>

            {/* Empty placeholders to keep grid identical to MCU on lg */}
            <div className="hidden lg:block" />
            <div className="hidden lg:block" />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah MCU
            </button>
            <button
              onClick={handleSearch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
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
            <button
              onClick={() => handleExport('Excel')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" /> CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Provider</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedData.map((row, idx) => {
                  const remaining = daysUntil(row.expiry);
                  const expiringSoon = remaining <= 60; // Rule: highlight merah if <= 60 days remaining
                  const expired = remaining < 0;
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.nama}
                        {(expiringSoon || expired) && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> {expired ? 'Expired' : `≤ 60 hari`}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.posisi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.provider}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${expiringSoon || expired ? 'text-red-700 bg-red-50' : 'text-gray-500'}`}> 
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDate(row.expiry)}</span>
                          <span className="text-xs">{remaining >= 0 ? `${remaining} hari lagi` : `${Math.abs(remaining)} hari lewat`}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {displayedData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCheckUpDashboard;
