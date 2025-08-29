import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PlusCircle, Edit, Trash2, FileText, AlertTriangle, Clock, Search, Download } from 'lucide-react';
import EntryProgramModal from './EntryProgramModal'; // Import the new modal component

interface ProgramItem {
  id: string;
  program: string;
  tanggal: string;
  realisasi: string;
  documentUrl: string;
}

const JadwalRealisasiProgramDashboard: React.FC = () => {
  const today = new Date();
  // Normalize today to start of day for consistent date comparison
  const todayStartOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const initialProgramData: ProgramItem[] = [
    {
      id: 'PRG001',
      program: 'Pelatihan K3 Dasar',
      tanggal: '2024-07-15', // Example: If today is 2024-07-01, this is in future. If today is 2024-07-12, this is soon.
      realisasi: '80%',
      documentUrl: '#'
    },
    {
      id: 'PRG002',
      program: 'Inspeksi Lingkungan Triwulan',
      tanggal: '2024-07-05', // Example: If today is 2024-07-01, this is soon and in future.
      realisasi: '100%',
      documentUrl: '#'
    },
    {
      id: 'PRG003',
      program: 'Simulasi Tanggap Darurat',
      tanggal: '2025-09-20', // Example: If today is 2024-07-01, this is in future but not soon.
      realisasi: 'Belum dimulai',
      documentUrl: '#'
    },
    {
      id: 'PRG004',
      program: 'Audit Internal ISO 14001',
      tanggal: '2024-06-28', // Example: If today is 2024-07-01, this is in past.
      realisasi: '95%',
      documentUrl: '#'
    },
    {
      id: 'PRG005',
      program: 'Penyuluhan Bahaya Kimia',
      tanggal: '2024-07-10', // Example: If today is 2024-07-01, this is in future but not soon.
      realisasi: '60%',
      documentUrl: '#'
    },
  ];

  const [programData, setProgramData] = useState<ProgramItem[]>(initialProgramData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Checks if the program date is within 7 days from today (inclusive of today)
  const isProgramDateSoon = (programDate: string): boolean => {
    const date = new Date(programDate);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  // Checks if the program date is strictly after today
  const isProgramDateInFuture = (programDate: string): boolean => {
    const date = new Date(programDate);
    const programDateStartOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return programDateStartOfDay.getTime() > todayStartOfDay.getTime();
  };

  const handleEdit = (id: string) => {
    alert(`Edit Program: ${id}`);
    // Implement edit logic here
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete program ${id}?`)) {
      setProgramData(programData.filter(program => program.id !== id));
      alert(`Program ${id} deleted.`);
    }
  };

  const handleAddProgram = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewProgram = (newProgram: Omit<ProgramItem, 'id'>) => {
    const newId = `PRG${String(programData.length + 1).padStart(3, '0')}`; // Simple ID generation
    setProgramData([...programData, { id: newId, ...newProgram }]);
  };

  const handleExport = (type: string) => {
    alert(`Exporting as ${type}`);
    // Implement export logic here
  };

  // State for search and filter
  const [searchNamaProgram, setSearchNamaProgram] = useState('');
  const [statusRealisasiFilter, setStatusRealisasiFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEntries, setShowEntries] = useState('10');

  const handleSearch = () => {
    alert(`Searching for Nama Program: ${searchNamaProgram}, Status Realisasi: ${statusRealisasiFilter}, Start Date: ${startDate?.toLocaleDateString()}, End Date: ${endDate?.toLocaleDateString()}`);
    // Implement actual search logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-wide mb-2">
                JADWAL & REALISASI PROGRAM
              </h1>
              <nav className="text-sm text-gray-600">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">QHSE</span>
                <span className="mx-2">›</span>
                <span className="text-blue-600 font-medium">Jadwal & Realisasi Program</span>
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
              <label htmlFor="searchNamaProgram" className="block text-sm font-medium text-gray-700 mb-2">Cari Nama Program</label>
              <div className="relative">
                <input
                  type="text"
                  id="searchNamaProgram"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Masukkan nama program..."
                  value={searchNamaProgram}
                  onChange={(e) => setSearchNamaProgram(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="statusRealisasiFilter" className="block text-sm font-medium text-gray-700 mb-2">Pilih Status Realisasi</label>
              <div className="relative">
                <select
                  id="statusRealisasiFilter"
                  className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                  value={statusRealisasiFilter}
                  onChange={(e) => setStatusRealisasiFilter(e.target.value)}
                >
                  <option value="">Pilih status...</option>
                  <option value="Belum dimulai">Belum dimulai</option>
                  <option value="Sedang berjalan">Sedang berjalan</option>
                  <option value="Selesai">Selesai</option>
                  {/* Add more options as needed */}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 rotate-180" /> {/* Chevron down */}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-2">Periode Program</label>
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
              onClick={handleAddProgram}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Tambah Program
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
                    Program
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realisasi
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {programData.map((program) => {
                  const isSoon = isProgramDateSoon(program.tanggal);
                  const isFutureDate = isProgramDateInFuture(program.tanggal);
                  return (
                    <tr key={program.id} className={isFutureDate ? 'bg-red-50 hover:bg-red-100 transition-colors' : 'hover:bg-gray-50 transition-colors'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {program.program}
                        {isSoon && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Mendekati Jadwal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(program.tanggal).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {program.realisasi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={program.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(program.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Program Modal */}
      <EntryProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewProgram}
      />
    </div>
  );
};

export default JadwalRealisasiProgramDashboard;
