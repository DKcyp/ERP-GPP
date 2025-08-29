import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FileText, AlertTriangle, Clock, Search, PlusCircle, Download } from 'lucide-react';
import EntryPTIModal from './EntryPTIModal'; // Import the new modal component

interface PTIAlat {
  id: string;
  namaAlat: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  documentUrl: string;
}

const MonitoringPTIDashboard: React.FC = () => {
  const today = new Date();

  const initialDummyData: PTIAlat[] = [
    {
      id: 'PTI001',
      namaAlat: 'Alat Pelindung Diri (APD)',
      tanggalAwal: '2023-05-01',
      tanggalAkhir: '2024-06-30', // Masa berlaku habis
      documentUrl: '#'
    },
    {
      id: 'PTI002',
      namaAlat: 'Sistem Pemadam Kebakaran',
      tanggalAwal: '2024-02-15',
      tanggalAkhir: '2025-02-15', // Masa berlaku aktif
      documentUrl: '#'
    },
    {
      id: 'PTI003',
      namaAlat: 'Emergency Shower',
      tanggalAwal: '2023-08-01',
      tanggalAkhir: '2024-07-01', // Masa berlaku habis
      documentUrl: '#'
    },
    {
      id: 'PTI004',
      namaAlat: 'Eye Wash Station',
      tanggalAwal: '2024-04-10',
      tanggalAkhir: '2025-04-10', // Masa berlaku aktif
      documentUrl: '#'
    },
    {
      id: 'PTI005',
      namaAlat: 'Detektor Gas',
      tanggalAwal: '2024-01-20',
      tanggalAkhir: '2025-12-31', // Masa berlaku aktif (tidak expired)
      documentUrl: '#'
    },
  ];

  const [ptiData, setPtiData] = useState<PTIAlat[]>(initialDummyData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isMasaBerlakuHabis = (masaBerlakuDate: string): boolean => {
    const expiryDate = new Date(masaBerlakuDate);
    return expiryDate.getTime() < today.getTime();
  };

  // State for search and filter
  const [searchNamaAlat, setSearchNamaAlat] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState('10');

  const handleSearch = () => {
    alert(`Searching for Nama Alat: ${searchNamaAlat}, Start Date: ${startDate?.toLocaleDateString()}, End Date: ${endDate?.toLocaleDateString()}`);
    // Implement actual search logic here
  };

  const handleAddAlat = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewPTI = (newPTI: Omit<PTIAlat, 'id'>) => {
    const newId = `PTI${String(ptiData.length + 1).padStart(3, '0')}`; // Simple ID generation
    setPtiData([...ptiData, { id: newId, ...newPTI }]);
    setIsAddModalOpen(false);
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
                MONITORING PTI
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Monitoring PTI</span>
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

            <div className="lg:col-span-2">
              <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-2">Periode Masa Berlaku</label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative flex-1">
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
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
                    Nama Alat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Awal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Akhir
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ptiData.map((pti) => { // Use ptiData from state
                  const isRed = isMasaBerlakuHabis(pti.tanggalAkhir);
                  return (
                    <tr key={pti.id} className={isRed ? 'bg-red-50 hover:bg-red-100 transition-colors' : 'hover:bg-gray-50 transition-colors'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {pti.namaAlat}
                        {isRed && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pti.tanggalAwal).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(pti.tanggalAkhir).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={pti.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add PTI Modal */}
      <EntryPTIModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewPTI}
      />
    </div>
  );
};

export default MonitoringPTIDashboard;
