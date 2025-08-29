import React, { useState } from 'react';
import { History, Eye, Clock, Search, PlusCircle, Download } from 'lucide-react';
import EntryAlatSafetyModal from './EntryAlatSafetyModal'; // Import the new modal

interface AlatSafety {
  id: string;
  kodeBarang: string;
  namaAlat: string;
  nomorSeri: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  history: string[];
}

const MonitoringAlatSafetyDashboard: React.FC = () => {
  const today = new Date();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false); // Renamed for clarity
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal
  const [selectedHistory, setSelectedHistory] = useState<string[]>([]);
  const [selectedAlatName, setSelectedAlatName] = useState('');

  const [alatSafetyData, setAlatSafetyData] = useState<AlatSafety[]>([ // Manage data in state
    {
      id: 'AS001',
      kodeBarang: 'KB-HS-001',
      namaAlat: 'Helm Safety',
      nomorSeri: 'HS-2023-001',
      kondisi: 'Baik',
      history: ['2024-01-10: Inspeksi rutin', '2024-03-05: Digunakan di Proyek A', '2024-06-12: Pembersihan']
    },
    {
      id: 'AS002',
      kodeBarang: 'KB-ST-005',
      namaAlat: 'Sarung Tangan Anti-Potong',
      nomorSeri: 'ST-2023-005',
      kondisi: 'Rusak Ringan',
      history: ['2024-02-01: Inspeksi rutin', '2024-04-20: Tergores ringan', '2024-06-01: Perbaikan kecil']
    },
    {
      id: 'AS003',
      kodeBarang: 'KB-SS-010',
      namaAlat: 'Sepatu Safety',
      nomorSeri: 'SS-2022-010',
      kondisi: 'Baik',
      history: ['2024-01-20: Inspeksi rutin', '2024-05-15: Digunakan di Proyek B']
    },
    {
      id: 'AS004',
      kodeBarang: 'KB-KS-003',
      namaAlat: 'Kacamata Safety',
      nomorSeri: 'KS-2023-003',
      kondisi: 'Rusak Berat',
      history: ['2024-03-10: Inspeksi rutin', '2024-05-01: Retak pada lensa', '2024-06-10: Direkomendasikan penggantian']
    },
  ]);

  const openHistoryModal = (alatName: string, history: string[]) => {
    setSelectedAlatName(alatName);
    setSelectedHistory(history);
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setSelectedHistory([]);
    setSelectedAlatName('');
  };

  const getKondisiColor = (kondisi: AlatSafety['kondisi']) => {
    switch (kondisi) {
      case 'Baik': return 'bg-green-100 text-green-800';
      case 'Rusak Ringan': return 'bg-yellow-100 text-yellow-800';
      case 'Rusak Berat': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // State for search and filter
  const [searchNamaAlat, setSearchNamaAlat] = useState('');
  const [searchNomorSeri, setSearchNomorSeri] = useState('');
  const [kondisiFilter, setKondisiFilter] = useState('');
  const [showEntries, setShowEntries] = useState('10');

  const handleSearch = () => {
    alert(`Searching for Nama Alat: ${searchNamaAlat}, Nomor Seri: ${searchNomorSeri}, Kondisi: ${kondisiFilter}`);
    // Implement actual search logic here
  };

  const handleAddAlat = () => {
    setIsAddModalOpen(true); // Open the add modal
  };

  const handleSaveNewAlatSafety = (newData: Omit<AlatSafety, 'id' | 'history'>) => {
    const newId = `AS${String(alatSafetyData.length + 1).padStart(3, '0')}`; // Simple ID generation
    const newAlat: AlatSafety = {
      id: newId,
      ...newData,
      history: [`${new Date().toISOString().slice(0, 10)}: Alat baru ditambahkan`], // Initial history entry
    };
    setAlatSafetyData(prevData => [...prevData, newAlat]);
    setIsAddModalOpen(false); // Close the modal after saving
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
    // Implement export logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                MONITORING ALAT SAFETY
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring Alat Safety</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {today.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label htmlFor="searchNamaAlat" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Alat</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchNamaAlat"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama alat..."
                  value={searchNamaAlat}
                  onChange={(e) => setSearchNamaAlat(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="searchNomorSeri" className="block text-sm font-medium text-gray-700 mb-2">Cari Nomor Seri</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchNomorSeri"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nomor seri..."
                  value={searchNomorSeri}
                  onChange={(e) => setSearchNomorSeri(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="kondisiFilter" className="block text-sm font-medium text-gray-700 mb-2">Pilih Kondisi</label>
              <div className="relative">
                <select
                  id="kondisiFilter"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={kondisiFilter}
                  onChange={(e) => setKondisiFilter(e.target.value)}
                >
                  <option value="">Pilih kondisi...</option>
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" /> {/* Chevron down */}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleAddAlat}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Alat
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kode Barang
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Alat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Seri
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kondisi
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alatSafetyData.map((alat, index) => (
                  <tr key={alat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {alat.kodeBarang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {alat.namaAlat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alat.nomorSeri}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getKondisiColor(alat.kondisi)}`}>
                        {alat.kondisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => openHistoryModal(alat.namaAlat, alat.history)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      >
                        <History className="h-4 w-4 mr-1" /> History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* History Modal */}
        {isHistoryModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 fade-in-0 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">History {selectedAlatName}</h3>
                <button onClick={closeHistoryModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {selectedHistory.length > 0 ? (
                  selectedHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Eye className="h-4 w-4 text-gray-500 mt-1" />
                      <p className="text-sm text-gray-700">{entry}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">No history available for this tool.</p>
                )}
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={closeHistoryModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Alat Safety Modal */}
        <EntryAlatSafetyModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewAlatSafety}
        />
      </div>
    </div>
  );
};

export default MonitoringAlatSafetyDashboard;
